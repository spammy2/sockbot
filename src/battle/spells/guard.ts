import { Spell, SpellTypes } from "../spells";
import { Guarding } from "../statuses/guarding";

export class Guard extends Spell {
	name = "Guard";
	description = "Guard for 3 turns and take 20% less damage.";
	action() {
		super.action();
		this.user.statusEffectManager.add(Guarding);
	}
}