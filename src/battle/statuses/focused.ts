import { Spell } from "../core/spells";
import { StatusEffect } from "../core/statuseffect";
import { Origin } from "../core/types";

export class Focused extends StatusEffect {
	effectType: "blessing" = "blessing";
	name = "Focused"
	description = "Increases damage by 30% for 3 turns."
	turnsLeft = 3;
	processAttack(amount: number, origin: Origin): number {
		return amount * 1.3;
	}
}
