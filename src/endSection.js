export function EndSection() {
  document.addEventListener("DOMContentLoaded", function () {
    const sectionGame = document.getElementById("game");
    const sectionEnd = document.getElementById("endSection");
    const endButton = document.getElementById("endButton");
    const restartButton = document.getElementById("restartButton");
    const accueil = document.querySelector(".accueil-main");

    if (restartButton) {
      restartButton.addEventListener("click", function () {
        sectionEnd.style.display = "none";
        accueil.style.display = "block";
      });
    }

    if (endButton) {
      endButton.addEventListener("click", function () {
        sectionGame.style.display = "none";
        sectionEnd.style.display = "block";
      });
    }
  });
}
