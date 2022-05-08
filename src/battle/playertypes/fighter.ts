import { Entity } from "../core/entity";
import { Spell } from "../core/spells";
import { Charge } from "../spells/charge";
import { Guard } from "../spells/guard";
import { Rest } from "../spells/rest";
import { Slash } from "../spells/slash";
import { Player } from "./player";

export class Fighter extends Player {
	description = "A fighter who can attack.";
	health = 150;
	maxHealth = 150;
	spells: Record<string, Spell> = {
		slash: new Slash(this),
		guard: new Guard(this),
		rest: new Rest(this),
	}
}
