import { enCadaScroll, limitar } from "../lib/scroll.js";

const LAVADO = 0.8;          // velo blanco sobre la acuarela mientras hay texto
const LAVADO_FINAL = 0.3;    // al llegar al pie, la acuarela aparece casi entera
const INICIO_LLEGADA = 0.82; // fracción del scroll donde empieza a aclararse
const RECORRIDO_MIN = 1.2;   // la imagen mide al menos 1,2 pantallas de alto

/**
 * "Viaje al hogar": la acuarela queda fija detrás de la página y baja del
 * cielo a las colinas con el scroll; en el último tramo el velo se aclara.
 *
 * Se mueve con transform sobre un <img> y no con background-position, que
 * obligaría a repintar toda la pantalla en cada frame de scroll.
 */
export function fondo({ movimientoReducido }) {
  const capa = document.querySelector(".fondo");
  const img = capa.querySelector("img");
  // De los atributos, no de img.width: ese devuelve el tamaño ya estirado por CSS.
  const proporcion = Number(img.getAttribute("width")) / Number(img.getAttribute("height"));

  enCadaScroll(() => {
    const alto = window.innerHeight;
    const cubrir = Math.max(alto, window.innerWidth / proporcion);
    const altoImagen = Math.max(cubrir, alto * RECORRIDO_MIN);
    const doc = document.documentElement;
    const max = doc.scrollHeight - alto;
    const p = max > 0 ? limitar(window.scrollY / max, 0, 1) : 0;

    const desplazo = movimientoReducido ? 0 : -(altoImagen - alto) * p;
    const llegada = limitar((p - INICIO_LLEGADA) / (1 - INICIO_LLEGADA), 0, 1);

    capa.style.setProperty("--fondo-alto", `${altoImagen.toFixed(0)}px`);
    capa.style.setProperty("--fondo-y", `${desplazo.toFixed(1)}px`);
    capa.style.setProperty("--lavado", (LAVADO - (LAVADO - LAVADO_FINAL) * llegada).toFixed(3));
  });
}
