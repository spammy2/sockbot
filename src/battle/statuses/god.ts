import { Spell } from "../core/spells";
import { StatusEffect } from "../core/statuseffect";
import { Origin } from "../core/types";

export class God extends StatusEffect {
	effectType: "blessing" = "blessing";
	name = "God"
	description = "Basically makes you a god."
	turnsLeft = Infinity;
	tick(){
		this.manager.entity.mana = 100;
	}
	processIncomingDamage(amount: number, origin: Origin): number {
		return 0;
	}
	processAttack(amount: number, origin: Origin | undefined): number {
		return 999;
	}
}
