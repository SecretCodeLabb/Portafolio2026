/* =========================================================
   CONTENIDO DEL PORTAFOLIO
   Edita este archivo para cambiar textos, skills y proyectos.   ========================================================= */

const IMG = (project, name) => ({
  src: `assets/img/${project}/${name}.webp`,
  thumb: `assets/img/${project}/${name}-sm.webp`,
});
// Capturas de proyectos tech: una sola resolución, en assets/img/tech/<id>/
const TIMG = (project, name) => ({ src: `assets/img/tech/${project}/${name}.webp` });

window.PORTFOLIO = {
  profile: {
    name: "Daniel",
    role: "Artista 3D & Digital",
    location: "Medellín, Colombia",
    available: true,
    bio: [
      "Construyo imágenes que se sienten tangibles: superficies que reflejan, metales que pesan y personajes que tienen algo que contar.",
      "Trabajo el proceso completo — modelado, texturizado, iluminación y render — para producto, automotriz, props y personajes.",
    ],
    // Statement de artista: se muestra en "Sobre mí", debajo de la bio
    statement: [
      "Con mi trabajo quiero transmitir la curiosidad personal que tengo por diferentes temas, como la cultura, la historia y las formas de pensamiento, enfocándome en no centrarme solo en algo, sino en tener la libertad de conocer lo que para mí son muchos mundos diferentes y las formas de entender e interpretar esos mundos.",
      "Ya que cada uno de estos mundos es diferente, quiero que mi obra permita darles significado a las cosas más allá de lo visible, tratando de llevar a la gente a pensar al ver mi trabajo.",
      "Me gustaría asociar cada uno de estos mensajes o significados a algún sentimiento, idea o forma de vivir algo que esté pasando en el momento en que desarrollo la obra, para después tener un mapa de una parte de mi mente guardada en mi trabajo.",
    ],
    socials: [
      { label: "Instagram", url: "https://www.instagram.com/dxnx.3d/" },
      { label: "ArtStation", url: "https://www.artstation.com/danimation21" },
      { label: "GitHub", url: "https://github.com/SecretCodeLabb" },
      { label: "LinkedIn", url: "https://www.linkedin.com/in/daniel-oquendo-708959322/" },
    ],
  },

  /* Skills: nivel de 0 a 100. */
  software: [
    { name: "Blender", level: 90 },
    { name: "Substance 3D Painter", level: 85 },
    { name: "ZBrush", level: 70 },
    { name: "Photoshop", level: 80 },
    { name: "After Effects", level: 65 },
    { name: "DaVinci Resolve", level: 60 },
  ],
  disciplines: [
    "Modelado hard-surface",
    "Escultura de personajes",
    "Texturizado PBR",
    "Look development",
    "Iluminación de estudio",
    "Render fotorrealista",
    "Motion & loops",
    "Composición y post",
  ],
  process: [
    { title: "Referencia", text: "Moodboard, blueprints y estudio de forma antes del primer polígono." },
    { title: "Modelado", text: "Topología limpia, proporción y detalle a la escala del encuadre." },
    { title: "Superficie", text: "Materiales PBR, desgaste y texturas que cuentan la historia del objeto." },
    { title: "Luz & cámara", text: "Iluminación de estudio o ambiente, lentes y composición cinematográfica." },
    { title: "Render & post", text: "Render final, corrección de color y entrega lista para campaña." },
  ],

  /* =========================================================
     TECH LAB — programación, videojuegos y proyectos técnicos.
     Cada proyecto tiene su propia página: tech.html?p=<id>
     ========================================================= */
  tech: {
    intro:
      "Además del 3D, programo. Desarrollo software, páginas web y videojuegos donde el arte y el código se encuentran.",
    // Líneas de la terminal animada: cmd = lo que se "escribe", out = respuesta
    terminal: [
      { cmd: "whoami", out: "artista 3D · developer · game dev" },
      { cmd: "ls ./lab", out: "work-saver/  web/  unity-game/" },
      { cmd: "cargo run --release", out: "Don't Crash Now · autoguardado activo ✓" },
    ],
    stack: [
      { group: "Lenguajes", items: ["Rust", "C#", "TypeScript", "HTML / CSS"] },
      { group: "Motores & frameworks", items: ["Unity", "Tauri 2", "Vite"] },
      { group: "Sistema", items: ["Win32 API", "Windows 10 / 11"] },
      { group: "Herramientas", items: ["Git", "GitHub", "Blender"] },
    ],
    types: [
      { id: "tools", label: "Software" },
      { id: "web", label: "Web" },
      { id: "games", label: "Videojuegos" },
    ],
    /* Proyectos tech. Campos:
       id: se usa en la URL de su página (tech.html?p=id) y en su carpeta de imágenes
       type: uno de los ids de "types"
       status: "Publicado" | "En desarrollo" | "Prototipo" | "Experimento"
       cover / gallery: rutas en assets/img/tech/<id>/. Solo se muestran las imágenes que
         existen: sin portada se ve el snippet de código, y sin capturas no hay galería.
       preview: URL de un sitio publicado; la página lo muestra en vivo (escritorio / móvil)
         en lugar de imágenes
       links: [{ label, url }] — botones de la página (vacío = sin botones) */
    projects: [
      {
        id: "worksaver",
        title: "Work Saver",
        type: "tools",
        status: "Publicado",
        year: "",
        stack: ["Rust", "Tauri 2", "Win32 API", "TypeScript", "Vite"],
        snippet: "if idle_for(window) > pause {\n    send_shortcut(\"Ctrl+S\")?;\n    verify_saved(&file)?;\n    backup.version(&file)?;\n}",
        cover: TIMG("worksaver", "cover"),
        gallery: [
          { ...TIMG("worksaver", "1"), caption: "Panel principal" },
          { ...TIMG("worksaver", "2"), caption: "Programas vigilados" },
          { ...TIMG("worksaver", "3"), caption: "Copias versionadas" },
          { ...TIMG("worksaver", "4"), caption: "Icono en la bandeja" },
        ],
        links: [
          { label: "Descargar", url: "https://github.com/SecretCodeLabb/work-saver/releases", primary: true },
          { label: "Ver en GitHub", url: "https://github.com/SecretCodeLabb/work-saver" },
        ],
      },
      {
        id: "eclipse",
        title: "Eclipse",
        type: "web",
        status: "Publicado",
        year: "",
        stack: ["HTML", "CSS"],
        snippet: "<section class=\"eclipse\">\n  <video src=\"renderFinal1.mp4\"\n         autoplay muted loop>\n  </video>\n</section>",
        cover: TIMG("eclipse", "cover"),
        // preview: el sitio publicado se muestra en vivo en vez de la galería de imágenes
        preview: "https://secretcodelabb.github.io/paginaEclipse/",
        gallery: [],
        links: [],
      },
      {
        id: "unity-game",
        title: "Videojuego en Unity",
        type: "games",
        status: "En desarrollo",
        year: "",
        stack: ["Unity", "C#"],
        snippet: "void Update() {\n  var input = ReadMove();\n  body.velocity = input * speed;\n  cam.Follow(target);\n}",
        cover: TIMG("unity-game", "cover"),
        gallery: [
          { ...TIMG("unity-game", "1"), caption: "Gameplay" },
          { ...TIMG("unity-game", "2"), caption: "Nivel" },
          { ...TIMG("unity-game", "3"), caption: "Personaje" },
          { ...TIMG("unity-game", "4"), caption: "Interfaz" },
        ],
        links: [],
      },
    ],
  },

  categories: [
    { id: "auto", label: "Automotriz" },
    { id: "props", label: "Props" },
    { id: "personajes", label: "Personajes" },
    { id: "producto", label: "Producto" },
    { id: "motion", label: "Joyería & Motion" },
  ],

  /* Proyectos. El orden aquí es el orden en la web.
     year / client / software son opcionales: si están vacíos no se muestran. */
  projects: [
    {
      id: "gtr",
      title: "GT-R Nismo",
      category: "auto",
      tagline: "Estudio de luz y reflejos sobre carrocería negra",
      description:
        "Visualización automotriz en estudio oscuro: líneas de luz que dibujan la carrocería, detalles rojos y un configurador de color para explorar variantes de pintura.",
      year: "",
      client: "",
      role: "Modelado, lookdev, iluminación y render",
      software: [],
      cover: IMG("gtr", "cover"),
      accent: "#c8102e",
      video: { src: "assets/video/gtr-reel.mp4", poster: "assets/video/gtr-reel-poster.webp" },
      variants: [
        { label: "Negro", color: "#0b0b0c", img: IMG("gtr", "6") },
        { label: "Blanco", color: "#e9e9ea", img: IMG("gtr", "blanco") },
        { label: "Morado", color: "#3a2fd0", img: IMG("gtr", "morado") },
        { label: "Verde", color: "#22b14c", img: IMG("gtr", "verde") },
      ],
      gallery: [
        { ...IMG("gtr", "2"), caption: "Frontal — firma de luz" },
        { ...IMG("gtr", "3"), caption: "Tres cuartos frontal" },
        { ...IMG("gtr", "4"), caption: "Detalle de rin y guardabarro", wide: true },
        { ...IMG("gtr", "5"), caption: "Trasera" },
        { ...IMG("gtr", "6"), caption: "Perfil bajo en penumbra" },
      ],
    },
    {
      id: "wasteland",
      title: "Wasteland GT-R",
      category: "auto",
      tagline: "El mismo auto, después del fin del mundo",
      description:
        "Reinterpretación post-apocalíptica: blindaje, púas, compresor expuesto y faros auxiliares. Un estudio de desgaste, óxido y luz cálida de desierto.",
      year: "",
      client: "",
      role: "Kitbash, modelado, texturizado y render",
      software: [],
      cover: IMG("wasteland", "cover"),
      accent: "#d28a2c",
      gallery: [
        { ...IMG("wasteland", "1"), caption: "Tres cuartos frontal", wide: true },
        { ...IMG("wasteland", "2"), caption: "Compresor y barra de faros" },
        { ...IMG("wasteland", "3"), caption: "Detalle de rueda" },
        { ...IMG("wasteland", "4"), caption: "Contraluz trasero" },
        { ...IMG("wasteland", "5"), caption: "Perfil trasero" },
        { ...IMG("wasteland", "6"), caption: "Vista cenital", wide: true },
      ],
    },
    {
      id: "ledger",
      title: "The Ledger",
      category: "props",
      tagline: "Revólver y munición con historia",
      description:
        "Prop hard-surface con pintura roja desgastada, acentos de latón y empaque de munición diseñado a medida. Presentación tipo estuche de producto.",
      year: "",
      client: "",
      role: "Modelado, texturizado, diseño de empaque y render",
      software: [],
      cover: IMG("ledger", "cover"),
      accent: "#b3121b",
      gallery: [
        { ...IMG("ledger", "1"), caption: "Perfil izquierdo", wide: true },
        { ...IMG("ledger", "2"), caption: "Perfil derecho" },
        { ...IMG("ledger", "3"), caption: "Tres cuartos" },
        { ...IMG("ledger", "4"), caption: "Cañón en perspectiva" },
        { ...IMG("ledger", "5"), caption: "Detalle con humo" },
        { ...IMG("ledger", "6"), caption: "Caja de munición", wide: true },
        { ...IMG("ledger", "7"), caption: "Empaque — serie" },
      ],
    },
    {
      id: "chef-coco",
      title: "Chef Coco",
      category: "personajes",
      tagline: "Omakase — un cocodrilo con estilo",
      description:
        "Personaje estilizado sobre pedestal, con escenografía propia llena de pequeñas historias: bocinas, trofeo, botella y portadas. Pensado como figura coleccionable.",
      year: "",
      client: "",
      role: "Diseño, escultura, texturizado y render",
      software: [],
      cover: IMG("chef-coco", "cover"),
      accent: "#2fd04a",
      square: true,
      gallery: [
        { ...IMG("chef-coco", "1"), caption: "Pose principal" },
        { ...IMG("chef-coco", "2"), caption: "Vista frontal" },
        { ...IMG("chef-coco", "3"), caption: "Detalle — trofeo y botella" },
        { ...IMG("chef-coco", "4"), caption: "Detalle — portadas" },
      ],
    },
    {
      id: "whiskey",
      title: "Jack Daniel's",
      category: "producto",
      tagline: "Botella, vidrio y madera en bodega",
      description:
        "Visualización de producto de bebidas: refracción del vidrio, líquido ámbar y una bodega de barriles iluminada para campaña.",
      year: "",
      client: "",
      role: "Lookdev de vidrio y líquido, escena e iluminación",
      software: [],
      cover: IMG("whiskey", "whiskey2"),
      accent: "#c46a1d",
      gallery: [
        { ...IMG("whiskey", "whiskey"), caption: "Hero shot con humo", wide: true },
        { ...IMG("whiskey", "whiskey2"), caption: "Bodega — luz cálida" },
        { ...IMG("whiskey", "whiskey3"), caption: "Bodega — luz lateral" },
      ],
    },
    {
      id: "marathon",
      title: "Marathon Energy Drink",
      category: "producto",
      tagline: "Latas energéticas con acento neón",
      description:
        "Diseño de etiqueta y visualización de empaque para una bebida energética ficticia. Contraste de negro profundo con verde neón.",
      year: "",
      client: "",
      role: "Diseño de etiqueta, modelado y render",
      software: [],
      cover: IMG("marathon", "latas3"),
      accent: "#7cff3a",
      gallery: [
        { ...IMG("marathon", "latas3"), caption: "Six-pack" },
        { ...IMG("marathon", "latas2"), caption: "Composición en grupo" },
        { ...IMG("marathon", "latas4"), caption: "Frente y tabla nutricional" },
        { ...IMG("marathon", "latas1"), caption: "Trío vertical" },
      ],
    },
    {
      id: "rolex",
      title: "Rolex",
      category: "motion",
      tagline: "Acero y esfera negra en movimiento",
      description:
        "Animación de producto para relojería: reflejos controlados sobre acero pulido y una cámara que recorre el detalle.",
      year: "",
      client: "",
      role: "Modelado, materiales y animación",
      software: [],
      cover: { src: "assets/video/rolex-poster.webp", thumb: "assets/video/rolex-poster.webp" },
      accent: "#cfd3d8",
      video: { src: "assets/video/rolex.mp4", poster: "assets/video/rolex-poster.webp" },
      gallery: [],
    },
    {
      id: "cadenas",
      title: "Cadenas",
      category: "motion",
      tagline: "Eslabones en loop infinito",
      description:
        "Pieza de motion abstracto en formato vertical: eslabones que se trenzan y giran en un loop hipnótico, pensado para redes.",
      year: "",
      client: "",
      role: "Simulación, animación y render",
      software: [],
      cover: { src: "assets/video/cadenas-poster.webp", thumb: "assets/video/cadenas-poster.webp" },
      accent: "#2a4bff",
      vertical: true,
      video: { src: "assets/video/cadenas.mp4", poster: "assets/video/cadenas-poster.webp" },
      gallery: [],
    },
  ],
};
