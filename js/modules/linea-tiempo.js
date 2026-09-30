import { enCadaScroll, limitar } from "../lib/scroll.js";

/**
 * Línea temporal vertical que se dibuja con el scroll. Cada frame recalcula
 * cuánto de la línea debe verse y qué fases quedan por encima de ese punto;
 * al subir, las fases vuelven a esconderse.
 */
export function lineaTiempo({ movimientoReducido }) {
  const linea = document.querySelector(".timeline");
  const fases = [...linea.querySelectorAll(".fase")];

  if (movimientoReducido) {
    linea.style.setProperty("--progress", 1);
    fases.forEach((f) => f.classList.add("is-in"));
    return;
  }

  enCadaScroll(() => {
    const r = linea.getBoundingClientRect();
    const p = limitar((window.innerHeight * 0.7 - r.top) / r.height, 0, 1);
    linea.style.setProperty("--progress", p.toFixed(4));
    for (const f of fases) {
      const centro = (f.offsetTop + f.offsetHeight / 2) / linea.offsetHeight;
      f.classList.toggle("is-in", centro <= p + 0.04);
    }
  });
}
