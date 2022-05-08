import { Spell, SpellTypes } from "../core/spells";
import { StatusEffect } from "../core/statuseffect";
import { Origin } from "../core/types";

export class Undead extends StatusEffect {
	name = "Undead";
	description = "Takes 2x damage against holy attacks.";
	hidden = true;
	processIncomingDamage(amount: number, origin: Origin): number {
		if (origin && origin instanceof Spell && origin.type === SpellTypes.Holy) {
			return amount * 2;
		}
		return amount;
	}
}