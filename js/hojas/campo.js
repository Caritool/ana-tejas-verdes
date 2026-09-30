import { crearSprites, LADO } from "./sprites.js";

const GRAVEDAD = 260; // px/s²
const MAX_HOJAS = 140;

const azar = (min, max) => min + Math.random() * (max - min);

/**
 * Campo de hojas sobre un canvas fijo a pantalla completa.
 *
 * El bucle de rAF solo corre mientras haya hojas vivas o lluvia ambiental: en
 * reposo la página no gasta un solo frame. El pool está acotado; si se llena,
 * la hoja más vieja cede su lugar.
 */
export function crearCampo(canvas) {
  const ctx = canvas.getContext("2d");
  const hojas = [];
  let sprites = [];
  let dpr = 1, ancho = 0, alto = 0;
  let corriendo = false, ultimo = 0;
  let lluvia = 0, acumulado = 0; // hojas por segundo desde arriba

  function redimensionar() {
    const nuevoDpr = Math.min(window.devicePixelRatio || 1, 2);
    if (nuevoDpr !== dpr || !sprites.length) sprites = crearSprites(nuevoDpr);
    dpr = nuevoDpr;
    ancho = window.innerWidth;
    alto = window.innerHeight;
    canvas.width = Math.round(ancho * dpr);
    canvas.height = Math.round(alto * dpr);
  }

  function soltar(x, y, o = {}) {
    if (hojas.length >= MAX_HOJAS) hojas.shift();
    hojas.push({
      x, y,
      vx: o.vx ?? azar(-30, 30),
      vy: o.vy ?? azar(-20, 30),
      arrastre: o.arrastre ?? 1.6,
      terminal: azar(55, 110),
      tam: o.tam ?? azar(26, 44),
      rot: azar(0, Math.PI * 2),
      giro: azar(-1.6, 1.6),
      fase: azar(0, Math.PI * 2),
      aleteo: azar(1.8, 3.4),
      vaiven: azar(18, 46),
      vida: o.vida ?? azar(2.6, 4.2),
      edad: 0,
      sprite: sprites[(Math.random() * sprites.length) | 0],
    });
    arrancar();
  }

  function rafaga(x, y, n = 10, fuerza = 260) {
    for (let i = 0; i < n; i++) {
      const ang = azar(0, Math.PI * 2);
      const v = azar(0.35, 1) * fuerza;
      soltar(x, y, { vx: Math.cos(ang) * v, vy: Math.sin(ang) * v - 80, arrastre: 2.4 });
    }
  }

  /** Ventarrón que cruza la pantalla de izquierda a derecha. */
  function viento(n = 26) {
    for (let i = 0; i < n; i++) {
      soltar(azar(-120, -20), azar(alto * 0.05, alto * 0.75), {
        vx: azar(520, 900), vy: azar(-60, 40), arrastre: 0.9, tam: azar(32, 56), vida: azar(2.2, 3.2),
      });
    }
  }

  function llover(porSegundo) {
    lluvia = porSegundo;
    if (lluvia > 0) arrancar();
  }

  function arrancar() {
    if (corriendo) return;
    corriendo = true;
    ultimo = performance.now();
    requestAnimationFrame(tick);
  }

  function tick(ahora) {
    // El tope evita que una pestaña en segundo plano devuelva un salto enorme.
    const dt = Math.min((ahora - ultimo) / 1000, 0.05);
    ultimo = ahora;

    if (lluvia > 0) {
      acumulado += lluvia * dt;
      while (acumulado >= 1) {
        acumulado -= 1;
        soltar(azar(-40, ancho), -50, { vx: azar(15, 60), vy: azar(20, 50), tam: azar(38, 66), vida: 14 });
      }
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, ancho, alto);

    for (let i = hojas.length - 1; i >= 0; i--) {
      const h = hojas[i];
      h.edad += dt;
      if (h.edad > h.vida || h.y > alto + 60 || h.x > ancho + 120) {
        hojas.splice(i, 1);
        continue;
      }

      h.vx -= h.vx * h.arrastre * dt;
      h.vy += GRAVEDAD * dt;
      if (h.vy > h.terminal) h.vy += (h.terminal - h.vy) * 4 * dt;
      h.fase += h.aleteo * dt;
      h.x += (h.vx + Math.sin(h.fase) * h.vaiven) * dt;
      h.y += h.vy * dt;
      h.rot += (h.giro + Math.cos(h.fase) * 0.9) * dt;

      // El coseno del aleteo en X simula la hoja dándose vuelta en el aire.
      let voltear = Math.cos(h.fase * 0.8);
      if (Math.abs(voltear) < 0.14) voltear = voltear < 0 ? -0.14 : 0.14;

      const t = h.edad / h.vida;
      ctx.globalAlpha = Math.min(1, h.edad * 6, (1 - t) * 4);
      const s = h.tam / LADO;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.translate(h.x, h.y);
      ctx.rotate(h.rot);
      ctx.scale(s * voltear, s);
      ctx.drawImage(h.sprite, -LADO / 2, -LADO / 2, LADO, LADO);
    }
    ctx.globalAlpha = 1;

    if (hojas.length || lluvia > 0) {
      requestAnimationFrame(tick);
    } else {
      corriendo = false;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  redimensionar();
  window.addEventListener("resize", redimensionar);

  return { soltar, rafaga, viento, llover };
}
