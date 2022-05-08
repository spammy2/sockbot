import { Spell } from "../spells";
import { StatusEffect } from "../statuseffect";

export class Strength extends StatusEffect {
	effectType: "blessing" = "blessing";
	name = "Strength"
	description = "Increases damage by 30%."
	turnsLeft = 2;
	processAttack(amount: number, origin?: StatusEffect | Spell): number {
		return amount * 1.3;
	}
}
