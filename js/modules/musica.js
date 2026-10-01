/**
 * Música de fondo: empieza apagada y solo suena cuando alguien toca el botón.
 *
 * El volumen va por Web Audio (GainNode) y no por audio.volume porque iOS
 * ignora audio.volume; el archivo ya viene normalizado bajo (-30 LUFS).
 */
export function musica() {
  const boton = document.querySelector(".musica");
  const audio = new Audio(boton.dataset.src);
  audio.loop = true;
  audio.preload = "none"; // nadie descarga 600 KB de audio que quizá no escuche

  let ctx = null, ganancia = null, sonando = false, reanudar = false, pausaPendiente = 0;

  const pintar = () => {
    boton.setAttribute("aria-pressed", String(sonando));
    boton.setAttribute("aria-label", sonando ? "Pausar la música" : "Reproducir la música");
    boton.classList.toggle("is-playing", sonando);
  };

  // El AudioContext se crea dentro del clic: fuera de un gesto nace suspendido.
  const armarGrafo = () => {
    if (ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    ganancia = ctx.createGain();
    ganancia.gain.value = 0;
    ctx.createMediaElementSource(audio).connect(ganancia).connect(ctx.destination);
  };

  const fundir = (destino, segundos) => {
    if (!ganancia) {
      audio.volume = destino;
      return;
    }
    const g = ganancia.gain;
    const t = ctx.currentTime;
    g.cancelScheduledValues(t);
    g.setValueAtTime(g.value, t);
    g.linearRampToValueAtTime(destino, t + segundos);
  };

  const encender = async () => {
    clearTimeout(pausaPendiente);
    armarGrafo();
    try {
      // Ambos se piden sin await de por medio: Safari exige que play() salga
      // del gesto mismo, no de una promesa resuelta después.
      await Promise.all([audio.play(), ctx?.resume()]);
    } catch (err) {
      console.warn("No se pudo iniciar la música:", err.name);
      return;
    }
    sonando = true;
    fundir(1, 2.2);
    pintar();
  };

  const apagar = () => {
    sonando = false;
    fundir(0, 0.8);
    pintar();
    pausaPendiente = setTimeout(() => audio.pause(), 850);
  };

  boton.addEventListener("click", () => (sonando ? apagar() : encender()));

  // Mientras corre un video la música se aparta y vuelve al cerrarlo, solo si
  // estaba sonando antes.
  let retomarTrasVideo = false;

  document.addEventListener("visibilitychange", () => {
    if (document.hidden && sonando) {
      reanudar = true;
      apagar();
    } else if (!document.hidden && reanudar) {
      reanudar = false;
      encender();
    }
  });

  pintar();

  return {
    silenciar() {
      retomarTrasVideo = sonando;
      if (sonando) apagar();
    },
    reanudar() {
      if (retomarTrasVideo) encender();
      retomarTrasVideo = false;
    },
  };
}
