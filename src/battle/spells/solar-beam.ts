import { Entity } from "../core/entity";
import { Spell, SpellTypes } from "../core/spells";
import { randomNumber } from "../util";

 export class SolarBeam extends Spell {
	name = "Solar Beam";
	description = "Brings down a beam of light on a target.";
	manaCost = 50;
	type = SpellTypes.Holy
	requiresTarget = true;
	canUse(target: Entity): string | void {
		let mana = super.canUse(target);
		if (mana) return mana;

		if (target.team === this.user.team) {
			return "Can't attack your own team";
		}
	}
	action(target: Entity) {
		super.action();
		const damage = randomNumber(20, 40);
		const actualDamage = this.user.performAttack(damage, target, this);
		return `Did ${actualDamage} to ${target.name}`;
	}
}