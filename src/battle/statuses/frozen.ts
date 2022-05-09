import { Spell, SpellTypes } from "../core/spells";
import { StatusEffect } from "../core/statuseffect";
import { Origin } from "../core/types";

export class Frozen extends StatusEffect {
	name = "Frozen";
	description = "Unable to move until an enemy attacks you.";
	turnsLeft = 1;
	blocksMoves = true;

	onDamageTaken(amount: number, origin: Origin) {
		this.remove();
	}
	
}