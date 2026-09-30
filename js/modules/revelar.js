/**
 * Entrada al hacer scroll. Es de una sola vez (se desuscribe al revelar): lo
 * que ya se vio no vuelve a esconderse, así un scroll hacia arriba no parpadea.
 */
export function revelar(selector, { movimientoReducido }) {
  const elementos = [...document.querySelectorAll(selector)];

  // Escalonado entre hermanos que entran juntos.
  for (const el of elementos) {
    if (el.classList.contains("divider")) continue;
    const hermanos = [...el.parentElement.children].filter((h) => h.matches("[data-reveal]"));
    const i = hermanos.indexOf(el);
    if (i > 0) el.style.setProperty("--delay", `${i * 110}ms`);
  }

  if (movimientoReducido) {
    elementos.forEach((el) => el.classList.add("is-in"));
    return;
  }

  const io = new IntersectionObserver(
    (entradas) => {
      for (const e of entradas) {
        if (!e.isIntersecting) continue;
        e.target.classList.add("is-in");
        io.unobserve(e.target);
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
  );
  elementos.forEach((el) => io.observe(el));
}
