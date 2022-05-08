import { Entity } from "../core/entity";
import { Spell, SpellTypes } from "../core/spells";
import { randomNumber } from "../util";

 export class Fireball extends Spell {
	name = "Fireball";
	description = "A fireball that 10-20 base damage.";
	manaCost = 10;
	type = SpellTypes.Fire
	canUse(target: Entity): string | void {
		let mana = super.canUse(target);
		if (mana) return mana;

		if (target.team === this.user.team) {
			return "Can't attack your own team";
		}
	}
	action(target: Entity) {
		super.action();
		const damage = randomNumber(10,20);
		const actualDamage = this.user.performAttack(damage, target, this);
		return `Did ${actualDamage} to ${target.name}`;
	}
}