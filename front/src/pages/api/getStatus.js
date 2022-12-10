const axios = require("axios");

export default function handler(req, resp) {
	let settings = req.body;
	console.log(settings);

	axios.get(`http://${process.env.IP}/getStatus`).then((res) => {
		console.log(res, "getStatus");
		resp.send(res.data);
	});
}
