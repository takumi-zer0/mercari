const axios = require("axios");

export default function handler(req, resp) {
	let settings = req.body;
	console.log(settings);

	axios.get("http://192.168.11.3:3333/getStatus").then((res) => {
		console.log(res, "getStatus");
		resp.send(res.data);
	});
}
