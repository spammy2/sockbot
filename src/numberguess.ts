import { Chat, Client, Post } from "photop-client";

export function NumberGuess(post: Post, client: Client) {
	const a = post.text.match(/\+NumberGuess( \d+)?/);
	console.log("e", a);
	if (a) {
		let max = parseInt(a[1]) || 100;
		let num = Math.floor(Math.random() * max);
		post.chat(`Playing NumberGuess! Type in a number between 0 and ${max}`);
		
		return (chat: Chat) => {
			let guess;
			if ((guess = parseInt(chat.text))) {
				if (guess === num) {
					post.chat("You win! (You can play again.)");
					num = Math.floor(Math.random() * max);
				} else if (guess > num) {
					chat.reply("Too high! Try again.");
				} else {
					chat.reply("Too low! Try again.");
				}
			}
		};
	}
}
