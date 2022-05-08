import { Spell } from "../spells";
import { Curse } from "../spells/curse";
import { Heal } from "../spells/heal";
import { Poison } from "../spells/poison";
import { Enemy } from "./enemy";

export class Demon extends Enemy {
	name = "Demon";
	description = "A demon";
	maxHealth = 200;
	health = 200;

	// move(){

	// }

	spells: Record<string, Spell> = {
		curse: new Curse(this),
		poison: new Poison(this),
		heal: new Heal(this),
	}
}