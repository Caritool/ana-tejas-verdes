/**
 * Adaptaciones del carrusel de "Ana hoy", en el orden en que se muestran.
 *
 * `imagen` y `alt` son opcionales: sin imagen, la tarjeta se dibuja con el año
 * y el título. `video` ({ id de YouTube, titulo, boton? }) agrega un botón que
 * lo abre en un visor; `boton` cambia su texto (por defecto «Ver el tráiler»).
 * `nota` es una etiqueta corta sobre la esquina del póster.
 */
export const adaptaciones = [
  {
    formato: "Película",
    anio: 1919,
    titulo: "Ana de las Tejas Verdes",
    imagen: "assets/img/adaptacion-1919.webp",
    alt: "Póster de la película muda de 1919, con Mary Miles Minter como Ana, envuelta en un chal junto a una ventana",
    // No sobrevive ninguna copia de la película; el video es una reconstrucción.
    nota: "Película perdida",
    video: { id: "M1MaN1x-Vho", titulo: "Anne of Green Gables (1919): fragmento de la recreación de Jack y Linda Hutton", boton: "Ver la recreación" },
  },
  {
    formato: "Animación",
    anio: 1979,
    titulo: "Ana, la Niña Pelirroja",
    imagen: "assets/img/adaptacion-1979.webp",
    alt: "Póster japonés de Akage no An: Ana, pelirroja y con trenzas, apoya la cara en las manos y mira hacia arriba",
    video: { id: "xRcLjQLSQgw", titulo: "Akage no An: Green Gables e no Michi, de Isao Takahata: tráiler del reestreno (en japonés)" },
  },
  {
    formato: "Película",
    anio: 1985,
    titulo: "Ana de las Tejas Verdes",
    imagen: "assets/img/adaptacion-1985.webp",
    alt: "Póster de Anne of Green Gables de 1985: Megan Follows como Ana, con sombrero de paja, junto a un carruaje",
    video: { id: "31aZ8pOMhlc", titulo: "Anne of Green Gables (1985): tráiler oficial de Sullivan Entertainment" },
  },
  {
    formato: "Serie de televisión animada",
    anio: 2000,
    titulo: "El Viaje Fantástico de Ana",
    imagen: "assets/img/adaptacion-2000.webp",
    alt: "Carátula animada de Anne: Journey to Green Gables, con Ana pelirroja sonriendo frente a una casa de tejados verdes",
    video: { id: "HYr3j8Emy4s", titulo: "Anne: Journey to Green Gables: película completa (en inglés, 81 min)", boton: "Ver la película" },
  },
  {
    formato: "Serie",
    anio: 2017,
    titulo: 'Anne With an "E"',
    imagen: "assets/img/adaptacion-2017.webp",
    alt: "Póster de Anne with an E de Netflix: Ana con una corona de flores en un campo de trigo",
    video: { id: "kdaDb8W8LZ8", titulo: "Anne with an E: tráiler principal de la temporada 1 (subtitulado)" },
  },
];
