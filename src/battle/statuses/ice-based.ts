import { Spell, SpellTypes } from "../spells";
import { StatusEffect } from "../statuseffect";

export class IceBased extends StatusEffect {
	name = "Ice Based";
	description = "Takes 2x damage against fire attacks and 0.5x damage against ice attacks.";
	hidden = true;
	processIncomingDamage(amount: number, origin?: StatusEffect | Spell): number {
		if (origin && origin instanceof Spell && origin.type === SpellTypes.Fire) {
			return amount * 2;
		}
		return amount;
	}
}