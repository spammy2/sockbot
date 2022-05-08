import { Entity } from "./entity";

export enum SpellTypes {
	Curse,
	Normal,
	Arrow,
	Fire,
	Lightning,
	Heal,
	Holy,
	Water,
}

export abstract class Spell {
	abstract name: string;
	abstract description: string;
	manaCost = 0;

	// returns void if can use
	canUse(target?: Entity): string | void {
		if (this.user.mana < this.manaCost) {
			return "Not enough mana";
		};
		if (this.requiresTarget && !target) {
			return "No target";
		}
	}
	action(target?: Entity): string | void {
		this.user.mana -= this.manaCost;
	}
	requiresTarget = false;
	targetType: "enemy" | "team" = "enemy";
	type = SpellTypes.Normal;
	constructor(public user: Entity) {

	}
}