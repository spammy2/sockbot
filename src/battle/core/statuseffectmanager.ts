import { Entity } from "./entity";
import { Spell } from "./spells";
import { StatusEffect } from "./statuseffect";
import { Origin } from "./types";

export class StatusEffectManager {
	statusEffects: StatusEffect[] = [];

	add(statusConstructor: (new (manager: StatusEffectManager)=>StatusEffect)){
		const a = new statusConstructor(this);
		if (a.canAdd) {
			this.statusEffects.push(a);
			a.onAdded();
			return true;
		}
	}

	getVisibleStatuses(){
		return this.statusEffects.filter(e => !e.hidden);
	}

	processIncomingDamage(amount: number, origin: Origin): number {
		return this.statusEffects.reduce((current,v)=>{
			return v.processIncomingDamage(current, origin)
		},amount)
	}

	processAttack(amount: number, origin: Origin): number {
		return this.statusEffects.reduce((current,v)=>{
			return v.processAttack(current, origin);
		},amount)
	}

	remove(effect: StatusEffect){
		this.statusEffects = this.statusEffects.filter(e => {
			if (e === effect) {
				effect.onRemoved();
				return false;
			}
			return true;
		});
	}

	tick(){
		this.statusEffects.forEach(effect => {
			effect.tick();
		});
	}

	constructor(public entity: Entity){

	}
}