import { Entity } from "../entity";
import { Spell, SpellTypes } from "../spells";
import { randomNumber } from "../util";

 export class WaterJet extends Spell {
	name = "Water Jet";
	description = "A water jet that 10-20 base damage.";
	manaCost = 10;
	type = SpellTypes.Water
	canUse(target: Entity): string | void {
		let mana = super.canUse(target);
		if (mana) return mana;

		if (target.team === this.user.team) {
			return "Can't attack your own team";
		}
	}
	requiresTarget = true;
	action(target: Entity) {
		super.action();
		const damage = randomNumber(10,20);
		const actualDamage = this.user.performAttack(damage, target, this);
		return `Did ${actualDamage} to ${target.name}`;
	}
}