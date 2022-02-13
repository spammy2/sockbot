import { Chat, Client, Post } from "photop-client";

import Words from "./words.json";
const {answers, guesses} = Words;
const guesses_map = Object.fromEntries([...answers, ...guesses].map(e=>[e, true]));

export function Wordle(post: Post, client: Client){
	if (post.text.match(/\+Wordle/)) {
		let attemptsLeft = 6;
		post.chat(`Playing Wordle with ${post.author.username}. Other players may suggest answers but may not play the game itself. Attempts Left: ${attemptsLeft}. Chat wordle.rules for info.`);
		let word = answers[Math.floor(Math.random()*answers.length)];
		return (chat: Chat)=>{
			if (chat.user === post.author) {
				if (chat.text.match(/^[A-Za-z]{5}$/i)) { // validate that it is a 5 letter word.
					const guess = chat.text.toLowerCase();
					if (guess===word) {
						post.chat("YOU WIN. (You can play again.)");
						word = answers[Math.floor(Math.random()*answers.length)];
						attemptsLeft = 6;
					} else if (guesses_map[guess]) { // validate that it IS a word
						attemptsLeft--;
						if (attemptsLeft === 0) {
							post.chat(`You lose. Correct word: ${word}. You can play again.`);
							word = answers[Math.floor(Math.random()*answers.length)];
							attemptsLeft = 6;
							return;
						}
						const word_arr = word.split("") as (undefined | string)[]; // mutable array made for each chat;
						let result = [];
						for (let i = 0; i<5; i++) {
							let letter = guess[i];
							let index = word_arr.indexOf(letter);
							if (index === -1) {
								result.push("_");
							} else if (index === i) {
								result.push(letter.toUpperCase());
							} else {
								result.push(letter.toLowerCase());
								word_arr[i] = undefined;
							}
						}
						post.chat(result.join("") + " Attempts Left: ("+attemptsLeft+")");
					} else {
						post.chat("That's not a word, silly");
					}
				} else if (chat.text === "wordle.answer") {
					post.chat(`Answer: '${word}' (This is a cheat command that gives you the answer. You don't lose the game but running it ruins the fun.)`)
				}
			}
			if (chat.text === "wordle.rules") {
				post.chat("You have 6 attempts to guess a 5 letter answer. For each guess, there will be a response: upper case indicates it is the correct position. Lower case indicates the letter is somewhere in the word.");
			}
		}
	}
}