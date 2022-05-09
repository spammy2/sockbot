import { Battle } from "../core/battle";
import { Entity } from "../core/entity";
import { Team } from "../core/team";


export class EnemyTeam extends Team {
	get enemyTeam() {
		return this.battle.teams.find((t) => t !== this) as Team;
	}
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
		this.battle.nextTeam();
	}
	constructor(public battle: Battle) {
		super(battle);
	}
}

export abstract class Enemy extends Entity {
	name = "Unnamed Enemy";
	declare team: EnemyTeam;
	move(): { type: "success" | "failure"; message: string } {
		const spell = this.getRandomSpell();
		if (spell) {
			let target: Entity;
			if (spell.targetType === "enemy") {
				target = this.team.enemyTeam.getRandom();
			} else {
				target = this.team.getRandom();
			}

			const msg = spell.canUse(target);
			if (msg) {
				return { type: "failure", message: `${this.name} is unable to use ${spell.name}, ${msg}` };
			} else {
				const response = spell.action(target);
				return { type: "success", message: `${this.name} used ${spell.name}. ${response}` };
			}
		} else {
			return { type: "failure", message: "No spells available" };
		}
	}
}
