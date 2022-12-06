const puppeteer = require("puppeteer");

async function runScraper({
    minPrice,
    maxPrice,
    searchWord,
    excludeWords,
    autoBuy,
}) {
    console.log(
        "runScraper",
        minPrice,
        maxPrice,
        searchWord,
        excludeWords,
        autoBuy
    );
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ["--start-maximized"],
    });
    const page = await browser.newPage();
    await page.goto(
        `https://jp.mercari.com/search?keyword=${searchWord}&order=desc&sort=created_time`
    );

    //sleep for 5 sec
    await page.waitForTimeout(5000);
    console.log("sleep for 5 sec");

    const groups = await page.evaluate(() =>
        Array.from(document.getElementsByTagName("mer-item-thumbnail"), (e) => {
            console.log(e);
            return {
                name: e.getAttribute("item-name"),
                price: e.getAttribute("price"),
            };
        })
    );
    console.log(groups);

    await browser.close();
}

runScraper({
    status: "running",
    minPrice: 1000,
    maxPrice: 2000,
    searchWord: "パーカー",
    excludeWords: [],
    autoBuy: false,
});
