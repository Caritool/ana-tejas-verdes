const consulta = (q) => window.matchMedia(q).matches;

/** Se lee una vez al cargar: una presentación no cambia de dispositivo a mitad de camino. */
export const movimientoReducido = consulta("(prefers-reduced-motion: reduce)");
export const punteroFino = consulta("(hover: hover) and (pointer: fine)");
