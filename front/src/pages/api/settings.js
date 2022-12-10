const axios = require("axios");

export default function handler(req, res) {
	let settings = req.body;
	console.log("api/setitngs", settings);

	axios
		.post(`http://${process.env.IP}/updateStatus`, {
			settings: settings,
		})
		.then((res) => {
			console.log(res);
		});

	res.send("Hello");
}
