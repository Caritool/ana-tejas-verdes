import { olmo, arce, PALETAS, rng } from "./forma.js";

/** Lado lógico del sprite en px CSS; las partículas lo escalan a su tamaño. */
export const LADO = 96;

/**
 * Pinta cada variante una sola vez en un canvas fuera de pantalla, al estilo
 * de la referencia ilustrada: relleno corrido del trazo, punteado y contorno a
 * mano. Por frame solo se hace drawImage; el punteado (cientos de puntos por
 * hoja) sería inviable de redibujar 60 veces por segundo.
 */
export function crearSprites(dpr = 1) {
  const sprites = [];
  let semilla = 11;
  for (const paleta of PALETAS) {
    // El olmo tiene el tallo a la izquierda; se corre a la derecha para centrarlo.
    sprites.push(pintar(olmo(semilla), paleta, { escala: LADO * 0.74, dx: 0.1, semilla: semilla++ }, dpr));
    sprites.push(pintar(arce(semilla), paleta, { escala: LADO * 0.42, dx: 0, semilla: semilla++ }, dpr));
  }
  return sprites;
}

function pintar({ contorno, nervios, tallo }, paleta, { escala, dx, semilla }, dpr) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = Math.round(LADO * dpr);
  const ctx = canvas.getContext("2d");
  const r = rng(semilla * 97);

  ctx.scale(dpr, dpr);
  ctx.translate(LADO / 2 + dx * escala, LADO / 2);
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  const camino = (pts, cerrar) => {
    const p = new Path2D();
    pts.forEach(([x, y], i) => (i ? p.lineTo(x * escala, y * escala) : p.moveTo(x * escala, y * escala)));
    if (cerrar) p.closePath();
    return p;
  };
  const forma = camino(contorno, true);

  // Relleno fuera de registro, como una serigrafía con la tinta corrida.
  ctx.save();
  ctx.translate(3.2, -2.2);
  ctx.rotate(-0.04);
  ctx.scale(1.03, 1.05);
  ctx.fillStyle = paleta.relleno;
  ctx.fill(forma);

  ctx.clip(forma);
  ctx.fillStyle = paleta.punteado;
  for (let i = 0; i < 900; i++) {
    const x = (r() - 0.5) * escala * 2;
    const y = (r() - 0.5) * escala * 2;
    // Más denso hacia la base, como en la referencia.
    if (r() > 0.25 + 0.6 * (0.5 - x / (escala * 2))) continue;
    ctx.beginPath();
    ctx.arc(x, y, 0.3 + r() * 0.45, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  ctx.strokeStyle = paleta.trazo;
  ctx.lineWidth = 1.4;
  ctx.stroke(forma);
  ctx.lineWidth = 1;
  for (const n of nervios) ctx.stroke(camino(n));
  ctx.lineWidth = 1.6;
  ctx.stroke(camino(tallo));

  return canvas;
}
