import { Spell, SpellTypes } from "../core/spells";
import { StatusEffect } from "../core/statuseffect";
import { Origin } from "../core/types";

export class FireBased extends StatusEffect {
	name = "Fire Based";
	description = "Takes 2x damage against water attacks and 0.5x damage against fire attacks.";
	hidden = true;
	processIncomingDamage(amount: number, origin: Origin): number {
		if (origin && origin instanceof Spell) {
			if (origin.type === SpellTypes.Water) {
				return amount * 2;
			} else if (origin.type === SpellTypes.Fire) {
				return amount / 2;
			}
		}
		return amount;
	}
}