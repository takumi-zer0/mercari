const puppeteer = require("puppeteer");
const fs = require("fs");

async function runScraper() {
	const browser = await puppeteer.launch({
		headless: false,
		defaultViewport: null,
		args: ["--start-maximized"],
	});
	const page = await browser.newPage();

	setInterval(async () => {
		// read settings.json
		const settings = JSON.parse(
			fs.readFileSync("../settings.json", "utf8")
		);
		console.log("settings", settings);
		const { minPrice, maxPrice, searchWord, excludeWords, autoBuy } =
			settings;

		await page.goto(
			`https://jp.mercari.com/search?keyword=${searchWord}&order=desc&sort=created_time`
		);

		// sleep for 2 seconds
		await page.waitForTimeout(4000);

		const groups = await page.evaluate(() =>
			Array.from(
				document.getElementsByTagName("mer-item-thumbnail"),
				(e) => {
					console.log(e);
					return {
						name: e.getAttribute("item-name"),
						price: e.getAttribute("price"),
					};
				}
			)
		);
		console.log(groups);

		const filteredGroups = groups.filter(
			(e) =>
				e.price >= minPrice &&
				e.price <= maxPrice &&
				!excludeWords.some((word) => e.name.includes(word))
		);
		console.log(filteredGroups);
	}, 5000);
}

runScraper();
