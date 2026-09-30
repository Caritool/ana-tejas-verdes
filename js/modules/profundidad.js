import { enCadaScroll } from "../lib/scroll.js";

/** Parallax suave: la imagen se desplaza un poco más lento que la página. */
export function parallax() {
  const capas = [...document.querySelectorAll("[data-parallax]")];
  enCadaScroll(() => {
    const mitad = window.innerHeight / 2;
    for (const el of capas) {
      const r = el.getBoundingClientRect();
      if (r.bottom < -100 || r.top > window.innerHeight + 100) continue;
      const desplazo = (r.top + r.height / 2 - mitad) * Number(el.dataset.parallax);
      el.style.translate = `0 ${desplazo.toFixed(1)}px`;
    }
  });
}

/** Inclinación 3D que sigue al puntero sobre las ilustraciones. */
export function inclinar() {
  for (const el of document.querySelectorAll("[data-tilt]")) {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.classList.add("is-tilting");
      el.style.transform = `perspective(900px) rotateX(${(-y * 10).toFixed(2)}deg) rotateY(${(x * 12).toFixed(2)}deg) scale(1.02)`;
    });
    el.addEventListener("pointerleave", () => {
      el.classList.remove("is-tilting");
      el.style.transform = "";
    });
  }
}
