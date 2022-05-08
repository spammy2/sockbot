import { Spell, SpellTypes } from "../core/spells";
import { StatusEffect } from "../core/statuseffect";
import { Origin } from "../core/types";

export class IceBased extends StatusEffect {
	name = "Ice Based";
	description = "Takes 2x damage against fire attacks and 0.5x damage against ice attacks.";
	hidden = true;
	processIncomingDamage(amount: number, origin: Origin): number {
		if (origin && origin instanceof Spell && origin.type === SpellTypes.Fire) {
			return amount * 2;
		}
		return amount;
	}
}