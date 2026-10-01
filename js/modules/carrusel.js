import { adaptaciones } from "../data/adaptaciones.js";

const HOJA = `<svg viewBox="0 0 40 24" aria-hidden="true"><path d="M3 12 C 10 1, 28 0, 37 12 C 28 23, 10 22, 3 12 Z" fill="rgba(255,200,221,.25)" stroke="#ffc8dd" stroke-width="1.6"/><path d="M3 12 H 34" stroke="#ffc8dd" stroke-width="1.4" stroke-linecap="round"/></svg>`;

/**
 * Carrusel de adaptaciones como un mazo de tarjetas: la actual al frente, las
 * dos siguientes asomando detrás y la anterior sale volando a la izquierda.
 * La posición de cada tarjeta se deriva solo del índice actual, así que no hay
 * estado de animación que se pueda desincronizar.
 */
export function carrusel({ alPasar, alVerVideo }) {
  const raiz = document.querySelector(".carrusel");
  const escenario = raiz.querySelector(".carrusel__escenario");
  const anterior = raiz.querySelector(".carrusel__flecha--prev");
  const siguiente = raiz.querySelector(".carrusel__flecha--next");
  const contador = raiz.querySelector(".carrusel__contador");
  const n = adaptaciones.length;
  let actual = 0;

  const tarjetas = adaptaciones.map((a, i) => {
    const el = document.createElement("article");
    el.className = "slide";
    el.setAttribute("role", "group");
    el.setAttribute("aria-roledescription", "diapositiva");
    el.setAttribute("aria-label", `${i + 1} de ${n}`);

    // El póster y su etiqueta comparten un marco para que la etiqueta quede en
    // la esquina de la imagen.
    const medio = document.createElement("div");
    medio.className = "slide__medio";

    if (a.imagen) {
      // Absoluta: un url() relativo dentro de una variable se resolvería
      // contra css/, no contra la página.
      el.style.setProperty("--poster", `url("${new URL(a.imagen, document.baseURI).href}")`);
      const img = document.createElement("img");
      img.className = "slide__imagen";
      img.src = a.imagen;
      img.alt = a.alt ?? a.titulo;
      img.loading = "lazy";
      img.draggable = false;
      medio.append(img);
    } else {
      const ph = document.createElement("div");
      ph.className = "slide__placeholder";
      ph.innerHTML = `${HOJA}<b></b><i></i>`;
      ph.querySelector("b").textContent = a.anio;
      ph.querySelector("i").textContent = a.titulo;
      medio.append(ph);
    }
    el.append(medio);

    const pie = document.createElement("p");
    pie.className = "slide__caption";
    for (const t of [a.formato, a.anio, a.titulo]) {
      const s = document.createElement("span");
      s.textContent = t;
      pie.append(s);
    }
    el.append(pie);

    if (a.nota) {
      const sello = document.createElement("span");
      sello.className = "slide__sello";
      sello.textContent = a.nota;
      medio.append(sello);
    }
    if (a.video) {
      const ver = document.createElement("button");
      ver.type = "button";
      ver.className = "slide__video";
      ver.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg><span>Ver la recreación</span>`;
      ver.setAttribute("aria-label", `Ver fragmento: ${a.video.titulo}`);
      // Sin esto, el pointerup del botón contaría como un deslizamiento corto.
      ver.addEventListener("pointerdown", (e) => e.stopPropagation());
      ver.addEventListener("click", () => alVerVideo?.(a.video, ver));
      pie.append(ver);
    }
    escenario.append(el);
    return el;
  });

  const posicion = (d) => {
    if (d === 0) return "0";
    if (n >= 4 && d === n - 1) return "-1";
    if (d <= 2) return String(d);
    return "rest";
  };

  const pintar = () => {
    tarjetas.forEach((t, i) => {
      const d = (i - actual + n) % n;
      t.dataset.pos = posicion(d);
      t.setAttribute("aria-hidden", String(d !== 0));
      // Las tarjetas de atrás no deben recibir foco ni clics (el botón de video).
      t.inert = d !== 0;
    });
    const a = adaptaciones[actual];
    contador.textContent = n > 1 ? `${actual + 1} / ${n}` : "";
    contador.setAttribute("aria-label", `${actual + 1} de ${n}: ${a.formato}, ${a.anio}, ${a.titulo}`);
  };

  const ir = (paso, desde) => {
    actual = (actual + paso + n) % n;
    pintar();
    if (desde) {
      const r = desde.getBoundingClientRect();
      alPasar?.(r.left + r.width / 2, r.top + r.height / 2);
    }
  };

  if (n < 2) {
    anterior.hidden = siguiente.hidden = true;
  } else {
    anterior.addEventListener("click", () => ir(-1, anterior));
    siguiente.addEventListener("click", () => ir(1, siguiente));
    raiz.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") ir(1, siguiente);
      if (e.key === "ArrowLeft") ir(-1, anterior);
    });

    // Deslizar con el dedo en móvil.
    let inicioX = null;
    escenario.addEventListener("pointerdown", (e) => (inicioX = e.clientX));
    escenario.addEventListener("pointerup", (e) => {
      if (inicioX === null) return;
      const dx = e.clientX - inicioX;
      inicioX = null;
      if (Math.abs(dx) > 40) ir(dx < 0 ? 1 : -1, dx < 0 ? siguiente : anterior);
    });
    escenario.addEventListener("pointercancel", () => (inicioX = null));
  }

  pintar();
}
