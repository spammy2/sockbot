import { Spell } from "../spells";
import { StatusEffect } from "../statuseffect";

export class Weakness extends StatusEffect {
	name = "Weakness"
	description = "Do 30% less damage"
	turnsLeft = 2;
	processAttack(amount: number, origin?: StatusEffect | Spell): number {
		return amount * 0.7;
	}
}