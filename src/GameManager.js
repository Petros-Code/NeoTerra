import QuestionManager from "./QuestionManager";
import PlayerManager from "./PlayerManager";

export default class GameManager {
	q_manager;
	p_manager;
	current_player_id = 1;

	constructor(nb_player) {
		this.q_manager = new QuestionManager();
		this.p_manager = new PlayerManager(nb_player);
		this.q_manager.fetch_questions();
	}

	// Get the next player id
	get_next_player() {
		return this.current_player_id;
	}

	// Calculate next player id
	next_player() {
		this.current_player_id++;
		if (this.current_player_id > this.p_manager.get_players().length) {
			this.current_player_id = 1;
		}
	}

	// Called when player arrives on a tile
	on_tile(player_id, color) {
		const question = this.q_manager.get_question(color);

		// TODO: send question to modal and get result
		let good_answer = true;

		if (good_answer) {
			set_color_done(player_id, color);
		}

		this.p_manager.set_failed(player_id, !good_answer);
		this.next_player();
	}

	// Get winners
	get_winners() {
		return this.p_manager.winners();
	}
}
