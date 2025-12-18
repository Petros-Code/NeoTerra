const modal = document.getElementById("modal");
const openBtn = document.getElementById("openBtn");
const closeBtn = document.getElementById("closeBtn");

// Ouvrir le modal
openBtn.addEventListener("click", () => {
  modal.style.display = "block";
});

// Fermer le modal
closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

// Fermer en cliquant à l'extérieur
window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});
