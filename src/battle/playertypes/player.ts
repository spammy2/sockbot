import { Entity } from "../core/entity";

// nominal type for player
export abstract class Player extends Entity {
	__isPlayer = true;
	name = "Unnamed Player";
}