import { initQuestionFlow } from "./questionFlow.js";

export function GameSection() {
  // Le DOM est déjà chargé car le script est chargé en module à la fin du body
  const accueilMain = document.querySelector(".accueil-main");
  const sectionGame = document.getElementById("game");
  const btnAccueilJouer = document.getElementById("btnAccueilJouer");

  console.log("GameSection initialisée");
  console.log("Bouton trouvé:", btnAccueilJouer);
  console.log("Section game trouvée:", sectionGame);

  initQuestionFlow({ container: "#game", buttonId: "questionButton" });

  if (btnAccueilJouer) {
    btnAccueilJouer.addEventListener("click", function () {
      console.log("Bouton 'Jouer' cliqué!");
      if (accueilMain) {
        accueilMain.style.display = "none";
      }
      if (sectionGame) {
        sectionGame.style.display = "flex";
        console.log("Section game affichée");
      }

      console.log("Chargement du jeu...");
      import("./game.js")
        .then(({ initGame }) => {
          console.log("Appel de initGame()...");
          initGame();
        })
        .catch((err) => {
          console.error("Impossible de charger le jeu (Phaser/Vite):", err);
          alert(
            "Impossible de lancer le jeu. Lance le projet avec Vite: `npm install` puis `npm run dev`."
          );
        });
    });
  } else {
    console.error("Le bouton btnAccueilJouer n'a pas été trouvé!");
  }
}
