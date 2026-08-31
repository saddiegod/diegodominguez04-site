# diegodominguez04.com

Sitio estático de Diego Domínguez. HTML + `css/site.css` + `js/site.js`. Sin build. El sitio es el manuscrito *365 DÍAS, 365 POEMAS* en el navegador: definición Absurdo, 179/365, La huida, glosario `dd.`

## Rutas

- `/` definición Absurdo + 179/365
- `/365/` y `/libro/` aparato del manuscrito (en proceso)
- `/la-huida/` crónica · Poema 131-140
- `/glosario/` entradas `dd.`
- `/tienda/` Cómo veo la vida se vende; 365 waitlist
- `/bitacora/` ensayos
- `/conoceme/` voz del Prefacio

## Vista previa local

```bash
python3 -m http.server 4173
```

Abre http://localhost:4173

## Publicar en Netlify

Arrastra esta carpeta al deploy drop (publish directory = raíz). Pretty URLs, `_redirects` y `404.html` van en la raíz. `/blog` redirige a `/bitacora`.
