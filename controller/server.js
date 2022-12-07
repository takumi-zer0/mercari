const express = require("express");
const fs = require("fs");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 3333;
const redis = require("redis");

global.merList = [];

async function initRedisPubSub() {
	const client = redis.createClient({ url: "redis://localhost:6379" });

	global.subscriber = client.duplicate();
	global.publisher = client.duplicate();

	await subscriber.connect();
	await publisher.connect();
	console.log("Redis connected");
	subscriber.subscribe("merList", (msg) => {
		console.log("msg", msg);
		let list = JSON.parse(msg);
		// append to merList only if not already present
		list["list"].forEach((mer) => {
			let item = JSON.stringify(mer);
			console.log("item", item);
			if (!merList.includes(item)) {
				merList.push(item);
			}
		});
	});

	setInterval(() => {
		fs.readFile("settings.json", (err, data) => {
			if (err) throw err;
			let settings = JSON.parse(data);
			publisher.publish("settings", JSON.stringify(settings));
			console.log("pub", merList);
		});
	}, 1000);
}

(async () => {
	await initRedisPubSub();
})();

/*
 * { list: [] }
 */

app.get("/status", (req, res) => {
	console.log("incoming");
	const settings = JSON.parse(fs.readFileSync("./settings.json", "utf8"));
	publiser.publish("settings", JSON.stringify(settings));
	res.send(settings);
});

app.post("/updateStatus", (req, res) => {
	const settings = req.body.settings;
	publiser.publish("settings", JSON.stringify(settings));
	fs.writeFileSync("../settings.json", JSON.stringify(settings));
	res.send(settings);
});

app.get("/list", (req, res) => {
	res.send(merList);
});

app.listen(port, () => {
	console.log(`app listening at http://localhost:${port}`);
});
