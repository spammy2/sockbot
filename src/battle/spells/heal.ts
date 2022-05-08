import { Entity } from "../core/entity";
import { Spell, SpellTypes } from "../core/spells";

export class Heal extends Spell {
	name = "Heal";
	description = "Heal 20 hp for team members.";
	manaCost = 20;
	type = SpellTypes.Heal;
	canUse(target: Entity): string | void {
		let mana = super.canUse(target);
		if (mana) return mana;

		if (target.team !== this.user.team) {
			return "You can't heal the enemy team!.";
		}
	}

	targetType: "team" = "team";
	action(target?: Entity) {
		super.action();
		if (!target) {target = this.user;}
		const healthRecovered = target.recoverHealth(20, this);
		return `${target.name} recovered ${healthRecovered} health.`;
	}
}