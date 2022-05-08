import { Entity } from "../core/entity";
import { Spell, SpellTypes } from "../core/spells";
import { Weakness } from "../statuses/weakness";
import { randomNumber } from "../util";

export class Curse extends Spell {
	name = "Curse";
	description = "Applys weakness to the target.";
	manaCost = 30;
	type = SpellTypes.Curse;
	
	requiresTarget = true;
	action(target: Entity) {
		super.action();
		
		target.statusEffectManager.add(Weakness);
		return `Applied Weakness to ${target.name}`;
	}
}