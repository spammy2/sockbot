import { Team } from "..";
import { Spell } from "../spells";
import { Charge } from "../spells/charge";
import { Rest } from "../spells/rest";
import { Slash } from "../spells/slash";
import { Undead } from "../statuses/undead";
import { Enemy } from "./enemy";

export class Zombie extends Enemy {
	name = "Zombie";
	description = "A generic monster that looks pathetically weak.";
	maxHealth = 100;
	health = 100;
	spells: Record<string, Spell> = {
		charge: new Charge(this),
	};
	constructor(team: Team) {
		super(team);
		this.statusEffectManager.add(Undead);
	}
}

export class EliteZombie extends Zombie {
	name = "Elite Zombie";
	description = "A more powerful zombie.";
	maxHealth = 150;
	health = 150;
	
	spells: Record<string, Spell> = {
		slash: new Slash(this),
		rest: new Rest(this),
	};
}