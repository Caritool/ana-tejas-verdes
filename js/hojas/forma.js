/**
 * Geometría de las hojas, en coordenadas unitarias.
 *
 * Cada forma devuelve { contorno, nervios, tallo } como listas de puntos [x, y].
 * La misma geometría alimenta el sprite del canvas y el SVG del cursor, para
 * que ambos sean la misma hoja.
 */

/** Generador pseudoaleatorio con semilla: las variantes salen iguales en cada visita. */
export function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Hoja de olmo aserrada (la de la referencia ilustrada): base en x=-0.5,
 * punta en x=+0.5, dientes inclinados hacia la punta.
 */
export function olmo(seed = 1) {
  const r = rng(seed);
  const dientes = 9;
  // Elíptica, más ancha hacia el 40 % y con la punta alargada.
  const ancho = (t) => 0.26 * Math.pow(Math.sin(Math.PI * Math.pow(t, 0.8)), 0.85) * (1 - 0.25 * t);

  const lado = (signo, escala) => {
    const pts = [];
    for (let k = 0; k < dientes; k++) {
      const t0 = k / dientes;
      const t1 = (k + 0.78) / dientes;
      pts.push([t0 - 0.5, signo * ancho(t0) * escala]);
      if (t0 > 0.1 && t0 < 0.9) pts.push([t1 - 0.5, signo * (ancho(t1) * escala + 0.03 + r() * 0.045)]);
    }
    return pts;
  };

  const arriba = lado(-1, 1);
  const abajo = lado(1, 0.84 + r() * 0.1).reverse();
  const contorno = [...arriba, [0.5, 0.01], ...abajo];

  const curva = (t) => 0.03 * Math.sin(Math.PI * t);
  const nervios = [[]];
  for (let t = 0; t <= 0.9; t += 0.05) nervios[0].push([t - 0.5, curva(t)]);
  for (const t of [0.14, 0.3, 0.46, 0.62]) {
    for (const signo of [-1, 1]) {
      const pts = [];
      for (let u = 0; u <= 1.001; u += 0.2) {
        const tt = t + u * 0.24;
        pts.push([tt - 0.5, curva(tt) + signo * ancho(tt) * 0.92 * Math.sin((u * Math.PI) / 2)]);
      }
      nervios.push(pts);
    }
  }

  const tallo = [[-0.5, 0], [-0.6, 0.02], [-0.7, 0.06]];
  return { contorno, nervios, tallo };
}

/**
 * Hoja de arce simplificada (la de la referencia de hojas cayendo), apuntando
 * hacia arriba con el tallo abajo; cabe en [-1, 1].
 */
export function arce(seed = 1) {
  const r = rng(seed);
  const j = () => (r() - 0.5) * 0.05;
  const derecha = [
    [0, -1],
    [0.12 + j(), -0.74],
    [0.22, -0.8 + j()],
    [0.16, -0.44],
    [0.5 + j(), -0.6],
    [0.84, -0.68 + j()],
    [0.7, -0.38],
    [0.92 + j(), -0.2],
    [0.56, -0.06 + j()],
    [0.64, 0.2],
    [0.38 + j(), 0.14],
    [0.26, 0.34],
    [0.06, 0.3],
  ];
  const izquierda = derecha.slice(1, -1).reverse().map(([x, y]) => [-x + j(), y + j()]);
  const contorno = [...derecha, [0, 0.36], ...izquierda];

  const base = [0, 0.3];
  const nervios = [
    [base, [0, -0.9]],
    [base, [0.34, -0.3], [0.8, -0.64]],
    [base, [-0.34, -0.3], [-0.8, -0.64]],
    [base, [0.32, 0.12], [0.6, 0.18]],
    [base, [-0.32, 0.12], [-0.6, 0.18]],
  ];
  const tallo = [[0, 0.32], [0.03, 0.55], [0.1, 0.72]];
  return { contorno, nervios, tallo };
}

export const PALETAS = [
  { relleno: "#e39a63", punteado: "#b2522a", trazo: "#4f2413" }, // siena (la de la referencia)
  { relleno: "#e0703f", punteado: "#a8361c", trazo: "#4a1a0e" }, // naranja quemado
  { relleno: "#eab45c", punteado: "#b77a26", trazo: "#4f3214" }, // ocre
  { relleno: "#d4543a", punteado: "#8f2616", trazo: "#3f140b" }, // rojo arce
];

/** SVG del cursor: hoja de olmo con la punta en el hotspot (3, 3). */
export function svgCursor({ relleno, trazo } = PALETAS[0], tam = 32) {
  const L = tam * 0.95;
  const { contorno, nervios, tallo } = olmo(7);
  const d = (pts) => pts.map(([x, y], i) => `${i ? "L" : "M"}${(x * L).toFixed(2)} ${(y * L).toFixed(2)}`).join("");
  const g = `translate(3 3) rotate(225) translate(${-0.5 * L} 0)`;
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${tam}" height="${tam}" viewBox="0 0 ${tam} ${tam}">` +
    `<g transform="${g}" stroke-linejoin="round" stroke-linecap="round" fill="none">` +
    `<path d="${d(contorno)}Z" fill="${relleno}" stroke="none" transform="translate(1.2 1.4)"/>` +
    `<path d="${d(contorno)}Z" stroke="${trazo}" stroke-width="1.3"/>` +
    `<path d="${d(nervios[0])}${d(tallo)}" stroke="${trazo}" stroke-width="1.1"/>` +
    `</g></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}") 3 3`;
}
