import 'dotenv/config';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { initializeApp as adminInitializeApp, cert as adminCert } from 'firebase-admin/app';
import { getAuth as adminGetAuth } from 'firebase-admin/auth';
import { getFirestore as adminGetFirestore } from 'firebase-admin/firestore';

try {
    let serviceAccount = null;

    // Handle Render's /etc/secrets/ directory for Firebase JSON files
    if (fs.existsSync('/etc/secrets')) {
        const files = fs.readdirSync('/etc/secrets');
        for (const file of files) {
            try {
                const rawData = fs.readFileSync(`/etc/secrets/${file}`, 'utf8');
                const parsed = JSON.parse(rawData);
                // Basic check to see if it's a firebase service account
                if (parsed.project_id && parsed.private_key) {
                    serviceAccount = parsed;
                    console.log(`Firebase Admin initialized via Secret File: /etc/secrets/${file}`);
                    break;
                }
            } catch(e) {
                // Not a json file, skip
            }
        }
    }

    if (!serviceAccount && process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        try {
            serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
            console.log("Firebase Admin initialized via FIREBASE_SERVICE_ACCOUNT_KEY");
        } catch (e) {
            // Also check if FIREBASE_SERVICE_ACCOUNT_KEY is a path (e.g., Render secret file path manually set)
            if (fs.existsSync(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)) {
                const rawData = fs.readFileSync(process.env.FIREBASE_SERVICE_ACCOUNT_KEY, 'utf8');
                serviceAccount = JSON.parse(rawData);
                console.log(`Firebase Admin initialized via Key Path: ${process.env.FIREBASE_SERVICE_ACCOUNT_KEY}`);
            }
        }
    }

    if (serviceAccount) {
        adminInitializeApp({
            credential: adminCert(serviceAccount)
        });
    } else {
        console.warn("FIREBASE_SERVICE_ACCOUNT_KEY is missing. Falling back to default application credentials.");
        adminInitializeApp();
    }
} catch (e) {
    console.error("Firebase Admin Init Error:", e);
}

async function generatePayPalAccessToken() {
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
    
    if (!clientId || !clientSecret) {
        throw new Error('PayPal Client ID or Secret is missing in environment variables. Please add PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET to your AI Studio settings.');
    }

    const baseURL = process.env.PAYPAL_MODE === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';

    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    const response = await fetch(`${baseURL}/v1/oauth2/token`, {
        method: "POST",
        body: "grant_type=client_credentials",
        headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded"
        },
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`PayPal OAuth Error: ${errorData.error_description || errorData.error || 'Failed to authenticate with PayPal. Please check your credentials.'}`);
    }

    const data = await response.json();
    return { accessToken: data.access_token, baseURL };
}

