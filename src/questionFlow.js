import { openAnswerModal, openQuestionModal } from "./modal.js";

export function initQuestionFlow({
  container,
  buttonId = "questionButton",
} = {}) {
  const mountContainer = typeof container === "string" ? container : "#game";

  const button = document.getElementById(buttonId);

  if (!button) {
    console.warn(`Le bouton ${buttonId} n'a pas été trouvé!`);
    return;
  }

  button.addEventListener("click", async () => {
    const answers = [
      "Laisser couler l'eau pendant le brossage des dents",
      "Couper l'eau pendant le savonnage / brossage",
      "Prendre uniquement des bains",
      "Laver sa voiture au jet toutes les semaines",
    ];

    try {
      const result = await openQuestionModal({
        title: "Question",
        question:
          "Quel geste du quotidien réduit le plus le gaspillage d'eau ?",
        answers,
        container: mountContainer,
      });

      const correctIndex = 1;
      const isCorrect = result.index === correctIndex;

      await openAnswerModal({
        title: "Réponse",
        message: isCorrect
          ? "Bravo, tu peux continuer au prochain tour."
          : "Mauvaise réponse, retente ta chance au prochain tour.",
        buttonLabel: "OK",
        container: mountContainer,
      });
    } catch {
      // Modale fermée : on ignore.
    }
  });
}
