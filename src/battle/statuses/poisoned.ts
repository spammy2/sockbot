import { StatusEffect } from "../statuseffect";

export class Poisoned extends StatusEffect {
	name = "Poisoned"
	description = "Takes 8 damage for 4 turns."
	turnsLeft = 4;
	tick(){
		super.tick();
		this.manager.entity.takeDamage(8, this);
	}
}