import fetch from 'node-fetch';

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
            // try adding return_url in checkout
            checkout: {
                // we will see if paddle complains about unknown field
            }
        };

        const paddleRes = await fetch('https://sandbox-api.paddle.com/transactions', { 
            method: 'POST', 
            headers: {
                'Authorization': `Bearer not_valid`,
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
