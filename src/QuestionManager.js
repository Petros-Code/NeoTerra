import color_cat from "./colors.js";

// Manages question fetch and access
export default class QuestionManager {
	questions;
	questions_asked = [];

	// Fetch questions from json
	async fetch_questions() {
		const q = await fetch("../assets/questions.json");
		this.questions = await q.json();
	}

	// Set color for a category
	set_color(category, color) {
		this.color_cat[category] = color;
	}

	// Get color from a category
	get_color(category) {
		return this.color_cat[category];
	}

	// Reset questions asked
	reset_questions() {
		this.questions_asked = [];
	}

	// Get category from color
	get_category(color) {
		for (const [category, c] of Object.entries(this.color_cat)) {
			if (c == color) return category;
		}
		return null;
	}

	// Get a random non-asked question from category
	get_question(color) {
		// Get category from color
		const category = this.get_category(color);

		if (!category) {
			console.error(`No matching color found for ${color}`);
			return;
		}

		// Current possible questions to be asked
		const current_questions = this.questions[category].filter((q) => !this.questions_asked.includes(q["id"]));
		console.log(current_questions.length);

		// Random question
		const random_question = current_questions[Math.floor(Math.random() * current_questions.length)];
		this.questions_asked.push(random_question["id"]);

		return random_question;
	}
}
