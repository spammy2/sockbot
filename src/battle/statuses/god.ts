import { Spell } from "../spells";
import { StatusEffect } from "../statuseffect";

export class God extends StatusEffect {
	effectType: "blessing" = "blessing";
	name = "God"
	description = "Basically makes you a god."
	turnsLeft = Infinity;
	tick(){
		this.manager.entity.mana = 100;
	}
	processIncomingDamage(amount: number, origin?: StatusEffect | Spell): number {
		return 0;
	}
	processAttack(amount: number, origin?: StatusEffect | Spell | undefined): number {
		return 999;
	}
}
