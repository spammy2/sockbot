import { Chat, Client, Post } from "photop-client";

export function NumberGuess(post: Post, client: Client) {
	const a = post.text.match(/\+NumberGuess( \d+)?/);
	if (a) {
		let tries = 0;
		let max = parseInt(a[1]) || 100;
		let num = Math.floor(Math.random() * max);
		post.chat(`Playing NumberGuess! Type in a number between 0 and ${max}`);

		return (chat: Chat) => {
			let guess;
			if ((guess = parseInt(chat.text))) {
				tries++;
				if (guess === num) {
					chat.reply(`You won in ${tries} tries!`);
					num = Math.floor(Math.random() * max);
					tries = 0;
				} else if (guess > num) {
					chat.reply("Too high! Try again.");
				} else {
					chat.reply("Too low! Try again.");
				}
			}
		};
	}
}
