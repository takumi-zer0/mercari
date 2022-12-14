const puppeteer = require("puppeteer");
const redis = require("redis");

/* 
購入リンク：https://jp.mercari.com/purchase/m76552084366(商品ID) 
購入ボタン：/html/body/div[1]/div[1]/div/div/div/div/main/div/div[2]/div/div/div[2]/mer-button/button
*/
require("dotenv").config();
const readline = require("readline");

async function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getInput() {
	return new Promise((resolve) => {
		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		});
		rl.question("Enter your input: ", (input) => {
			rl.close();
			resolve(input);
		});
	});
}

// ---- LOGIN ----
async function main() {
	let account = {
		email: "",
		password: "",
		phoneAuth1: "",
		phoneAuth2: "",
	};
	let firstTimeBuying = true;

	subscriber.subscribe("login", (msg) => {
		console.log("msg", msg);
		let tmp = JSON.parse(msg);
		account.email = tmp.email || account.email;
		account.password = tmp.password || account.password;
		account.phoneAuth1 = tmp.phoneAuth1 || account.phoneAuth1;
		account.phoneAuth2 = tmp.phoneAuth2 || account.phoneAuth2;
	});

	const mercariUrl = "https://jp.mercari.com/";
	const browser = await puppeteer.launch({
		headless: true,
		defaultViewport: null,
		executablePath: "/usr/bin/google-chrome",
		//set window size
		args: [
			"--no-sandbox",
			"--disable-setuid-sandbox",
			"--window-size=1920,1080",
		],
	});
	const page = await browser.newPage();
	await page.goto(mercariUrl);
	// await page.screenshot({ path: "example.png" });

	// sleep 3 seconds
	await sleep(3000);
	const loginButtonXPath =
		"/html/body/div[1]/div[1]/div/div/header/mer-navigation-top/nav/mer-navigation-top-menu/mer-navigation-top-menu-item[2]/span";
	const loginButton = await page.$x(loginButtonXPath);
	await loginButton[0].click();

	// sleep 3 seconds
	await sleep(3000);

	const mailLoginButtonXPath =
		"/html/body/div[1]/div/div/div/main/div/div/div/mer-button[1]";
	const mailLoginButton = await page.$x(mailLoginButtonXPath);
	await mailLoginButton[0].click();

	// sleep 3 seconds
	await sleep(3000);

	while (true) {
		console.log("waiting for email");
		await sleep(5000);
		if (account.email !== "" && account.password !== "") {
			break;
		}
	}

	const mailAddressXPath =
		"/html/body/div[1]/div/div/div/main/div/div/form/mer-text-input[1]/div/label/div[2]/input";
	const mailAddress = await page.$x(mailAddressXPath);
	await mailAddress[0].type(account.email);

	const passwordXPath =
		"/html/body/div[1]/div/div/div/main/div/div/form/mer-text-input[2]/div/label/div[2]/input";
	const password = await page.$x(passwordXPath);
	await password[0].type(account.password);

	// sleep 3 seconds
	await sleep(3000);

	const submitButtonXPath =
		"/html/body/div[1]/div/div/div/main/div/div/form/mer-button/button";
	const submitButton = await page.$x(submitButtonXPath);
	await submitButton[0].click();

	// sleep 3 seconds
	await sleep(3000);

	while (true) {
		console.log("waiting for phone");
		await sleep(5000);
		if (account.phoneAuth1 !== "") {
			break;
		}
	}

	const phoneNumberXPath =
		"/html/body/div[1]/div/div/div/main/div/div/div/div[1]/form/mer-text-input/div/label/div[2]/input";
	const phoneNumber = await page.$x(phoneNumberXPath);
	await phoneNumber[0].type(account.phoneAuth1);

	// sleep 3 seconds
	await sleep(3000);

	const submitButtonXPath2 =
		"/html/body/div[1]/div/div/div/main/div/div/div/div[1]/form/mer-button/button";
	const submitButton2 = await page.$x(submitButtonXPath2);
	await submitButton2[0].click();

	publisher.publish("loginSuccess", "success");

	subscriber.subscribe("buy", async (msg) => {
		if (stat === "idle") {
			stat = "buying";
			console.log("msg", msg);
			const data = JSON.parse(msg);
			const buyUrl = "https://jp.mercari.com/purchase/" + data.id;
			await page.goto(buyUrl);
			// await page.screenshot({ path: "example.png" });

			// sleep 3 seconds
			await sleep(5000);
			const submitButtonXPath2 =
				"/html/body/div[1]/div[1]/div/div/div/div/main/div/div[2]/div/div/div[2]/mer-button/button";
			const submitButton2 = await page.$x(submitButtonXPath2);
			await submitButton2[0].click();
			await sleep(3000);

			if (firstTimeBuying) {
				// sleep 3 seconds
				while (true) {
					console.log("waiting for phoneAuth2");
					publisher.publish("phoneAuth2", "waiting");
					await sleep(3000);
					if (account.phoneAuth2 !== "") {
						firstTimeBuying = false;
						break;
					}
				}
				await sleep(3000);
				const phoneNumberXPath2 =
					"/html/body/div[1]/div[1]/div/div/div/div/main/section[1]/form/mer-text-input/div/label/div[2]/input";
				const phoneNumber2 = await page.$x(phoneNumberXPath2);
				await phoneNumber2[0].type(account.phoneAuth2);

				const submitButtonXPath3 =
					"/html/body/div[1]/div[1]/div/div/div/div/main/section[1]/form/mer-button/button";
				const submitButton3 = await page.$x(submitButtonXPath3);
				await submitButton3[0].click();
			}
		}
	});
}

async function initRedisPubSub() {
	const client = redis.createClient({ url: "redis://192.168.11.2:6379" });

	global.subscriber = client.duplicate();
	global.publisher = client.duplicate();
	global.stat = "idle";

	await subscriber.connect();
	await publisher.connect();

	console.log("Redis connected");
}

initRedisPubSub();
main();
