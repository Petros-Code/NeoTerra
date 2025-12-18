let activeModal = null;

function getMountTarget(container) {
  if (typeof container === "string" && container) {
    const found = document.querySelector(container);
    if (found) {
      return found;
    }
  }

  const game = document.getElementById("game");
  if (game) return game;
  return document.body;
}

function closeActiveModal(reason = "closed") {
  if (!activeModal) return;
  activeModal.close(reason);
}

export function openQuestionModal(opts) {
  opts = opts || {};

  const title = opts.title || "Question";
  const question = String(opts.question || "");
  const answers = Array.isArray(opts.answers) ? opts.answers : [];
  const mountTarget = getMountTarget(opts.container);

  if (!question) {
    return Promise.reject(
      new Error("openQuestionModal: 'question' est requis")
    );
  }
  if (answers.length === 0) {
    return Promise.reject(
      new Error(
        "openQuestionModal: 'answers' doit contenir au moins une réponse"
      )
    );
  }

  if (activeModal) closeActiveModal("replaced");

  return new Promise((resolve, reject) => {
    const backdrop = document.createElement("div");
    backdrop.className = "nt-modal-backdrop";

    const modal = document.createElement("div");
    modal.className = "nt-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");

    const header = document.createElement("div");
    header.className = "nt-modal__header";

    const titleEl = document.createElement("h2");
    titleEl.className = "nt-modal__title";
    titleEl.textContent = title;

    const closeBtn = document.createElement("button");
    closeBtn.className = "nt-modal__close";
    closeBtn.type = "button";
    closeBtn.textContent = "×";
    closeBtn.setAttribute("aria-label", "Fermer");

    header.appendChild(titleEl);
    header.appendChild(closeBtn);

    const body = document.createElement("div");
    body.className = "nt-modal__body";

    modal.appendChild(header);
    modal.appendChild(body);
    backdrop.appendChild(modal);

    if (mountTarget !== document.body) {
      backdrop.style.position = "absolute";
      mountTarget.style.position = "relative";
    }

    const teardown = () => {
      backdrop.remove();
    };

    const questionEl = document.createElement("p");
    questionEl.className = "nt-modal__question";
    questionEl.textContent = question;
    body.appendChild(questionEl);

    const answersEl = document.createElement("div");
    answersEl.className = "nt-modal__answers";

    const cleanup = () => {
      document.removeEventListener("keydown", onKeyDown);
      backdrop.removeEventListener("click", onBackdropClick);
      closeBtn.removeEventListener("click", onCloseClick);
    };

    const close = (reason = "closed") => {
      if (!activeModal) return;
      activeModal = null;
      cleanup();
      teardown();
      reject(new Error(reason));
    };

    const onCloseClick = () => close("close");
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close("escape");
      }
    };
    const onBackdropClick = (event) => {
      if (event.target === backdrop) close("backdrop");
    };

    answers.forEach((label, index) => {
      const btn = document.createElement("button");
      btn.className = "nt-modal__answerBtn";
      btn.type = "button";
      btn.textContent = String(label);
      btn.addEventListener("click", () => {
        if (!activeModal) return;
        activeModal = null;
        cleanup();
        teardown();
        resolve({ index, label: String(label) });
      });
      answersEl.appendChild(btn);
    });

    body.appendChild(answersEl);

    backdrop.addEventListener("click", onBackdropClick);
    closeBtn.addEventListener("click", onCloseClick);
    document.addEventListener("keydown", onKeyDown);

    mountTarget.appendChild(backdrop);
    const firstBtn = answersEl.querySelector("button") || closeBtn;
    if (firstBtn && firstBtn.focus) firstBtn.focus();

    activeModal = { close };
  });
}

export function openAnswerModal(opts) {
  opts = opts || {};

  const title = opts.title || "Réponse";
  const message = String(opts.message || "");
  const buttonLabel = opts.buttonLabel || "OK";
  const mountTarget = getMountTarget(opts.container);

  if (activeModal) closeActiveModal("replaced");

  return new Promise((resolve) => {
    const backdrop = document.createElement("div");
    backdrop.className = "nt-modal-backdrop";

    const modal = document.createElement("div");
    modal.className = "nt-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");

    const header = document.createElement("div");
    header.className = "nt-modal__header";

    const titleEl = document.createElement("h2");
    titleEl.className = "nt-modal__title";
    titleEl.textContent = title;

    const closeBtn = document.createElement("button");
    closeBtn.className = "nt-modal__close";
    closeBtn.type = "button";
    closeBtn.textContent = "×";
    closeBtn.setAttribute("aria-label", "Fermer");

    header.appendChild(titleEl);
    header.appendChild(closeBtn);

    const body = document.createElement("div");
    body.className = "nt-modal__body";

    modal.appendChild(header);
    modal.appendChild(body);
    backdrop.appendChild(modal);

    if (mountTarget !== document.body) {
      backdrop.style.position = "absolute";
      mountTarget.style.position = "relative";
    }

    const teardown = () => {
      backdrop.remove();
    };

    const messageEl = document.createElement("p");
    messageEl.className = "nt-modal__question";
    messageEl.textContent = message;
    body.appendChild(messageEl);

    const actions = document.createElement("div");
    actions.className = "nt-modal__answers";

    const okBtn = document.createElement("button");
    okBtn.className = "nt-modal__answerBtn";
    okBtn.type = "button";
    okBtn.textContent = buttonLabel;

    actions.appendChild(okBtn);
    body.appendChild(actions);

    const cleanup = () => {
      document.removeEventListener("keydown", onKeyDown);
      backdrop.removeEventListener("click", onBackdropClick);
      closeBtn.removeEventListener("click", onCloseClick);
      okBtn.removeEventListener("click", onOk);
    };

    const close = () => {
      if (!activeModal) return;
      activeModal = null;
      cleanup();
      teardown();
      resolve();
    };

    const onOk = () => close();
    const onCloseClick = () => close();
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
    };
    const onBackdropClick = (event) => {
      if (event.target === backdrop) close();
    };

    okBtn.addEventListener("click", onOk);
    backdrop.addEventListener("click", onBackdropClick);
    closeBtn.addEventListener("click", onCloseClick);
    document.addEventListener("keydown", onKeyDown);

    mountTarget.appendChild(backdrop);
    if (okBtn.focus) okBtn.focus();

    activeModal = { close };
  });
}

// Compatibilité avec l'ancien nom
export function askQuestionModal(opts) {
  return openQuestionModal(opts);
}

export function closeQuestionModal() {
  closeActiveModal("closed");
}
