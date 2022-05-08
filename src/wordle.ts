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

let e = ["abcdefghijklmnopqrstuvwxyz", "🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉", "🅰🅱🅲🅳🅴🅵🅶🅷🅸🅹🅺🅻🅼🅽🅾🅿🆀🆁🆂🆃🆄🆅🆆🆇🆈🆉"]
let outlined_letters = Object.fromEntries(e[0].split("").map((val,i)=>[val, e[1][i*2]+e[1][i*2+1]]))
let solid_letters = Object.fromEntries(e[0].split("").map((val,i)=>[val, e[2][i*2]+e[2][i*2+1]]))


export function Wordle(post: Post, client: Client) {
	const match = post.text.match(/\+Wordle((?: \@.+?\<[0-f]+\>)*)/);
	if (match) {
		let users = match[1];
		
		let invited = new Set((users.match(/<([0-f]+)>/g) || []).map(e=>e.match(/<([0-f]+)>/)![1])); //get and remove duplicate ids. if the user mentions themselves, nothing happens. too lazy to remove author.
		let attemptsLeft = 6;
		post.chat(
			`Playing Wordle with ${post.author.username} and ${invited.size} other user(s). Other users may suggest but not play. Chat wordle.rules for info.`
			);
		let unknown_letters = "abcdefghijklmnopqrstuvwxyz".split("");
		let grey_letters = [];
		let word = answers[Math.floor(Math.random() * answers.length)];
		return (chat: Chat) => {
			if (chat.user === post.author || invited.has(chat.user.id)) {
				if (chat.text.match(/^[A-Za-z]{5}$/i)) {
					// validate that it is a 5 letter word.
					const guess = chat.text.toLowerCase();
					if (guess === word) {
						chat.reply("YOU WIN. (You can play again.)");
						word =
							answers[Math.floor(Math.random() * answers.length)];
						attemptsLeft = 6;
					} else if (guesses_map[guess]) {
						// validate that it IS a word
						attemptsLeft--;
						if (attemptsLeft === 0) {
							chat.reply(
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
							let used: Record<string, boolean> = {};
							if (index === -1 && !used[letter]) {
								result.push("_");
								if (unknown_letters.indexOf(letter) != -1) {
									unknown_letters.splice(
										unknown_letters.indexOf(letter),
									1)
									grey_letters.push(letter);
								}
							} else if (index === i && !used[letter]) {
								result.push(solid_letters[letter]);
								used[letter] = true;
								
							} else {
								result.push(outlined_letters[letter])
								used[letter] = true;
							}
						}
						chat.reply(
							result.join("") +
								" Attempts Left: " +
								attemptsLeft +
								""
						);
					} else {
						chat.reply("That's not a word, silly");
					}
				} else if (chat.text === "wordle.answer") {
					chat.reply(
						`Answer: '${word}' (This is a cheat command that gives you the answer. You don't lose the game but running it ruins the fun.)`
					);
				} else if (chat.text === "wordle.addattempt") {
					attemptsLeft++;
					chat.reply(
						`You have ${attemptsLeft} attempt(s) left.`)
				} else if (chat.text === "wordle.letters") {
					
				}
			}
			if (chat.text === "wordle.rules") {
				chat.reply(
					"You have 6 attempts to guess a 5 letter answer. For each guess, there will be a response: upper case indicates it is the correct position. Lower case indicates the letter is somewhere in the word."
				);
			}
		};
	}
}
