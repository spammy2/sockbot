import { Spell } from "./spells";
import { StatusEffect } from "./statuseffect";

// the origin of a damage. undefined is when death is invoked using cheats.
export type Origin = Spell | StatusEffect | undefined;