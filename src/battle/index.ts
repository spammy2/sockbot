import { Chat, Client, Post, User } from "photop-client";
import { Demon } from "./enemies/demon";
import { Enemy } from "./enemies/enemy";
import { Golem } from "./enemies/golem";
import { IceSlime, FireSlime } from "./enemies/slimes";
import { Zombie, EliteZombie } from "./enemies/zombie";
import { Entity } from "./entity";
import { Enchanter } from "./playertypes/enchanter";
import { Fighter } from "./playertypes/fighter";
import { Healer } from "./playertypes/healer";
import { Mage } from "./playertypes/mage";
import { Spell } from "./spells";

export class Team {
	entities: Entity[] = [];
	currentEntity: Entity = this.entities[0];

	remove(entity: Entity) {
		if (this.currentEntity === entity) {
			this.nextEntity();
		}
		this.entities = this.entities.filter((e) => e !== entity);
	}

	getRandom(){
		return this.entities[Math.floor(Math.random() * this.entities.length)];
	}

	// returns true if all members have gone
	nextEntity() {
		let index = this.entities.indexOf(this.currentEntity) + 1;

		if (index >= this.entities.length) {
			this.currentEntity = this.entities[0];
			return true;
		} else {
			this.currentEntity = this.entities[index];
		}
	}
	constructor(public battle: Battle) {}
}

export class Battle {
	playerTeam = new Team(this);
	enemyTeam = new Team(this);
	constructor() {}
}

const classes = [Enchanter, Fighter, Healer, Mage]

export async function BattleGame(post: Post, client: Client) {
	const a = post.text.match(/\+BattleGame/);
	if (a) {
		let invited = await Promise.all(
			Array.from(post.text.matchAll(/@[a-zA-Z0-9_]+\<([a-z0-9]+)\>/g)).map((e) => client.getUser(e[1]))
		);
		const users = Array.from(new Set([post.author, ...invited.filter((u) => u != null)])) as User[];

		const battle = new Battle();
		const playerMap = new Map<User, Entity>();

		let isPlayerTurn = true;
		let gameStarted = false;

		function addEnemy(t: new (t: Team) => Entity) {
			const enemy = new t(battle.enemyTeam);
			enemy.onDeath = (origin) => {
				if (origin instanceof Spell) {
					post.chat(`${enemy.name} has died. Killed by ${origin.user.name}`);
				} else {
					post.chat(`${enemy.name} has died.`);
				}
			};
			battle.enemyTeam.entities.push(enemy);
		}

		function doTurn() {
			if (battle.playerTeam.nextEntity()) {
				isPlayerTurn = false;
				doEnemyTeam();
			}
		}

		post.chat("Playing BattleGame with " + users.map((u) => u.username).join(", ") + ". All members must do battle!chooseclass then the owner will do battle!start");

		const chosenClasses: Map<User, typeof Entity> = new Map();

		async function doEnemyTeam() {
			while (true) {
				const current = battle.enemyTeam.currentEntity as Enemy;
				const result = current.move();
				post.chat(result.message);
				current.tick();
				if (battle.enemyTeam.nextEntity()) {
					break;
				}
			}
			isPlayerTurn = true;
		}

		function getTarget(v: string) {
			let target: Entity | undefined;
			if (!isNaN(parseInt(v))) {
				target = battle.enemyTeam.entities[parseInt(v)];
			} else {
				const u = users.find((u) => u.username === v);
				if (u) {
					target = playerMap.get(u)!;
				}
			}
			return target;
		}

		return (chat: Chat) => {
			let text: RegExpMatchArray | null;
			if ((text = chat.text.match(/^battle!(.+)/))) {
				let val = text[1];
				const args = val.split(" ");
				const command = args.shift();
				if (users.includes(chat.author)) {
					if (gameStarted) {
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
								if (isPlayerTurn) {
									const current = battle.playerTeam.currentEntity;
									chat.reply(`Forced ${current.name} to skip their turn.`);
									doTurn();
								} else {
									chat.reply("It's the enemy's turn right now");
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
							const p = playerMap.get(chat.author)!;
							const spell = p.spells[args[0]];
							if (spell) {
								chat.reply(`${spell.name}: ${spell.description}`);
							} else {
								chat.reply("Invalid spell");
							}
						} else if (command === "turn") {
							if (isPlayerTurn) {
								chat.reply(`It is ${battle.playerTeam.currentEntity.name}'s turn`);
							} else {
								chat.reply("It is the enemy's turn");
							}
						} else if (command === "use") {
							const p = playerMap.get(chat.author)!;
							const spellName = args[0];

							if (spellName) {
								if (isPlayerTurn && battle.playerTeam.currentEntity === p) {
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
											doTurn();
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
							chat.reply(
								`Enemies: ${battle.enemyTeam.entities.map((e, i) => `${i}: ${e.name}`).join(", ")}`
							);
						} else if (command === "debug.takedamage") {
							const p = playerMap.get(chat.author)!;
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
									if (!chosenClass) {return chat.reply(`${user.username} has not chosen a class yet.`);}
									const c = new chosenClass(battle.playerTeam);
									c.name = user.username;
									playerMap.set(user, c);
									battle.playerTeam.entities.push(c);
								}
								const generatable = [Zombie, IceSlime, EliteZombie, FireSlime, Golem, Demon];
								for (let i = 0; i < 5; i++) {
									addEnemy(generatable[Math.floor(Math.random() * generatable.length)]);
								}
								addEnemy(EliteZombie);
								addEnemy(Golem);
								addEnemy(Demon);
						
								battle.enemyTeam.currentEntity = battle.enemyTeam.entities[0];
								battle.playerTeam.currentEntity = battle.playerTeam.entities[0];
								gameStarted = true;
								chat.reply("Game has started!");
							} else {
								chat.reply("You can't start the game unless you are the owner");
							}
						} else if (command === "chooseclass") {
							const p = playerMap.get(chat.author)!;
							const className = args[0];
							let classChosen = true;
							if (className) {
								if (className==="fighter") {
									chosenClasses.set(chat.author, Fighter);
								} else if (className==="mage") {
									chosenClasses.set(chat.author, Mage);
								} else if (className==="enchanter") {
									chosenClasses.set(chat.author, Enchanter);
								} else if (className==="healer") {
									chosenClasses.set(chat.author, Healer);
								} else {
									classChosen = false;
									chat.reply("Invalid class");
								}
								if (classChosen) {
									chat.reply(`You are now a ${className}`);
								}

							} else {
								chat.reply("Available classes: " + (classes).map(e=>e.name.toLowerCase()).join(", "));
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
