import { Spell, SpellTypes } from "../spells";
import { StatusEffect } from "../statuseffect";

export class Undead extends StatusEffect {
	name = "Undead";
	description = "Takes 2x damage against holy attacks.";
	hidden = true;
	processIncomingDamage(amount: number, origin?: StatusEffect | Spell): number {
		if (origin && origin instanceof Spell && origin.type === SpellTypes.Holy) {
			return amount * 2;
		}
		return amount;
	}
}