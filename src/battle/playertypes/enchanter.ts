import { Spell } from "../core/spells";
import { Curse } from "../spells/curse";
import { ManaBomb } from "../spells/mana-bomb";
import { Poison } from "../spells/poison";
import { Rest } from "../spells/rest";
import { SolarBeam } from "../spells/solar-beam";
import { Player } from "./player";

export class Enchanter extends Player {
	description = "A enchanter who does status effects.";
	spells: Record<string, Spell> = {
		["mana-bomb"]: new ManaBomb(this),
		poison: new Poison(this),
		curse: new Curse(this),
		rest: new Rest(this),
	}
}