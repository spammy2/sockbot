import { Entity } from "../entity";
import { Spell } from "../spells";
import { Charge } from "../spells/charge";
import { Curse } from "../spells/curse";
import { Fireball } from "../spells/fireball";
import { Heal } from "../spells/heal";
import { Poison } from "../spells/poison";
import { Rest } from "../spells/rest";
import { SolarBeam } from "../spells/solar-beam";
import { WaterJet } from "../spells/water-jet";

export class Enchanter extends Entity {
	description = "A enchanter who does status effects.";
	spells: Record<string, Spell> = {
		poison: new Poison(this),
		curse: new Curse(this),
		["solar-beam"]: new SolarBeam(this),
		rest: new Rest(this),
	}
}