import { Spell, SpellTypes } from "../core/spells";
import { Focused } from "../statuses/focused";

export class Focus extends Spell {
	name = "Focus";
	description = "Gain focus effect, which does more damage";
	manaCost = 30;
	type = SpellTypes.Buff;
	action() {
		super.action();
		this.user.statusEffectManager.add(Focused);
		return `Gained focus effect`;
	}
}