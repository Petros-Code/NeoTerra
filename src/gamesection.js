import { initGame } from "./game.js";

export function GameSection() {
  // Le DOM est déjà chargé car le script est chargé en module à la fin du body
  const accueilMain = document.querySelector(".accueil-main");
  const sectionGame = document.getElementById("game");
  const btnAccueilJouer = document.getElementById("btnAccueilJouer");

  console.log("GameSection initialisée");
  console.log("Bouton trouvé:", btnAccueilJouer);
  console.log("Section game trouvée:", sectionGame);

  if (btnAccueilJouer) {
    btnAccueilJouer.addEventListener("click", function () {
      console.log("Bouton 'Jouer' cliqué!");
      if (accueilMain) {
        accueilMain.style.display = "none";
      }
      if (sectionGame) {
        sectionGame.style.display = "block";
        console.log("Section game affichée");
      }
      console.log("Appel de initGame()...");
      initGame();
    });
  } else {
    console.error("Le bouton btnAccueilJouer n'a pas été trouvé!");
  }
}
