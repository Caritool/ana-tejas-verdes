import { movimientoReducido, punteroFino } from "./lib/entorno.js";
import { crearCampo } from "./hojas/campo.js";
import { partirLetras, partirPalabras } from "./modules/texto.js";
import { revelar } from "./modules/revelar.js";
import { menu } from "./modules/menu.js";
import { nota } from "./modules/nota.js";
import { tarjeta } from "./modules/tarjeta.js";
import { lineaTiempo } from "./modules/linea-tiempo.js";
import { carrusel } from "./modules/carrusel.js";
import { cursor } from "./modules/cursor.js";
import { parallax, inclinar } from "./modules/profundidad.js";
import { fondo } from "./modules/fondo.js";
import { musica } from "./modules/musica.js";
import { visorVideo } from "./modules/visor-video.js";

const entorno = { movimientoReducido, punteroFino };

// Sin movimiento no hay hojas: el campo queda como no-op.
const campo = movimientoReducido
  ? { soltar() {}, rafaga() {}, viento() {}, llover() {} }
  : crearCampo(document.querySelector(".hojas"));
const rafagaChica = (x, y) => campo.rafaga(x, y, 7, 200);

document.querySelectorAll("[data-split]").forEach(partirLetras);
document.querySelectorAll("[data-words]").forEach(partirPalabras);

revelar("[data-reveal], [data-split], .pie", entorno);
menu({ alNavegar: () => campo.viento() });
nota({ alAbrir: rafagaChica });
tarjeta();
lineaTiempo(entorno);
const audio = musica();
const visor = visorVideo({ alAbrir: () => audio.silenciar(), alCerrar: () => audio.reanudar() });
carrusel({ alPasar: rafagaChica, alVerVideo: (video, desde) => visor.abrir(video, desde) });
cursor(campo, entorno);
fondo(entorno);

// En táctil el parallax no aporta y en una columna empuja las imágenes sobre el texto.
if (!movimientoReducido && punteroFino) {
  parallax();
  inclinar();
}

// Portada: el trazo bajo el título, y hojas cayendo mientras se ve.
const hero = document.querySelector(".hero");
requestAnimationFrame(() => hero.classList.add("is-ready"));
if (!movimientoReducido) {
  const ritmo = punteroFino ? 1.3 : 0.6;
  new IntersectionObserver(([e]) => campo.llover(e.isIntersecting ? ritmo : 0), { threshold: 0.25 }).observe(hero);
}
