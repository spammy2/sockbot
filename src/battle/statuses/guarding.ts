import { Spell } from "../spells";
import { StatusEffect } from "../statuseffect";

export class Guarding extends StatusEffect {
	effectType: "blessing" = "blessing";
	name = "Guarding"
	description = "Decreases damage by 20%."
	turnsLeft = 3;
	processIncomingDamage(amount: number, origin?: StatusEffect | Spell): number {
		return amount * 0.8;
	}
}
