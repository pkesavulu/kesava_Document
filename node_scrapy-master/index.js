const fs = require('fs');
const csvWriter = require('csv-write-stream');
const puppeteer = require('puppeteer');
const Proxy = require('./src/Proxy');
const writer = csvWriter({
    headers: ['unicode', 'char', 'pinyin', 'fanti', 'cixing', 'words', 'extra'],
});



writer.pipe(fs.createWriteStream('./dist/zd1.csv', { flags: 'a' }));


//console.log("writing"+writer.pipe(fs.createWriteStream('./dist/zd.csv', { flags: 'a' })));

function queryJieShi() {
    
    console.log("4th-method");
    
    if (document.title.includes('404')) {
        return null;
    }
    const pinyin = document.querySelectorAll('.dicpy a')[0].textContent;
    //alert(document.querySelectorAll('.dicpy a')[0].textContent)
    

    let fanti = document.querySelectorAll('#ft a');//id a element

   // alert(document.querySelectorAll('#ft a'));

    fanti = fanti && fanti.length > 0 ? fanti[0].textContent : '';
    let jieshi = $$('.tab-page')[0].textContent.split('基本词义');

    console.log(" jieshi " +jieshi);
    console.log(pinyin);

    if (!jieshi || jieshi.length === 0) {
     
        jieshi = $$('.tab-page')[0].textContent.split('基本字义');//$$:document.electmentbyid
    }
   
    let extra = '';
    if (jieshi.length > 1) {
        extra = jieshi[1].trim();
    }

    const [cixing, words] = jieshi[0]
        .trim()
        .split('常用词组')
        .map(st =>(st || '').split('\n').filter(s => s).join(' ')); //['a','b']

    return [pinyin, fanti, cixing, (words || '').split(' ').join(','), extra];
    console.log([pinyin, fanti, cixing, (words || '').split(' ').join(','), extra]);
}

async function fetchJieShi(browser, ucode) {
    const page = await browser.newPage();
    const pageNumber = Math.ceil(ucode.toString(10) / 1000).toString(16); //17
    
    console.log("pageNumber " + Math.ceil(ucode.toString(10) / 1000).toString(16)); //?

    console.log("3rd-method");

  //  console.log(pageNumber);
    console.log("ucode to string " + ucode.toString(16));

    let row = {};
    try {
        await page.goto(`http://www.zdic.net/z/${pageNumber}/xs/${ucode.toString(16)}.htm`, {
            timeout: 20000, //20 sec
            waitUntil: 'networkidle2', //waiting for loading the page
        });
        //http://www.zdic.net/z/17/xs/59bd.htm

        await page.waitForSelector('#q');///---------------------------------------> word ?
       console.log(" waitForSelector "+ await page.waitForSelector('#q'));
        row = await page.evaluate(queryJieShi);

        console.log("evaluate "+page.evaluate(queryJieShi));
       
       // console.log(row);
       
        //console.log(pinyin);

        if (row === null) {
            await page.goto(`http://www.zdic.net/z/${pageNumber}/js/${ucode.toString(16)}.htm`, {
                timeout: 20000,
                waitUntil: 'networkidle2',
            });

            await page.waitForSelector('#q');
            row = await page.evaluate(queryJieShi); //?

            
        }

        await page.close();
    } catch (e) {
        console.log({ ucode, error: e });
    } finally {
        return row;
    }

    return row;
}

async function run() {
    // 0x4e00 - 0x9fa5

    console.log("1st-method");
    try {
        // const proxyUrl = await Proxy.getProxy();
        let ucode = 0x59bd;
        
        //ucode=22973 <= 40869

        // console.info({ proxyUrl });
        while (ucode <= 0x9fa5) {
            const browser = await puppeteer.launch({
                ignoreHTTPSErrors: true,
                
                // args: ['--proxy-server=' + proxyUrl],
                // headless: false,
            });
           // console.log("browswer "+browser);
            for (let i = 0; i <= 200; i++) { //200 ?
                console.log("2nd-method");
                const data = await fetchJieShi(browser, ucode);
                console.log("data "+data);
                if (!Array.isArray(data)) {
                    console.error('failed', ucode.toString(16));
                } else {
                    console.info('done', ucode.toString(16));
                    await writer.write([ucode.toString(16), String.fromCodePoint(ucode), ...data]);
                    //console.log(writer.write([ucode.toString(16),String.fromCodePoint(ucode), ...data]));
                    console.log([String.fromCodePoint(ucode),...data]);
                    console.log([ucode.toString(16),String.fromCodePoint(ucode),...data]);
                }
                ucode++;
            }

            await browser.close();
        }
    } catch (e) {
        console.error(e);
    } finally {
        writer.end();
    }
}

run();
