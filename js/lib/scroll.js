/**
 * Un solo listener de scroll/resize para toda la página, coalescido a un
 * callback por frame. Los módulos se suscriben en vez de poner el suyo.
 */
const suscriptores = new Set();
let pendiente = false;

function pedirFrame() {
  if (pendiente) return;
  pendiente = true;
  requestAnimationFrame(() => {
    pendiente = false;
    for (const fn of suscriptores) fn();
  });
}

window.addEventListener("scroll", pedirFrame, { passive: true });
window.addEventListener("resize", pedirFrame);

export function enCadaScroll(fn) {
  suscriptores.add(fn);
  pedirFrame();
  return () => suscriptores.delete(fn);
}

export const limitar = (v, min, max) => Math.min(max, Math.max(min, v));
