import { Spell } from "../core/spells";
import { Curse } from "../spells/curse";
import { Poison } from "../spells/poison";
import { Rest } from "../spells/rest";
import { SolarBeam } from "../spells/solar-beam";
import { Player } from "./player";

export class Enchanter extends Player {
	description = "A enchanter who does status effects.";
	spells: Record<string, Spell> = {
		poison: new Poison(this),
		curse: new Curse(this),
		["solar-beam"]: new SolarBeam(this),
		rest: new Rest(this),
	}
}