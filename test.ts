async function testPaddle() {
    try {
        const amountMinorUnits = "999";
        const transactionBody = {
            items: [
                {
                    quantity: 1,
                    price: {
                        description: "Test premium",
                        unit_price: {
                            amount: amountMinorUnits,
                            currency_code: "USD"
                        },
                        product: {
                            name: "Test premium",
                            tax_category: "standard"
                        }
                    }
                }
            ],
            checkout: {
                return_url: "http://example.com/success",
                cancel_url: "http://example.com/cancel",
                success_url: "http://example.com/success"
            }
        };

        const paddleRes = await fetch('https://sandbox-api.paddle.com/transactions', { 
            method: 'POST', 
            headers: {
                'Authorization': `Bearer pdl_live_0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(transactionBody) 
        });
        const paddleData = await paddleRes.json();
        console.log(JSON.stringify(paddleData, null, 2));
    } catch(e) {
        console.error(e);
    }
}
testPaddle();
