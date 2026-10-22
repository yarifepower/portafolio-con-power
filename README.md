# Yarife Power · Portafolio

Sitio estático (HTML + CSS + JavaScript, sin dependencias ni paso de compilación), listo para publicar en Vercel.

**Concepto:** *Cada marca tiene un Power. Mi trabajo es desatarlo.* Cada proyecto se presenta como un «Power» (Famko: el poder de reunir; Incognito: el poder del misterio, etc.) con la misma estructura: contexto → Power escondido → cómo lo desatamos → galería → resultado.

## Estructura

```
sitio-web/
├── index.html            ← todo el contenido (textos, proyectos, contacto)
├── 404.html              ← página de error con tu personaje
├── vercel.json           ← caché y cabeceras para Vercel
└── assets/
    ├── css/styles.css    ← sistema visual y un tema de color por proyecto
    ├── js/main.js        ← menú, visor de imágenes, medidor de Power, formulario
    ├── fonts/            ← Montserrat y Caveat (autoalojadas)
    ├── img/              ← imágenes WebP optimizadas, cada una en 2 o 3 tamaños
    ├── og.jpg            ← imagen para compartir en redes (1200 × 630)
    ├── favicon.svg
    └── apple-touch-icon.png
```

## Publicar en Vercel

**Opción A — con GitHub (recomendada):**
1. Crea un repositorio en GitHub y sube el contenido de la carpeta `sitio-web`.
2. En [vercel.com](https://vercel.com) → *Add New… → Project* → importa el repositorio.
3. *Framework Preset:* **Other**. Deja vacíos el *Build Command* y el *Output Directory*.
4. *Deploy*. Cada vez que subas un cambio a GitHub, Vercel publica la nueva versión.

**Opción B — con la terminal (requiere Node.js):**
```
npm i -g vercel
cd sitio-web
vercel --prod
```

El sitio está configurado para **https://portafolio-con-power.vercel.app** (etiquetas `canonical`, `og:url` y `og:image` en `index.html`).
Si más adelante conectas un dominio propio, cambia esas tres URL por la nueva para que la vista previa se vea bien en WhatsApp e Instagram.

## Verlo en tu computadora

Ábrelo con un servidor local (algunos navegadores bloquean el logo si abres el archivo con doble clic):
- VS Code → extensión *Live Server* → clic derecho en `index.html` → *Open with Live Server*, o
- `npx serve sitio-web` si tienes Node.js.

## Editar contenido

- **Textos:** todo está en `index.html`, organizado por secciones con comentarios (`<!-- 01 FAMKO -->`, etc.).
- **Contacto:** el correo y el WhatsApp están en `index.html` (sección Contacto) y en `assets/js/main.js` (`CONTACT`).
- **Formulario:** no guarda datos; arma el mensaje y lo abre en WhatsApp o en el correo de quien escribe.
  Si más adelante prefieres recibir los mensajes en una bandeja, puedes conectarlo a un servicio como Formspree.
- **Imágenes nuevas:** expórtalas en WebP a ~1600 px y ~900 px de ancho (calidad 80 %) y nómbralas como las existentes
  (`nombre-1600.webp`, `nombre-900.webp`). Mantén `width` y `height` en la etiqueta `<img>` para que la página no salte al cargar.

## Agregar un proyecto (por ejemplo, el séptimo)

1. Copia un bloque `<section class="case" …>` completo y cambia `id`, `data-theme`, `data-name` y `data-num`.
2. En `styles.css`, duplica una línea de `[data-theme="…"]` con los colores de la nueva marca.
3. Agrega la fila correspondiente en el índice (`<ol class="index__list">`) y actualiza los textos «Power 0X de 0X» y «Seis marcas, seis poderes».
   El medidor de Power se ajusta solo.
