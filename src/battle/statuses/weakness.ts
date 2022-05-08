import { Spell } from "../core/spells";
import { StatusEffect } from "../core/statuseffect";
import { Origin } from "../core/types";

export class Weakness extends StatusEffect {
	name = "Weakness"
	description = "Do 30% less damage"
	turnsLeft = 2;
	processAttack(amount: number, origin: Origin): number {
		return amount * 0.7;
	}
}