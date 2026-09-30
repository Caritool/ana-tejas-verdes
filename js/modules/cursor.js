import { svgCursor, PALETAS } from "../hojas/forma.js";

/**
 * Cursor de hoja con estela de hojas que caen. Con puntero fino la estela
 * sigue al mouse; en pantallas táctiles, cada toque suelta un puñado.
 */
export function cursor(campo, { punteroFino, movimientoReducido }) {
  if (punteroFino) {
    const raiz = document.documentElement.style;
    raiz.setProperty("--cursor-hoja", `${svgCursor(PALETAS[0])}, auto`);
    raiz.setProperty("--cursor-hoja-activa", `${svgCursor(PALETAS[3])}, pointer`);
    document.documentElement.classList.add("leaf-cursor");
  }
  if (movimientoReducido) return;

  if (!punteroFino) {
    window.addEventListener("pointerdown", (e) => campo.rafaga(e.clientX, e.clientY, 6, 180), { passive: true });
    return;
  }

  const PASO = 38; // px de recorrido por hoja soltada
  let x0 = null, y0 = null, recorrido = 0;

  window.addEventListener(
    "pointermove",
    (e) => {
      if (e.pointerType !== "mouse") return;
      if (x0 !== null) recorrido += Math.hypot(e.clientX - x0, e.clientY - y0);
      const vx = x0 === null ? 0 : e.clientX - x0;
      x0 = e.clientX;
      y0 = e.clientY;
      if (recorrido < PASO) return;
      recorrido = 0;
      campo.soltar(e.clientX, e.clientY, { vx: vx * 6, vy: -30, tam: 24 + Math.random() * 18 });
    },
    { passive: true },
  );

  window.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "mouse") campo.rafaga(e.clientX, e.clientY, 9, 240);
  });
}
