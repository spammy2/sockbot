import { Entity } from "../core/entity";
import { Spell, SpellTypes } from "../core/spells";
import { randomNumber } from "../util";

export class Smash extends Spell {
	name = "Smash";
	description = "Does 20-30 damage";
	manaCost = 0;
	type = SpellTypes.Normal;
	canUse(target: Entity): string | void {
		const response = super.canUse(target);
		if (response) return response;
		
		if (target.team === this.user.team) {
			return "Can't attack your own team";
		}
	}
	requiresTarget = true;
	action(target: Entity) {
		super.action();
		const damage = randomNumber(20,30);
		const actualDamage = this.user.performAttack(damage, target, this);
		return `Did ${actualDamage} to ${target.name}`;
	}
}