import { Entity } from "../core/entity";
import { Spell } from "../core/spells";
import { Charge } from "../spells/charge";
import { Cleanse } from "../spells/cleanse";
import { Heal } from "../spells/heal";
import { ManaBomb } from "../spells/mana-bomb";
import { Rest } from "../spells/rest";
import { Player } from "./player";

export class Healer extends Player {
	maxHealth = 80;
	health = 80;
	spells: Record<string, Spell> = {
		charge: new Charge(this),
		heal: new Heal(this),
		cleanse: new Cleanse(this),
		rest: new Rest(this),
	};
}
