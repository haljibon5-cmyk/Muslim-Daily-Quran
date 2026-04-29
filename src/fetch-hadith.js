import fs from 'fs';
fetch('https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ben-bukhari.json')
  .then(res => res.json())
  .then(data => {
      fs.writeFileSync('src/hadith-meta.json', JSON.stringify(data.metadata.section));
      console.log('done');
  })
  .catch(console.error);
