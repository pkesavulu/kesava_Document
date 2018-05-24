//puppeteer
const puppeteer = require('puppeteer');
const fs = require('fs');
const csvWriter=require('csv-write-stream')
const writer = csvWriter({
    headers: ['unicode', 'char', 'pinyin', 'fanti', 'cixing', 'words', 'extra'],
});

writer.pipe(fs.createWriteStream('./sample.csv', { flags: 'a' }));
 
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.google.com/');

   //await page.waitForSelector('#q');
   // Get the "viewport" of the page, as reported by the page.

  const dimensions = await page.evaluate(() => {
    var pinyin =document.querySelectorAll('.ctr-p')[0].textContent;
    return {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
      deviceScaleFactor: window.devicePixelRatio   
    };
    writer.write(pinyin);
    console.log(pinyin);
  });

  
  console.log('Dimensions:', dimensions);
 
  await browser.close();
})();