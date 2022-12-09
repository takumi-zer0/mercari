const axios = require("axios");

export default function handler(req, res) {
	let settings = req.body;
	console.log("api/setitngs", settings);

	axios
		.post("http://192.168.11.3:3333/updateStatus", {
			settings: settings,
		})
		.then((res) => {
			console.log(res);
		});

	res.send("Hello");
}
