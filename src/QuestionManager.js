export default class QuestionManager {
	questions;
	questions_asked = [];
	colors = ["red", "green", "yellow", "lime", "orange", "blue"];
	color_cat = {};

	// Fetch questions from json
	async fetch_questions() {
		const q = await fetch("../assets/questions.json");
		this.questions = await q.json();

		// Assign default colors to categories
		let i = 0;
		for (const category in this.questions) {
			this.color_cat[category] = this.colors[i];
			i++;
		}
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

	// Get all categories
	get_categories() {
		return Object.keys(this.questions);
	}

	// Get a random non-asked question from category
	get_question(category) {
		// Current possible questions to be asked
		const current_questions = this.questions[category].filter((q) => !this.questions_asked.includes(q["id"]));

		// Random question
		const random_question = current_questions[Math.floor(Math.random() * current_questions.length)];
		this.questions_asked.push(random_question["id"]);

		return random_question;
	}
}
