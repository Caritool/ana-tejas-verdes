/** "Vieja nota": el botón despliega la nota como un papel que se desdobla. */
export function nota({ alAbrir }) {
  const boton = document.querySelector(".nota-trigger");
  const caja = document.getElementById(boton.getAttribute("aria-controls"));

  boton.addEventListener("click", () => {
    const abrir = boton.getAttribute("aria-expanded") !== "true";
    boton.setAttribute("aria-expanded", String(abrir));

    if (abrir) {
      caja.hidden = false;
      // Forzar layout para que la transición arranque desde el estado cerrado.
      void caja.offsetHeight;
      caja.classList.add("is-open");
      const r = boton.getBoundingClientRect();
      alAbrir?.(r.left + r.width / 2, r.top + r.height / 2);
      return;
    }

    caja.classList.remove("is-open");
    caja.addEventListener(
      "transitionend",
      () => {
        if (boton.getAttribute("aria-expanded") === "false") caja.hidden = true;
      },
      { once: true },
    );
  });
}
