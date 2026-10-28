# Empanadas del Eje · página web

Sitio estático de Empanadas del Eje, fábrica de empanadas artesanales congeladas (Pereira y Dosquebradas).

- `index.html`: inicio con las empanadas, comparador de tamaños, la fábrica, armador de pedidos por WhatsApp, preguntas frecuentes y contacto.
- `folleto.html`: folleto tamaño carta (2 páginas). Se imprime desde el navegador o se descarga en `assets/folleto-empanadas-del-eje.pdf`.
- `plan.html`: plan de acción protegido con PIN, con tareas para marcar y registro de visitas (se guardan en el navegador de cada dispositivo).

## Publicar con GitHub Pages

Settings → Pages → Source: "Deploy from a branch" → rama `main`, carpeta `/ (root)`.

## Plan de acción (PIN)

El contenido del plan no está en el repositorio en texto plano: va cifrado en `assets/plan-data.js`.
Es una protección básica del lado del navegador, no seguridad real: no pongas ahí nada confidencial de verdad.

Para cambiar el plan o el PIN, edita el HTML del plan (fuera del repo) y vuelve a cifrar:

```bash
PIN=123456 node tools/encrypt-plan.mjs ruta/plan-contenido.html
```

## Regenerar el PDF del folleto y la imagen para redes

Con la carpeta servida (`python3 -m http.server 8765`), ejecuta `node tools/render.js`: genera `assets/folleto-empanadas-del-eje.pdf` y `assets/og-image.jpg`.

No abras los HTML con `file://`: los íconos (sprite `assets/icons.svg`) no cargan. Usa siempre un servidor local o GitHub Pages.
