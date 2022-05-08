import { Entity } from "../entity";
import { Spell, SpellTypes } from "../spells";

export class ManaBomb extends Spell {
	name = "Mana Bomb";
	description = "Gives 10 mana to all users in the team.";
	type = SpellTypes.Heal;
	canUse(target: Entity): string | void {
		let mana = super.canUse(target);
		if (mana) return mana;
	}

	action() {
		super.action();
		for (const member of this.user.team.entities) {
			member.recoverMana(10, this);
		}
		return `Gave 10 mana to all team members.`;
	}
}