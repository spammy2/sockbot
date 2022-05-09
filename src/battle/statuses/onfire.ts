import { Spell, SpellTypes } from "../core/spells";
import { StatusEffect } from "../core/statuseffect";
import { Origin } from "../core/types";

export class OnFire extends StatusEffect {
	name = "On Fire";
	turnsLeft = 3;
	description = "Take 10 damage every turn.";
	hidden = true;
	tick(){
		this.manager.entity.takeDamage(10);
	}
}