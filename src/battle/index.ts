import { Chat, Client, Post, User } from "photop-client";
import { Battle } from "./core/battle";
import { Enemy } from "./enemies/enemy";
import { Entity } from "./core/entity";
import { Enchanter } from "./playertypes/enchanter";
import { Fighter } from "./playertypes/fighter";
import { Healer } from "./playertypes/healer";
import { Mage } from "./playertypes/mage";
import { Player } from "./playertypes/player";
import { Team } from "./core/team";

class EnemyTeam extends Team {
	turnStarted() {
		while (true) {
			const isLast = this.nextEntity();
			const current = this.currentEntity as Enemy;
			const result = current.move();
			this.battle.announce(result.message);
			current.tick();
			if (isLast) {
				break;
			}
		}
	}
	constructor(public battle: Battle) {
		super(battle);
	}
}

class NPCBattle extends Battle {
	playerTeam = new Team(this);
	enemyTeam = new EnemyTeam(this);

	announce(message: string) {
		this.post.chat(message);
	}

	isPlayerTurn(player: Player) {
		if (this.currentTeam?.currentEntity === player) {
			return true;
		}
		return false;
	}
	constructor(public post: Post) {
		super();
	}
}

const classes = [Enchanter, Fighter, Healer, Mage];

export async function BattleGame(post: Post, client: Client) {
	const a = post.text.match(/\+BattleGame/);
	if (a) {
		let invited = await Promise.all(
			Array.from(post.text.matchAll(/@[a-zA-Z0-9_]+\<([a-z0-9]+)\>/g)).map((e) => client.getUser(e[1]))
		);
		const users = Array.from(new Set([post.author, ...invited.filter((u) => u != null)])) as User[];

		const battle: Battle = new NPCBattle(post);
		const playerMap = new Map<User, Entity>();


		post.chat(
			"Playing BattleGame with " +
				users.map((u) => u.username).join(", ") +
				". All members must do battle!chooseclass then the owner will do battle!start"
		);

		const chosenClasses: Map<User, typeof Entity> = new Map();

		function getTarget(v: string) {
			let target: Entity | undefined;
			if (battle instanceof NPCBattle) {
				const num = parseInt(v);
				if (!isNaN(num)) {
					target = battle.enemyTeam.entities[num];
				}
			}
			const u = users.find((u) => u.username === v);
			if (u) {
				target = playerMap.get(u)!;
			}
			return target;
		}

		const context = {chosenClasses, started: false}

		return (chat: Chat) => {
			let text: RegExpMatchArray | null;
			if ((text = chat.text.match(/^battle!(.+)/))) {
				let val = text[1];
				const args = val.split(" ");
				const command = args.shift();
				const p = playerMap.get(chat.author);

				if (p) {
					if (context.started) {
						if (command === "party") {
							chat.reply(`Party Members: ${users.map((u) => u.username).join(", ")}`);
						} else if (command === "stats") {
							const target = args[0] !== undefined ? getTarget(args[0]) : playerMap.get(chat.author);
							if (target) {
								chat.reply(
									`${target.name} has ${target.health} health and ${
										target.mana
									} mana. ${target.statusEffectManager
										.getVisibleStatuses()
										.map((e) => e.name)
										.join(", ")}`
								);
							} else {
								chat.reply("Invalid target");
							}
							// skip a user if they are not cooperating and making a move
						} else if (command === "skipcurrent") {
							if (chat.author === post.author) {
								if (battle.currentTeam instanceof EnemyTeam) {
									chat.reply("It is the enemy's turn right now");
								} else {
									const current = battle.currentTeam.currentEntity;
									chat.reply(`Forced ${current.name} to skip their turn.`);
									battle.currentTeam.nextEntity();
								}
							} else {
								chat.reply("You can't skip someone else's turn unless you are the owner");
							}
						} else if (command === "info") {
							const target = getTarget(args[0]);
							if (target) {
								chat.reply(`${target.name}: ${target.description}`);
							} else {
								chat.reply("Invalid target");
							}
						} else if (command === "spellinfo") {
							const spell = p.spells[args[0]];
							if (spell) {
								chat.reply(`${spell.name}: ${spell.description}`);
							} else {
								chat.reply("Invalid spell");
							}
						} else if (command === "turn") {
							if (battle.currentTeam instanceof EnemyTeam) {
								chat.reply("It is the enemy's turn");
							} else {
								chat.reply(`It is ${battle.currentTeam.currentEntity.name}'s turn`);
							}
						} else if (command === "use") {
							const spellName = args[0];

							if (spellName) {
								if (battle.currentTeam.currentEntity === p) {
									const spell = p.spells[spellName];
									let target: Entity | undefined;
									if (args[1]) {
										target = getTarget(args[1]);
										if (!target) {
											return chat.reply("Invalid target");
										}
									}
									if (spell) {
										const response = spell.canUse(target);
										if (response) {
											chat.reply(response);
										} else {
											const response = spell.action(target);
											if (response) {
												chat.reply(response);
											}
											battle.currentTeam.nextEntity();
										}
									} else {
										chat.reply("You don't have that move.");
									}
								} else {
									chat.reply("It is not your turn.");
								}
							} else {
								chat.reply(`Moves: ${Object.keys(p.spells).join(", ")}`);
							}
						} else if (command === "enemies") {
							if (p.team.enemyTeam instanceof EnemyTeam) {
								chat.reply(
									`Enemies: ${p.team.enemyTeam.entities.map((e, i) => `${i}: ${e.name}`).join(", ")}`
								);
							} else {
								chat.reply(`Enemies: ${p.team.enemyTeam.entities.map((e) => e.name).join(", ")}`);
							}
						} else if (command === "debug.takedamage") {
							p.takeDamage(Number(args[0]));
							chat.reply(`You now have ${p.health} health.`);
						} else if (command === "help") {
							chat.reply("Available commands: stats, help, use");
						}
					} else {
						if (command === "start") {
							if (post.author === chat.author) {
								for (const user of users) {
									const chosenClass = chosenClasses.get(user);
									if (!chosenClass) {
										return chat.reply(`${user.username} has not chosen a class yet.`);
									}
									const c = new chosenClass(battle.teams[0]);
									c.name = user.username;
									playerMap.set(user, c);
									battle.teams[0].entities.push(c);
								}

								context.started = true;
								chat.reply("Game has started!");
							} else {
								chat.reply("You can't start the game unless you are the owner");
							}
						} else if (command === "chooseclass") {
							const className = args[0];
							let classChosen = true;
							if (className) {
								if (className === "fighter") {
									chosenClasses.set(chat.author, Fighter);
								} else if (className === "mage") {
									chosenClasses.set(chat.author, Mage);
								} else if (className === "enchanter") {
									chosenClasses.set(chat.author, Enchanter);
								} else if (className === "healer") {
									chosenClasses.set(chat.author, Healer);
								} else {
									classChosen = false;
									chat.reply("Invalid class");
								}
								if (classChosen) {
									chat.reply(`You are now a ${className}`);
								}
							} else {
								chat.reply("Available classes: " + classes.map((e) => e.name.toLowerCase()).join(", "));
							}
						}
					}
				} else {
					chat.reply("You are not invited");
				}
			}
		};
	}
}
