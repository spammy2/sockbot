import { Entity } from "../entity";
import { Spell } from "../spells";
import { Charge } from "../spells/charge";
import { Fireball } from "../spells/fireball";
import { Heal } from "../spells/heal";
import { Rest } from "../spells/rest";
import { WaterJet } from "../spells/water-jet";

export class Mage extends Entity {
	description = "A mage who can cast offensive spells.";
	spells: Record<string, Spell> = {
		charge: new Charge(this),
		heal: new Heal(this),
		fireball: new Fireball(this),
		["water-jet"]: new WaterJet(this),
		rest: new Rest(this),
	}
}