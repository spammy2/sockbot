import { Battle } from "./battle";
import { Entity } from "./entity";

export class Team {
	entities: Entity[] = [];

	private _currentEntity = 0;
	get currentEntity(){
		if (this.entities[this._currentEntity]){
			return this.entities[this._currentEntity];
		} else {
			return this.entities[0];
		}
	}

	get enemyTeam() {
		return this.battle.teams.find((t) => t !== this) as Team;
	}

	turnStarted(){}

	remove(entity: Entity) {
		if (this.currentEntity === entity) {
			this.nextEntity();
		}
		this.entities = this.entities.filter((e) => e !== entity);
	}

	getRandom(){
		return this.entities[Math.floor(Math.random() * this.entities.length)];
	}

	// returns true if all members have gone
	// we don't have to worry if it goes over the max num, because currentEntity is a getter
	nextEntity() {
		this._currentEntity++;

		if (this._currentEntity >= this.entities.length) {
			return true;
		}
	}
	constructor(public battle: Battle) {
	}
}