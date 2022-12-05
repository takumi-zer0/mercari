const puppeteer = require("puppeteer");

/* 
購入リンク：https://jp.mercari.com/purchase/m76552084366(商品ID) 
購入ボタン：/html/body/div[1]/div[1]/div/div/div/div/main/div/div[2]/div/div/div[2]/mer-button/button
*/

async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---- BUY ----
async function buy(id) {
    const mercariUrl = "https://jp.mercari.com/purchase/" + id;

    const browser = await puppeteer.launch({
        headless: false,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        defaultViewport: null,
        //set window size
        args: ["--window-size=1920,1080"],
    });

    const page = await browser.newPage();
    await page.goto(mercariUrl);
    // await page.screenshot({ path: "example.png" });

    // sleep 3 seconds
    await sleep(3000);
    const submitButtonXPath2 =
        "/html/body/div[1]/div[1]/div/div/div/div/main/div/div[2]/div/div/div[2]/mer-button/button";
    const submitButton2 = await page.$x(submitButtonXPath2);
    await submitButton2[0].click();
}
buy();
