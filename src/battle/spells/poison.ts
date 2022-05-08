import { Entity } from "../entity";
import { Spell, SpellTypes } from "../spells";
import { Poisoned } from "../statuses/poisoned";
import { randomNumber } from "../util";

export class Poison extends Spell {
	name = "Poison";
	description = "Applys poison to the target.";
	manaCost = 20;
	type = SpellTypes.Curse;
	
	requiresTarget = true;
	action(target: Entity) {
		super.action();
		
		target.statusEffectManager.add(Poisoned);
		return `Applied Poison to ${target.name}`;
	}
}