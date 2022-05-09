import { Entity } from "./entity";
import { Team } from "./team";
import { Origin } from "./types";

export abstract class Battle {
	teams: Team[] = [];
	private _currentTeam = 0;
	
	get currentTeam(){
		if (!this.teams[this._currentTeam]){
			this._currentTeam = 0;
		}
		return this.teams[this._currentTeam];
	}
	announce(message: string) {

	}
	
	
	nextTeam(){
		this._currentTeam++;
		this.currentTeam.turnStarted();
	}
	onDeath(entity: Entity, origin: Origin){
		
	}
	constructor() {
	}
}