const puppeteer = require('puppeteer');

puppeteer.launch().then(async browser => { 
  const page = await browser.newPage();
  let currentURL;
  page
    .waitForSelector('img')
    .then(() => console.log('First URL with image: ' + currentURL));
  for (currentURL of ['https://example.com', 'https://google.com', 'https://bbc.com'])
    await page.goto(currentURL);
    await page.screenshot({path:'a.png'});
  await browser.close();
});