import { Entity } from "./entity";
import { Team } from "./team";
import { Origin } from "./types";

export abstract class Battle {
	teams: Team[] = [];
	currentTeam: Team;
	
	announce(message: string) {

	}
	nextTeam(){
		let index = this.teams.indexOf(this.currentTeam) + 1;
		if (index >= this.teams.length) {
			index = 0;
		}
		this.currentTeam = this.teams[index];
		this.currentTeam.turnStarted();
	}
	onDeath(entity: Entity, origin: Origin){
		
	}
	constructor() {
		this.currentTeam = this.teams[0];
	}
}