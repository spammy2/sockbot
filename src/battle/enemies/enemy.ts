import { Entity } from "../entity";

export abstract class Enemy extends Entity {
	name = "Unnamed Enemy";

	move(): { type: "success" | "failure"; message: string } {
		const spell = this.getRandomSpell();
		if (spell) {
			let target: Entity;
			if (spell.targetType === "enemy") {
				target = this.team.battle.playerTeam.getRandom();
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
