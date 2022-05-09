import { StatusEffect } from "../core/statuseffect";

export class Bleeding extends StatusEffect {
	name = "Bleeding"
	description = "Lose 5 damage and 5 mana for 3 turns."
	turnsLeft = 3;
	tick(){
		super.tick();
		this.manager.entity.takeDamage(5, this);
		this.manager.entity.consumeMana(5, this);
	}
}