const redis = require("redis");

async function initRedisPubSub() {
	const client = redis.createClient({ url: "redis://localhost:6379" });

	global.subscriber = client.duplicate();
	global.publisher = client.duplicate();

	await subscriber.connect();
	await publisher.connect();
	console.log("Redis connected");
	publisher.publish("buy", JSON.stringify({ id: "m47473583696" }));
}

initRedisPubSub();
