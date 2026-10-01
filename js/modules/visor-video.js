/**
 * Visor de video en un <dialog> modal.
 *
 * El iframe de YouTube se crea al abrir y se destruye al cerrar: hasta que
 * alguien toca el botón la página no carga nada de YouTube, y quitar el
 * iframe es la única forma fiable de detener la reproducción.
 */
export function visorVideo({ alAbrir, alCerrar } = {}) {
  const dialogo = document.querySelector(".visor");
  const marco = dialogo.querySelector(".visor__marco");
  const titulo = dialogo.querySelector(".visor__titulo");
  let disparador = null;

  dialogo.addEventListener("close", () => {
    marco.replaceChildren();
    alCerrar?.();
    disparador?.focus();
  });

  // Un clic en el telón (fuera del contenido) también cierra.
  dialogo.addEventListener("click", (e) => {
    if (e.target === dialogo) dialogo.close();
  });

  return {
    abrir({ id, titulo: nombre }, desde) {
      disparador = desde ?? null;
      const iframe = document.createElement("iframe");
      iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0&modestbranding=1`;
      iframe.title = nombre;
      iframe.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = "strict-origin-when-cross-origin";
      marco.replaceChildren(iframe);
      titulo.textContent = nombre;
      alAbrir?.();
      dialogo.showModal();
    },
  };
}
