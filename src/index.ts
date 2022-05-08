import { Chat, Client, Post } from "photop-client";
import { config } from "dotenv";
import { Wordle } from "./wordle";
import { Commands } from "./basecommands";
import { NumberGuess } from "./numberguess";
import { Ouija } from "./ouija";
import { BattleGame } from "./battle";

const noop = ()=>{};
config();

const client = new Client(
	{ username: process.env.USERNAME!, password: process.env.PASSWORD! },
	{ logSocketMessages: false }
);

async function onPost(post: Post){	
	let onChats = [Wordle, Commands, NumberGuess, Ouija, BattleGame].map(f=>f(post, client)).filter((c): c is (chat: Chat)=>void | Promise<(chat: Chat)=>void> =>c!==undefined);
	let update = await post.connect(10 * 60 * 1000, ()=>{
		post.onChat = noop; // (should) allow garbage collector to clean up post to free up memory;
	});
	
	post.onChat = async (chat)=>{
		update();
		const l = await Promise.all(onChats);
		l.forEach(c=>{
			if (typeof c === "function") {
				c(chat)
			}
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