import { Spell } from "../spells";
import { Smash } from "../spells/smash";
import { Enemy } from "./enemy";

export class Golem extends Enemy {
	name = "Golem";
	description = "A massive stone golem.";
	maxHealth = 250;
	health = 250;
	spells: Record<string, Spell> = {
		smash: new Smash(this),
	}
}