import { Entity } from "../core/entity";
import { Spell, SpellTypes } from "../core/spells";
import { Poisoned } from "../statuses/poisoned";
import { randomNumber } from "../util";

export class Poison extends Spell {
	name = "Poison";
	description = "Applys poison to the target.";
	manaCost = 20;
	type = SpellTypes.Curse;
	
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
		
		target.statusEffectManager.add(Poisoned);
		return `Applied Poison to ${target.name}`;
	}
}