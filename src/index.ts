// why am i putting sockbot.ts in source? because i dont know where to put it so it just gonna go in as well
import { Chat, Client, Post } from "photop-client";
import { config } from "dotenv";
import { Wordle } from "./wordle";
import { Commands } from "./basecommands";

const noop = ()=>{};
config();

const client = new Client(
	{ username: process.env.USERNAME!, password: process.env.PASSWORD! },
	{ logSocketMessages: true }
);

async function onPost(post: Post){	
	let onChats = [Wordle, Commands].map(f=>f(post, client)).filter((c): c is (chat: Chat)=>void=>c!==undefined);
	let update = await post.connect(120000, ()=>{
		post.onChat = noop; // (should) allow garbage collector to clean up post to free up memory;
	});
	post.onChat = (chat)=>{
		update();
		onChats.forEach(c=>{
			c(chat)
		})
	}
}

client.onPost = onPost;

client.onReady = async () => {
	console.log("READY!");
	//client.groups["61c7637eebb7436adbfcdc11"].post("test");
	//const post = await client.post("Hello. I am SockBot. I am an actual bot, and I actually work.");
};

console.log("running sockbot");
console.log(client);