const https = require('https');
https.get('https://translate.googleapis.com/translate_tts?ie=UTF-8&client=gtx&tl=en&q=hello', (res) => {
    console.log(res.statusCode);
});
