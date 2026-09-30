import { enCadaScroll, limitar } from "../lib/scroll.js";

/**
 * Menú fijo: marca la sección activa, desliza el indicador bajo el enlace y
 * llena la línea salvia con el progreso de lectura.
 *
 * La sección activa se recalcula por posición en cada frame (no por eventos
 * de entrada/salida), así un salto largo desde el menú nunca deja marcada la
 * sección equivocada.
 */
export function menu({ alNavegar }) {
  const nav = document.querySelector(".menu");
  const enlaces = [...nav.querySelectorAll("a")];
  const secciones = enlaces.map((a) => document.querySelector(a.hash));
  const indicador = nav.querySelector(".menu__indicator");
  const progreso = document.querySelector(".menu__progress span");
  let activo = null;

  const marcar = (a) => {
    if (a === activo) return;
    activo = a;
    enlaces.forEach((e) => (e === a ? e.setAttribute("aria-current", "location") : e.removeAttribute("aria-current")));
    if (!a) {
      indicador.style.opacity = "0";
      return;
    }
    indicador.style.opacity = "1";
    indicador.style.width = `${a.offsetWidth}px`;
    indicador.style.transform = `translateX(${a.offsetLeft}px)`;
    // En móvil el menú se desplaza horizontalmente: trae el enlace a la vista.
    nav.scrollTo({ left: a.offsetLeft - nav.clientWidth / 2 + a.offsetWidth / 2, behavior: "smooth" });
  };

  enCadaScroll(() => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    progreso.style.transform = `scaleX(${max > 0 ? limitar(window.scrollY / max, 0, 1) : 0})`;

    const linea = window.innerHeight * 0.35;
    let actual = null;
    secciones.forEach((s, i) => {
      if (s.getBoundingClientRect().top <= linea) actual = enlaces[i];
    });
    if (window.scrollY + window.innerHeight >= doc.scrollHeight - 4) actual = enlaces.at(-1);
    marcar(actual);
  });

  window.addEventListener("resize", () => {
    const a = activo;
    activo = null;
    marcar(a);
  });

  enlaces.forEach((a) => a.addEventListener("click", () => alNavegar?.()));
}
