import { Team } from "..";
import { Entity } from "../entity";
import { Spell, SpellTypes } from "../spells";
import { Charge } from "../spells/charge";
import { Cleanse } from "../spells/cleanse";
import { Curse } from "../spells/curse";
import { Heal } from "../spells/heal";
import { Rest } from "../spells/rest";
import { Slash } from "../spells/slash";
import { Smash } from "../spells/smash";
import { StatusEffect } from "../statuseffect";
import { Undead } from "../statuses/undead";

export abstract class Enemy extends Entity {
	name = "Unnamed Enemy";

	move(): { type: "success" | "failure"; message: string } {
		const spell = this.getRandomSpell();
		if (spell) {
			let target: Entity;
			if (spell.targetType === "enemy") {
				target = this.team.battle.playerTeam.getRandom();
			} else {
				target = this.team.getRandom();
			}

			const msg = spell.canUse(target);
			if (msg) {
				return { type: "failure", message: `${this.name} is unable to use ${spell.name}, ${msg}` };
			} else {
				const response = spell.action(target);
				return { type: "success", message: `${this.name} used ${spell.name}. ${response}` };
			}
		} else {
			return { type: "failure", message: "No spells available" };
		}
	}
}
