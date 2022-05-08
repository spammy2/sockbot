import { Entity } from "../entity";
import { Spell, SpellTypes } from "../spells";
import { StatusEffect } from "../statuseffect";

export class Cleanse extends Spell {
	name = "Cleanse";
	description = "Remove all negative effects from target user.";
	manaCost = 50;
	type = SpellTypes.Heal;
	canUse(target: Entity): string | void {
		let mana = super.canUse(target);
		if (mana) return mana;

		if (target.team !== this.user.team) {
			return "You can't cleanse the enemy team!.";
		}
	}

	targetType: "team" = "team";
	requiresTarget = true;
	action(target?: Entity) {
		super.action();
		if (!target) {target = this.user;}
		const removed: StatusEffect[] = [];
		for (const effect of target.statusEffectManager.statusEffects) {
			if (effect.effectType === "curse") {
				removed.push(effect);
				effect.remove();
			}
		}
		return `Removed ${removed.length} negative effects from ${target.name}.`;
	}
}