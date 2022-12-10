const puppeteer = require("puppeteer");
const fs = require("fs");
const redis = require("redis");

async function initRedisPubSub() {
	const client = redis.createClient({ url: "redis://192.168.11.2:6379" });

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
		global.settings = JSON.parse(msg);
	});

	const browser = await puppeteer.launch({
		headless: true,
		defaultViewport: null,
		executablePath: "/usr/bin/google-chrome",
		args: ["--no-sandbox", "--disable-setuid-sandbox"],
	});
	const page = await browser.newPage();
	await page.setViewport({
		width: 1920,
		height: 1080,
		deviceScaleFactor: 1,
	});

	setInterval(async () => {
		// read settings.json
		if (settings.searchWord == "") {
			return;
		}

		await page.goto(
			`https://jp.mercari.com/search?keyword=${settings.searchWord}&order=desc&sort=created_time`
		);

		// sleep for 2 seconds
		await page.waitForTimeout(3000);

		const groups = await page.evaluate(() =>
			Array.from(
				document.getElementsByTagName("mer-item-thumbnail"),
				(e) => {
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

		console.log("groups", groups[0], groups[1]);

		let filteredGroups = groups.filter(
			(e) =>
				Number(e.price) >= Number(settings.minPrice) &&
				Number(e.price) <= Number(settings.maxPrice)
		);

		if (settings.include.length > 0) {
			filteredGroups = filteredGroups.filter((e) =>
				settings.include.includes(e.name)
			);
		}

		if (settings.exclude.length > 0) {
			filteredGroups = filteredGroups.filter(
				(e) => !settings.exclude.includes(e.name)
			);
		}

		publisher.publish("merList", JSON.stringify({ list: filteredGroups }));
		if (
			(settings.autoBuy == "true" || settings.autoBuy == true) &&
			filteredGroups.length > 1
		) {
			console.log("AUTO BUY");
			let buyItem = filteredGroups[0]["id"];
			publisher.publish("buy", JSON.stringify({ id: buyItem }));
		}
	}, 4500);
}

runScraper();
