import { Spell } from "../core/spells";
import { Guard } from "../spells/guard";
import { Rest } from "../spells/rest";
import { Slash } from "../spells/slash";
import { Stab } from "../spells/stab";
import { Player } from "./player";

export class Fighter extends Player {
	description = "A fighter who can attack.";
	health = 150;
	maxHealth = 150;
	spells: Record<string, Spell> = {
		slash: new Slash(this),
		stab: new Stab(this),
		guard: new Guard(this),
		rest: new Rest(this),
	}
}
