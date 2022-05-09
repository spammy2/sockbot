import { Entity } from "../core/entity";
import { Spell } from "../core/spells";
import { Charge } from "../spells/charge";
import { Fireball } from "../spells/fireball";
import { Heal } from "../spells/heal";
import { Rest } from "../spells/rest";
import { SolarBeam } from "../spells/solar-beam";
import { WaterJet } from "../spells/water-jet";
import { Player } from "./player";

export class Mage extends Player {
	description = "A mage who can cast offensive spells.";
	spells: Record<string, Spell> = {
		charge: new Charge(this),
		["solar-beam"]: new SolarBeam(this),
		fireball: new Fireball(this),
		["water-jet"]: new WaterJet(this),
		rest: new Rest(this),
	}
}