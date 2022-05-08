import { Entity } from "../entity";
import { Spell, SpellTypes } from "../spells";
import { randomNumber } from "../util";

export class Slash extends Spell {
	name = "Slash";
	description = "Does 20-30 damage";
	manaCost = 0;
	type = SpellTypes.Normal;
	canUse(target: Entity): string | void {
		super.canUse();
		if (target.team === this.user.team) {
			return "Can't attack your own team";
		}
	}
	requiresTarget = true;
	action(target: Entity) {
		super.action();
		const damage = randomNumber(5,10);
		const actualDamage = this.user.performAttack(damage, target, this);
		return `Did ${actualDamage} to ${target.name}`;
	}
}