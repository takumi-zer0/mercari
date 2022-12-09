const express = require("express");
const fs = require("fs");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 3333;
const ip = process.env.IP || "localhost";
const redis = require("redis");
const bodyParser = require("body-parser");

const cors = require("cors");
app.use(cors());

//urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

global.merList = [];

async function initRedisPubSub() {
	const client = redis.createClient({ url: `redis://${ip}:6379` });

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
			console.log("merList", merList);
			console.log("settings", settings);
		});
	}, 1000);
}

(async () => {
	await initRedisPubSub();
})();

/*
 * { list: [] }
 */

app.get("/getStatus", (req, res) => {
	console.log("incoming");
	let status = fs.readFileSync("status.json");
	status = JSON.parse(status);

	res.send(status);
});

app.post("/updateStatus", (req, res) => {
	let settings = req.body.settings;
	console.log("update status", settings);
	settings = {
		searchWord: settings.searchWord || "",
		minPrice: settings.minPrice || 0,
		maxPrice: settings.maxPrice || 10000000,
		include: settings.include || [],
		exclude: settings.exclude || [],
		autoBuy: settings.autoBuy || false,
	};
	console.log("settings", settings);
	publisher.publish("settings", JSON.stringify(settings));
	fs.writeFileSync("./settings.json", JSON.stringify(settings));
	res.send(settings);
});

subscriber.subscribe("phoneAuth2", (msg) => {
	if (msg == "waiting") {
		let status = fs.readFileSync("status.json");
		status = JSON.parse(status);
		status["needsPhoneAuth2"] = true;
		fs.writeFileSync("./status.json", JSON.stringify(status));
	}
});

subscriber.subscribe("loginSuccess", (msg) => {
	if (msg == "success") {
		let status = fs.readFileSync("status.json");
		status = JSON.parse(status);
		status["loggedIn"] = true;
		fs.writeFileSync("./status.json", JSON.stringify(status));
	}
});

app.get("/list", (req, res) => {
	res.send(merList);
});

app.post("/login", (req, res) => {
	console.log("login", req.body);
	let tmp = req.body;
	publisher.publish("login", JSON.stringify(tmp));
	res.send("login");
});

app.post("/phoneAuth1", (req, res) => {
	console.log("phoneAuth1", req.body);
	let tmp = req.body;
	publisher.publish("login", JSON.stringify(tmp));
	res.send("OK phoneAuth1");
});

app.post("/phoneAuth2", (req, res) => {
	console.log("phoneAuth2", req.body);
	let tmp = req.body;
	publisher.publish("login", JSON.stringify(tmp));
	let status = fs.readFileSync("status.json");
	status = JSON.parse(status);
	status["needsPhoneAuth2"] = false;
	fs.writeFileSync("./status.json", JSON.stringify(status));
	res.send("OK phoneAuth2");
});

app.listen(port, () => {
	console.log(`app listening at http://localhost:${port}`);
});
