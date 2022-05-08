import { Spell } from "./spells";
import { StatusEffectManager } from "./statuseffectmanager";

export abstract class StatusEffect {
	name = "Unnamed Status Effect"
	effectType: "curse" | "blessing" = "curse";
	turnsLeft = Infinity;

	hidden = false;

	canAdd = true;

	/** Processes damage received */
	processIncomingDamage(amount: number, origin?: StatusEffect | Spell): number {return amount};

	/** Processes outbound attacks */
	processAttack(amount: number, origin?: StatusEffect | Spell): number {return amount};

	remove(){
		this.manager.remove(this);
		this.onRemoved();
	}

	onAdded() {

	};

	onRemoved(){

	}

	tick() {
		this.turnsLeft--;
		if (this.turnsLeft <= 0) {
			this.remove();
		}
	}

	constructor(public manager: StatusEffectManager){
		// detect (by default) that this effect doesnt exist
		let f: StatusEffect | undefined;
		if (f=manager.statusEffects.find(e=>e instanceof this["constructor"])) {
			// we can reset the turnsLeft if the effect is already on the entity
			f.turnsLeft = this.turnsLeft;
			this.canAdd = false;
		}
	}
}