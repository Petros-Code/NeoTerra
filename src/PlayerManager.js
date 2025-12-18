import color_cat from "./colors.js";

// Manage the list of player
export default class PlayerManager {
	players = [];

	constructor(nb_player) {
		for (let i = 1; i <= nb_player; i++) {
			const new_player = new Player(i, `Player_${i}`);
			this.players.push(new_player);
		}
	}

	// Return list of all players that got all colors done
	winners() {
		const nb_colors = Object.keys(color_cat).length;
		return this.players.filter((p) => p.color_finished() >= nb_colors);
	}

	// Return player list
	get_players() {
		return this.players;
	}

	// Return player by id
	get_player(id) {
		return this.players.find((p) => p["id"] == id);
	}

	// Set a color as done for a player by id
	set_color_done(player_id, color) {
		const player = this.get_player(player_id);
		player.color_done(color);
	}

	// Set fail status for a player by id
	set_failed(player_id, fail) {
		const player = this.get_player(player_id);
		player.has_failed = fail;
	}
}

// Player data
class Player {
	id;
	name = "";
	has_failed = false;
	done = [];

	constructor(id, name) {
		this.id = id;
		this.name = name;
	}

	color_done(color) {
		this.done.push(color);
	}

	color_finished() {
		return this.done.length;
	}
}
