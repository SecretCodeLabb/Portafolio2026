# Portafolio 3D — sitio web

Sitio estático (HTML + CSS + JS, sin dependencias ni build).

## Ver en local
Abre `index.html` con doble clic, o mejor sirve la carpeta (los videos cargan más fluido):

    python -m http.server 8000      # luego abre http://localhost:8000

## Estructura
```
portfolio/
├── index.html              Estructura de la página
├── assets/
│   ├── css/styles.css      Estilos (paleta negro/plata en :root)
│   ├── js/data.js          ← CONTENIDO: perfil, skills, proyectos (edita aquí)
│   ├── js/main.js          Interacciones
│   ├── img/<proyecto>/     Renders en WebP (2400px) + miniaturas (-sm, 900px)
│   ├── video/              Videos H.264 optimizados + posters
│   └── brand/logo.png      Logo
└── tools/optimize_media.py Regenera img/ y video/ desde los originales
```

## Editar contenido
Todo el texto vive en `assets/js/data.js`: nombre, ciudad, redes, bio, statement de
artista y niveles de software. Cada proyecto acepta `year`, `client` y `software`
(si están vacíos no se muestran).

### Tech Lab (programación y videojuegos)
En `data.js`, bloque `tech`: intro, líneas de la terminal, stack y `projects`.
Cada proyecto tech tiene `id`, `title`, `type` (tools / web / games), `status`, `stack`,
`links`, `cover` y `gallery`, o `preview` (URL de un sitio publicado, que se muestra
en vivo en lugar de imágenes).

Cada proyecto tiene su propia página: `tech.html?p=<id>` (ej. `tech.html?p=worksaver`).
Guarda las capturas en `assets/img/tech/<id>/` con los nombres que indica `data.js`
(`cover.webp`, `1.webp`, `2.webp`…). Solo se muestran las que existen: sin portada,
la tarjeta y la página muestran el `snippet` de código; sin capturas, no hay galería.

## Añadir un proyecto
1. Pon los renders originales en una carpeta junto a `portfolio/`.
2. Añádela al diccionario `PROJECTS` en `tools/optimize_media.py` y ejecuta
   `python tools/optimize_media.py` (requiere Pillow y ffmpeg).
3. Añade una entrada en `projects` de `data.js`.

## Publicación
Repositorio: https://github.com/SecretCodeLabb/Portafolio2026
Se publica con GitHub Pages desde la rama `main` en https://secretcodelabb.github.io/Portafolio2026/.
Cada `git push` a `main` actualiza la página en uno o dos minutos.

Seguridad: Content-Security-Policy en `index.html` y `tech.html` (solo scripts propios;
fuentes de Google Fonts; iframes solo de secretcodelabb.github.io), vista en vivo en un
iframe con `sandbox`, enlaces externos con `rel="noopener"` y sin datos personales ni
secretos en el repositorio. Si agregas un sitio de otro dominio en `preview`, añádelo a
`frame-src` en la CSP de `tech.html`.

## Derechos de autor
© 2026 Daniel Oquendo. Todos los derechos reservados; ver [LICENSE](LICENSE).
El código es visible solo para publicar el sitio; no se concede licencia de uso.

## Funciones
Preloader · cursor personalizado · nube de puntos 3D interactiva · viewport con
“render” de portadas · filtros por categoría · vista lista/grid con preview flotante
y tilt 3D · detalle de proyecto con URL propia (`#/proyecto/gtr`) · configurador de
color · lightbox con teclado y swipe · reel con controles · archivo arrastrable ·
skills animadas · Tech Lab con terminal animada y tarjetas filtrables · copiar correo · responsive y `prefers-reduced-motion`.
