//use to read content
const puppeteer = require('puppeteer');
const fs = require('fs');
const csvWriter=require('csv-write-stream')
const writer = csvWriter({
    headers: ['content'],
});

writer.pipe(fs.createWriteStream('./samplecontent.csv', { flags: 'a' }));

(async () => {
  
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  try{
  await page.goto('https://www.google.com'); 
 
  const textContent = await page.evaluate(() => document.querySelector('p').textContent);
 // const innerText = await page.evaluate(() => document.querySelector('p').innerText);


  console.log(textContent);
  //console.log(innerText);


  browser.close();
}
catch(e){
console.log(e);
}
})();