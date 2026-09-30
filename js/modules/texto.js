/**
 * Parte títulos en letras y citas en palabras para animarlas una a una.
 * El texto original queda en un nodo sr-only: un lector de pantalla lee la
 * frase entera, no letra por letra.
 */

export function partirLetras(el) {
  const original = el.textContent.replace(/\s+/g, " ").trim();
  let i = 0;

  const procesar = (nodo) => {
    for (const hijo of [...nodo.childNodes]) {
      if (hijo.nodeType === Node.ELEMENT_NODE) {
        procesar(hijo);
        continue;
      }
      if (hijo.nodeType !== Node.TEXT_NODE || !hijo.textContent.trim()) continue;

      const frag = document.createDocumentFragment();
      hijo.textContent.trim().split(/\s+/).forEach((palabra, n) => {
        if (n) frag.append(" ");
        const w = document.createElement("span");
        w.className = "split-word";
        for (const letra of palabra) {
          const c = document.createElement("span");
          c.className = "split-char";
          c.textContent = letra;
          c.style.setProperty("--i", i++);
          c.style.setProperty("--r", `${Math.round(Math.random() * 60 - 30)}deg`);
          w.append(c);
        }
        frag.append(w);
      });
      hijo.replaceWith(frag);
    }
  };

  procesar(el);
  const visual = document.createElement("span");
  visual.setAttribute("aria-hidden", "true");
  visual.append(...el.childNodes);
  const lectura = document.createElement("span");
  lectura.className = "sr-only";
  lectura.textContent = original;
  el.append(lectura, visual);
}

export function partirPalabras(el) {
  const palabras = el.textContent.trim().split(/\s+/);
  el.textContent = "";
  palabras.forEach((p, i) => {
    if (i) el.append(" ");
    const s = document.createElement("span");
    s.className = "word";
    s.textContent = p;
    s.style.setProperty("--i", i);
    el.append(s);
  });
}
