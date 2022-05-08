import { Spell, SpellTypes } from "../core/spells";

export class Rest extends Spell {
	name = "Rest";
	description = "Recovers up to 30 health and 30 mana.";
	manaCost = 0;
	type = SpellTypes.Heal;
	canUse(){
		if (this.user.health === this.user.maxHealth && this.user.mana === this.user.maxMana) {
			return "Already at full health and mana!";
		}
	}
	action() {
		super.action();
		const healthRecovered = this.user.recoverHealth(30, this);
		const manaRecovered = this.user.recoverMana(30, this);
		return `Recovered ${healthRecovered} health and ${manaRecovered} mana.`;
	}
}