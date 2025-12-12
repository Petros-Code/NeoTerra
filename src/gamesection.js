export function GameSection() {
  document.addEventListener("DOMContentLoaded", function () {
    const accueilMain = document.querySelector(".accueil-main");
    const sectionGame = document.getElementById("game");
    const btnAccueilJouer = document.getElementById("btnAccueilJouer");

    if (btnAccueilJouer) {
      btnAccueilJouer.addEventListener("click", function () {
        accueilMain.style.display = "none";
        sectionGame.style.display = "block";
      });
    }
  });
}
