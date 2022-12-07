const puppeteer = require("puppeteer");
const fs = require("fs");
const redis = require("redis");

async function initRedisPubSub() {
	const client = redis.createClient({ url: "redis://localhost:6379" });

	global.subscriber = client.duplicate();
	global.publisher = client.duplicate();

	await subscriber.connect();
	await publisher.connect();
	console.log("Redis connected");
	return { subscriber, publisher };
}

async function runScraper() {
	await initRedisPubSub();
	subscriber.subscribe("settings", (msg) => {
		console.log("msg", msg);
		global.settings = JSON.parse(msg);
	});

	const browser = await puppeteer.launch({
		headless: false,
		defaultViewport: null,
		args: ["--start-maximized"],
	});
	const page = await browser.newPage();

	setInterval(async () => {
		// read settings.json

		await page.goto(
			`https://jp.mercari.com/search?keyword=${settings.searchWord}&order=desc&sort=created_time`
		);

		// sleep for 2 seconds
		await page.waitForTimeout(3000);

		const groups = await page.evaluate(() =>
			Array.from(
				document.getElementsByTagName("mer-item-thumbnail"),
				(e) => {
					console.log(e);
					// get parent href
					const parent = e.parentElement;
					const href = parent.href;
					// get last element when split by "/"
					const id = href.split("/").pop();
					return {
						name: e.getAttribute("item-name"),
						price: e.getAttribute("price"),
						id: id,
					};
				}
			)
		);
		console.log(groups);

		const filteredGroups = groups.filter(
			(e) =>
				e.price >= settings.minPrice &&
				e.price <= settings.maxPrice &&
				!settings.excludeWords.some((word) => e.name.includes(word))
		);
		console.log(filteredGroups);
		publisher.publish("merList", JSON.stringify({ list: filteredGroups }));
		if (settings.autoBuy === true) {
			let buyItem = filteredGroups[0]["id"];
			publisher.publish("buy", JSON.stringify({ id: buyItem }));
		}
	}, 4500);
}

runScraper();
