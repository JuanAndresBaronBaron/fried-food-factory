# Fritanga · página web

Sitio estático de Fritanga, fábrica de empanadas artesanales congeladas (Pereira y Dosquebradas).

- `index.html`: la fábrica, las empanadas y el contacto.
- `folleto.html`: folleto tamaño carta (2 páginas). Se imprime desde el navegador o se descarga en `assets/folleto-fritanga.pdf`.
- `plan.html`: plan de acción, protegido con PIN.

## Publicar con GitHub Pages

Settings → Pages → Source: "Deploy from a branch" → rama `main`, carpeta `/ (root)`.

## Plan de acción (PIN)

El contenido del plan no está en el repositorio en texto plano: va cifrado en `assets/plan-data.js`.
Es una protección básica del lado del navegador, no seguridad real: no pongas ahí nada confidencial de verdad.

Para cambiar el plan o el PIN, edita el HTML del plan (fuera del repo) y vuelve a cifrar:

```bash
PIN=123456 node tools/encrypt-plan.mjs ruta/plan-contenido.html
```

## Regenerar el PDF del folleto

Abre `folleto.html` en Chrome → Imprimir → Guardar como PDF (tamaño carta, márgenes ninguno, gráficos de fondo activados) y reemplaza `assets/folleto-fritanga.pdf`.
