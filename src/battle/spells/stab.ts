import { Entity } from "../core/entity";
import { Spell, SpellTypes } from "../core/spells";
import { Bleeding } from "../statuses/bleeding";
import { randomNumber } from "../util";

 export class Stab extends Spell {
	name = "Stab";
	description = "Does 20-30 to a target and applies bleeding.";
	manaCost = 0;
	type = SpellTypes.Normal
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
		const damage = randomNumber(20,30);
		const actualDamage = this.user.performAttack(damage, target, this);
		this.user.statusEffectManager.add(Bleeding);
		return `Did ${actualDamage} to ${target.name} and applied bleeding.`;
	}
}