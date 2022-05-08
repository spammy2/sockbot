import { Entity } from "../entity";
import { Spell } from "../spells";
import { Charge } from "../spells/charge";
import { Cleanse } from "../spells/cleanse";
import { Heal } from "../spells/heal";
import { ManaBomb } from "../spells/mana-bomb";
import { Rest } from "../spells/rest";

export class Healer extends Entity {
	maxHealth = 80;
	health = 80;
	spells: Record<string, Spell> = {
		heal: new Heal(this),
		cleanse: new Cleanse(this),
		rest: new Rest(this),
		["mana-bomb"]: new ManaBomb(this),
	};
}
