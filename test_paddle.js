const fetch = require('node-fetch');
async function test() {
  const paddleURL = 'https://sandbox-api.paddle.com/transactions';
  const apiKey = 'test_key'; 
  
  const body = {
    items: [
      {
        quantity: 1,
        price: {
          description: "Test Product",
          unit_price: {
            amount: "999",
            currency_code: "USD"
          },
          product: {
            name: "Test Product",
            tax_category: "standard"
          }
        }
      }
    ]
  };

  const res = await fetch(paddleURL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  console.log(await res.json());
}
test();
