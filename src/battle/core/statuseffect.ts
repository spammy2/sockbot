import { Spell } from "./spells";
import { StatusEffectManager } from "./statuseffectmanager";
import { Origin } from "./types";

export abstract class StatusEffect {
	name = "Unnamed Status Effect"
	effectType: "curse" | "blessing" = "curse";
	turnsLeft = Infinity;

	hidden = false;

	canAdd = true;
	
	/** Whether the presence of this move prevents the user from moving */
	blocksMoves = false;

	/** Processes damage received */
	processIncomingDamage(amount: number, origin: Origin): number {return amount};

	/** Processes outbound attacks */
	processAttack(amount: number, origin: Origin): number {return amount};

	/** When the damage is finally received. Called after processIncomingDamage */
	onDamageTaken(amount: number, origin: Origin): void {};

	remove(){
		this.manager.remove(this);
		this.onRemoved();
	}

	/** Called when this status effect is added */
	onAdded() {

	};

	/** Called when this status effect is removed */
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