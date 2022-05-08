import { Spell } from "../core/spells";
import { StatusEffect } from "../core/statuseffect";
import { Origin } from "../core/types";

export class Strength extends StatusEffect {
	effectType: "blessing" = "blessing";
	name = "Strength"
	description = "Increases damage by 30%."
	turnsLeft = 2;
	processAttack(amount: number, origin: Origin): number {
		return amount * 1.3;
	}
}
