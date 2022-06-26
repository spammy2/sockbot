const {Client} = require("photop-client");
require("dotenv").config();

const client = new Client({
	username: process.env.USERNAME,
	password: process.env.PASSWORD,
}, {
	logSocketMessages: true,
});
console.log(client)

client.onReady = async () => {
	setInterval(()=>{
		console.log(client._network.simpleSocket.secureID)
	}, 100);
	const posts = ["629fdd2f7d2e8b7b6ae2022f"];
	var times = 0;
	setInterval(async function () {
		if (posts[times] != undefined) {
			const post = client.getPostFromCache(posts[times]);
			if (post != undefined) {
				console.log(post);
				setTimeout(async function () {
					post.chat("test");
					post.onChat = (chat) => {
						console.log("works");
						if (chat.text == "save") {
							if (posts.indexOf(post.id) < 0) {
								posts.push(post.id);
								
							} else {
								post.chat("no");
							}
						}
						//
					};
					await post.connect();
					posts.splice(posts.indexOf(posts[times]), 1);
					times += 1;
				}, 100);
			} else {
				times += 1;
			}
		}
	}, 5000);
	console.log("reayd");
};
