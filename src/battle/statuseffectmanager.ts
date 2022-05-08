import { Entity } from "./entity";
import { Spell } from "./spells";
import { StatusEffect } from "./statuseffect";

export class StatusEffectManager {
	statusEffects: StatusEffect[] = [];

	add(statusConstructor: (new (manager: StatusEffectManager)=>StatusEffect)){
		const a = new statusConstructor(this);
		if (a.canAdd) {
			this.statusEffects.push(a);
			return true;
		}
	}

	getVisibleStatuses(){
		return this.statusEffects.filter(e => !e.hidden);
	}

	processIncomingDamage(amount: number, origin?: StatusEffect | Spell): number {
		return this.statusEffects.reduce((current,v)=>{
			return v.processIncomingDamage(current, origin)
		},amount)
	}

	processAttack(amount: number, origin?: StatusEffect | Spell): number {
		return this.statusEffects.reduce((current,v)=>{
			return v.processAttack(current, origin);
		},amount)
	}

	remove(effect: StatusEffect){
		this.statusEffects = this.statusEffects.filter(e => e !== effect);
	}

	tick(){
		this.statusEffects.forEach(effect => {
			effect.tick();
		});
	}

	constructor(public entity: Entity){

	}
}