async function startServer() {
    const app = express();
    const PORT = 3000;

    app.use(express.json());

    // Create PayPal Order
    app.post('/api/create-paypal-order', async (req, res) => {
        try {
            const { planId, days, paymentMethod } = req.body;

            let price = '0.00';
            let name = '';
            if (planId === 'weekly') { price = '2.99'; name = '7 Days Premium Access'; }
            else if (planId === 'monthly') { price = '9.99'; name = '1 Month Premium Access'; }
            else if (planId === 'yearly') { price = '80.00'; name = '1 Year Premium Access'; }
            else { return res.status(400).json({ error: 'Invalid plan' }); }

            const domainURL = req.headers.origin || req.headers.referer?.slice(0, -1) || `http://localhost:${PORT}`;

            // Handle Paddle for Card Payments
            if (paymentMethod === 'card') {
                if (!process.env.PADDLE_API_KEY) {
                    return res.status(500).json({ error: 'Paddle API key is not configured. Please add PADDLE_API_KEY to Settings.' });
                }
                
                const returnUrl = `${domainURL}/?success=true&days=${days}`;
                // Append it directly? Paddle Billing Transactions endpoint doesn't accept return_url in checkout so we use checkout.url ?
                // Paddle Billing v2 transactions structure
                const amountMinorUnits = Math.round(parseFloat(price) * 100).toString();
                
                const transactionBody = {
                    items: [
                        {
                            quantity: 1,
                            price: {
                                description: name,
                                unit_price: {
                                    amount: amountMinorUnits,
                                    currency_code: "USD"
                                },
                                product: {
                                    name: name,
                                    tax_category: "standard"
                                }
                            }
                        }
                    ],
                    checkout: {
                        url: returnUrl 
                        // Wait, no. Pass checkout object as empty? Oh wait, paddle doesn't let you set checkout.url . It generates one.
                    },
                    custom_data: {
                        days: String(days)
                    }
                };
                
                // We will remove the "checkout: { url: returnUrl }" because it may be rejected by Paddle.
                delete (transactionBody as any).checkout;

                const paddleURL = process.env.PADDLE_MODE === 'live' ? 'https://api.paddle.com/transactions' : 'https://sandbox-api.paddle.com/transactions';
                
                try {
                    const paddleRes = await fetch(paddleURL, { 
                        method: 'POST', 
                        headers: {
                            'Authorization': `Bearer ${process.env.PADDLE_API_KEY}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(transactionBody) 
                    });
                    const paddleData = await paddleRes.json();
                    
                    if (paddleRes.ok && paddleData.data && paddleData.data.checkout && paddleData.data.checkout.url) {
                        return res.json({ url: paddleData.data.checkout.url });
                    } else {
                        throw new Error(paddleData.error?.detail || paddleData.error?.message || 'Failed to create checkout link.');
                    }
                } catch (error: any) {
                    return res.status(500).json({ error: `Paddle API Error: ${error.message}` });
                }
            }

            // Fallback to PayPal
            if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
                return res.status(500).json({ error: 'PayPal credentials are not configured. Please add PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET to Settings.' });
            }

            const { accessToken, baseURL } = await generatePayPalAccessToken();

            const response = await fetch(`${baseURL}/v2/checkout/orders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    intent: "CAPTURE",
                    purchase_units: [{
                        amount: {
                            currency_code: "USD",
                            value: price
                        },
                        description: name,
                        custom_id: days.toString()
                    }],
                    payment_source: {
                        paypal: {
                            experience_context: {
                                payment_method_preference: "IMMEDIATE_PAYMENT_REQUIRED",
                                landing_page: paymentMethod === 'card' ? "BILLING" : "LOGIN",
                                user_action: "PAY_NOW",
                                return_url: `${domainURL}/api/capture-paypal-order`,
                                cancel_url: `${domainURL}/?canceled=true`
                            }
                        }
                    }
                })
            });

            const order = await response.json();
            if (order.id) {
                const approveLink = order.links.find((link: any) => link.rel === "payer-action" || link.rel === "approve");
                res.json({ url: approveLink ? approveLink.href : `https://www.paypal.com/checkoutnow?token=${order.id}` });
            } else {
                console.error("PayPal Create Order Error:", order);
                res.status(500).json({ error: 'Failed to create PayPal order checkout link' });
            }
        } catch (error: any) {
            console.error("PayPal Endpoint Error:", error);
            res.status(500).json({ error: error.message || 'Internal Server Error' });
        }
    });

    // Capture PayPal Order upon return
    app.get('/api/capture-paypal-order', async (req, res) => {
        const { token } = req.query; // token is the PayPal order ID
        try {
            if (!token) return res.redirect(`/?canceled=true`);

            const { accessToken, baseURL } = await generatePayPalAccessToken();
            const response = await fetch(`${baseURL}/v2/checkout/orders/${token}/capture`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`
                }
            });

            const captureData = await response.json();

            if (captureData.status === "COMPLETED") {
                const days = captureData.purchase_units?.[0]?.custom_id || 30;
                res.redirect(`/?success=true&days=${days}`);
            } else {
                console.error("Capture not completed:", captureData);
                res.redirect(`/?canceled=true`);
            }
        } catch (error) {
            console.error("Capture Error:", error);
            res.redirect(`/?canceled=true`);
        }
    });

    app.delete('/api/admin/users/:userId', async (req, res) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ error: 'Unauthorized: Missing token' });
            }
            
            const token = authHeader.split('Bearer ')[1];
            
            try {
                // Verify the admin's token
                await adminGetAuth().verifyIdToken(token);
            } catch (err) {
                return res.status(401).json({ error: 'Unauthorized: Invalid token' });
            }

            const { userId } = req.params;

            // Delete from Firestore First (in case auth delete fails but we still want to wipe data, or vice versa, but doesn't matter too much)
            try {
                // Now using admin SDK for Firebase Auth
                await adminGetAuth().deleteUser(userId);
            } catch (authErr: any) {
                console.error("Firebase Auth Delete Error:", authErr);
                return res.status(500).json({ error: 'Failed to delete from Auth. Ensure FIREBASE_SERVICE_ACCOUNT_KEY is set in AI Studio Settings (from Firebase Console -> Project Settings -> Service Accounts).' });
            }

            res.json({ success: true, message: 'User deleted from Firebase Auth.' });
        } catch (error: any) {
            console.error("Delete user error:", error);
            res.status(500).json({ error: error.message || 'Internal Server Error' });
        }
    });

    if (process.env.NODE_ENV !== "production") {
        const vite = await createViteServer({
            server: { middlewareMode: true },
            appType: "spa",
        });
        app.use(vite.middlewares);
    } else {
        const distPath = path.join(process.cwd(), 'dist');
        app.use(express.static(distPath));
        app.get('*', (req, res) => {
            res.sendFile(path.join(distPath, 'index.html'));
        });
    }

    app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server running on http://0.0.0.0:${PORT}`);
    });
}

startServer();
