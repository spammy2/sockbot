import { Spell } from "../core/spells";
import { StatusEffect } from "../core/statuseffect";
import { Origin } from "../core/types";

export class Guarding extends StatusEffect {
	effectType: "blessing" = "blessing";
	name = "Guarding"
	description = "Decreases damage by 20%."
	turnsLeft = 3;
	processIncomingDamage(amount: number, origin: Origin): number {
		return amount * 0.8;
	}
}
