import { Team } from "..";
import { Enemy } from "./enemy";
import { Spell } from "../spells";
import { Charge } from "../spells/charge";
import { FireBased } from "../statuses/fire-based";
import { IceBased } from "../statuses/ice-based";

abstract class Slime extends Enemy {
	maxHealth = 75;
	health = 75;
	spells: Record<string, Spell> = {
		charge: new Charge(this),
	}
}

export class IceSlime extends Slime {
	name = "Ice Slime";
	description = "A slime made out of ice.";
	constructor(team: Team) {
		super(team);
		this.statusEffectManager.add(IceBased);
	}
}

export class FireSlime extends Slime {
	name = "Fire Slime";
	description = "A slime made out of fire.";
	constructor(team: Team) {
		super(team);
		this.statusEffectManager.add(FireBased);
	}
}