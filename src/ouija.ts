import { Chat, Client, Post } from "photop-client";


export function Ouija(post: Post, client: Client) {
	const match = post.text.match(/\+Ouija (.+)/)
	if (match) {
		post.chat("Ouija etiquette: DO NOT REPLY TO YOURSELF. Question: " + match[1]);
		return (chat: Chat) => {
			if (chat.text.match(/^goodbye$/)) {
				let last = chat.replyTo;
				let message = [];
				if (last) {
					while (last) {
						message.unshift(last.text);
						last = last.replyTo;
					}
				}
				chat.reply("MESSAGE: " + message.join(""));
			}
		}
	}
}