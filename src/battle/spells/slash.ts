import { Entity } from "../core/entity";
import { Spell, SpellTypes } from "../core/spells";
import { randomNumber } from "../util";

export class Slash extends Spell {
	name = "Slash";
	description = "Does 10-15 damage to all players";
	manaCost = 0;
	type = SpellTypes.Normal;
	canUse(): string | void {
		const response = super.canUse();
		if (response) {
			return response;
		}
	}
	action() {
		super.action();
	
		let accumulatedDamage = 0;
		for (const enemy of this.user.team.battle.teams.find(t => t !== this.user.team)!.entities) {
			accumulatedDamage += enemy.takeDamage(randomNumber(10, 15), this);
		}
		return `Attacked everyone for ${accumulatedDamage} damage`;
	}
}