import color_cat from "./colors.js";

export default class PlayerManager {
	players = [];

	constructor(nb_player) {
		for (let i = 1; i <= nb_player; i++) {
			const new_player = new Player(i, `Player_${i}`);
			this.players.push(new_player);
		}
	}

	winners() {
		const nb_colors = Object.keys(color_cat).length;
		return this.players.filter((p) => p.color_finished() >= nb_colors);
	}

	get_players() {
		return this.players;
	}

	get_player(id) {
		return this.players.find((p) => p["id"] == id);
	}

	set_color_done(player_id, color) {
		const player = this.get_player(player_id);
		player.color_done(color);
	}
}

class Player {
	id;
	name = "";
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
