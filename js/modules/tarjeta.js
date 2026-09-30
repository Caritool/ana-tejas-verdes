/**
 * Flip card de "Hay una doble naturaleza". Se voltea con clic en la tarjeta o
 * con el botón (que es lo que alcanza el teclado). La cara oculta sale del
 * árbol de accesibilidad para que no se lean las dos a la vez.
 */
export function tarjeta() {
  const flip = document.querySelector(".flip");
  const interior = flip.querySelector(".flip__inner");
  const [caraA, caraB] = flip.querySelectorAll(".flip__cara");
  const boton = flip.querySelector(".flip__boton");

  const pintar = (volteada) => {
    flip.classList.toggle("is-flipped", volteada);
    boton.setAttribute("aria-pressed", String(volteada));
    caraA.setAttribute("aria-hidden", String(volteada));
    caraB.setAttribute("aria-hidden", String(!volteada));
  };

  const voltear = () => pintar(!flip.classList.contains("is-flipped"));
  interior.addEventListener("click", voltear);
  boton.addEventListener("click", voltear);
  pintar(false);
}
