// small problem with this ver of wordle
// if the word is jewel
// and you put trees
// the 4th wont be capitalized because it thinks that the 4th e of jewel belongs to the third e of trees.
// you can fix this by doing a first pass with letters in the correct positions but im too lazy

import { Chat, Client, Post } from "photop-client";

import Words from "./words.json";
const { answers, guesses } = Words;
const guesses_map = Object.fromEntries(
	[...answers, ...guesses].map((e) => [e, true])
);

export function Wordle(post: Post, client: Client) {
	const match = post.text.match(/\+Wordle((?: \@.+?\<[0-f]+\>)*)/);
	if (match) {
		let users = match[1];

		let invited = new Set((users.match(/<([0-f]+)>/g) || []).map(e=>e.match(/<([0-f]+)>/)![1])); //get and remove duplicate ids. if the user mentions themselves, nothing happens. too lazy to remove author.
		let attemptsLeft = 6;
		post.chat(
			`Playing Wordle with ${post.author.username} and ${invited.size} other user(s). Other users may suggest but not play. Chat wordle.rules for info.`
		);
		let word = answers[Math.floor(Math.random() * answers.length)];
		return (chat: Chat) => {
			if (chat.user === post.author || invited.has(chat.user.id)) {
				if (chat.text.match(/^[A-Za-z]{5}$/i)) {
					// validate that it is a 5 letter word.
					const guess = chat.text.toLowerCase();
					if (guess === word) {
						post.chat("YOU WIN. (You can play again.)");
						word =
							answers[Math.floor(Math.random() * answers.length)];
						attemptsLeft = 6;
					} else if (guesses_map[guess]) {
						// validate that it IS a word
						attemptsLeft--;
						if (attemptsLeft === 0) {
							post.chat(
								`You lose. Correct word: ${word}. You can play again.`
							);
							word =
								answers[
									Math.floor(Math.random() * answers.length)
								];
							attemptsLeft = 6;
							return;
						}
						const word_arr = word.split("") as (
							| undefined
							| string
						)[]; // mutable array made for each chat;
						let result = [];
						for (let i = 0; i < 5; i++) {
							let letter = guess[i];
							let index = word_arr.indexOf(letter);
							if (index === -1) {
								result.push("_");
							} else if (index === i) {
								result.push(letter.toUpperCase());
								word_arr[i] = undefined;
							} else {
								result.push(letter.toLowerCase());
								word_arr[i] = undefined;
							}
						}
						post.chat(
							result.join("") +
								" Attempts Left: " +
								attemptsLeft +
								""
						);
					} else {
						post.chat("That's not a word, silly");
					}
				} else if (chat.text === "wordle.answer") {
					post.chat(
						`Answer: '${word}' (This is a cheat command that gives you the answer. You don't lose the game but running it ruins the fun.)`
					);
				}
			}
			if (chat.text === "wordle.rules") {
				post.chat(
					"You have 6 attempts to guess a 5 letter answer. For each guess, there will be a response: upper case indicates it is the correct position. Lower case indicates the letter is somewhere in the word."
				);
			}
		};
	}
}
