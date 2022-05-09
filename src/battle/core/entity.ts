import { Spell } from "./spells";
import { StatusEffect } from "./statuseffect";
import { StatusEffectManager } from "./statuseffectmanager";
import { Team } from "./team";
import { Origin } from "./types";

export class Entity {
	name = "Unnamed Entity";
	description = "There is no description!";
	maxHealth = 100;
	health = 100;
	mana = 100;
	maxMana = 100;
	statusEffectManager = new StatusEffectManager(this);
	spells: Record<string, Spell> = {}
	isDead = false;
	
	onDeath(origin: Origin){
		this.team.battle.onDeath(this, origin);
	}
	
	canMakeMove(){
		for (const effect of this.statusEffectManager.statusEffects) {
			if (effect.blocksMoves) {
				return false;
			}
		}
		return true;
	}

	takeDamage(amount: number, origin?: Origin) {
		const actualAmount = Math.round(this.statusEffectManager.processIncomingDamage(amount, origin));
		
		this.health -= actualAmount;
		this.statusEffectManager.onDamageTaken(actualAmount, origin);
		if (this.health <= 0) {
			this.isDead = true;
			this.onDeath(origin);
			this.team.remove(this);
		}
		return actualAmount;
	}

	consumeMana(amount: number, origin?: Origin){
		const prevMana = this.mana;
		this.mana=Math.max(this.mana-amount, 0);
		return prevMana - this.mana;
	}

	getRandomSpell(){
		const keys = Object.keys(this.spells);
		if (keys.length === 0) {
			return undefined;
		}
		return this.spells[keys[Math.floor(Math.random() * keys.length)]];
	}
	
	recoverMana(amount: number, origin: Origin) {
		const prevMana = this.mana;
		this.mana = Math.min(this.mana + amount, this.maxMana);
		return this.mana - prevMana;
	}
	recoverHealth(amount: number, origin: Origin) {
		const prevHealth = this.health;
		this.health = Math.min(this.health + amount, this.maxHealth);
		return this.health - prevHealth;
	}
	performAttack(amount: number, target: Entity, origin: Origin): number {
		const actualAmount = Math.round(target.takeDamage(this.statusEffectManager.processAttack(amount, origin), origin));
		return actualAmount;
	}
	tick(){
		this.statusEffectManager.tick();
	}
	constructor(public team: Team){
		
	}
}