# SEVOR Data: sitio web estático

Sitio de SEVOR Data (Argentina): video en primera persona (POV) de tareas cotidianas grabado con el celular en una vincha, y evaluación de video e imágenes generados por IA. Publicado en https://sevor-data.dev.ar (GitHub Pages con dominio propio, archivo `CNAME`).

HTML, CSS y JS sin compilación, sin servidor y sin CDNs externos (la fuente Geist está alojada en el sitio). Todas las rutas internas son relativas, así que el sitio también funciona en una subcarpeta (por ejemplo `https://sevordataos.github.io/SevorDataWeb/`).

## Estructura
```
index.html            Inicio: hero, tareas de ejemplo, 01 Proyectos, 02 Cómo funciona, 03 Empezar (solicitud por email, consentimiento Contracted AI, diadema, Minute Data y Slack), 04 Condiciones, 05 Requisitos,
                      06 Preguntas, 07 Guías, 08 Registro, 09 Empresas, Comunidad (Slack + redes)
registro.html         Redirige al nuevo proceso de incorporación en index.html#empezar
gracias.html          Página de agradecimiento (FormSubmit redirige aquí)
para-empresas.html    Página para empresas
guias/                Guías (español)
legal/                Términos, privacidad (Ley 25.326), cookies, aviso legal
404.html              Página «no encontrada» autónoma
entrevista.html       URL vieja: redirige a registro.html
assets/js/config.js   ← Configuración del sitio: email, redes sociales, Slack y enlaces de tiendas
assets/js/i18n.js     Traducciones (es por defecto, en, pt, it, fr, de)
assets/js/main.js     Idiomas, barra flotante, tema claro/oscuro, menú móvil, enlaces y lista «Antes de grabar»
assets/js/registro.js Formulario: validación (dígito verificador del CUIT, celulares admitidos), compresión de imágenes, FormSubmit
assets/css/style.css  Sistema base; assets/css/sevor.css identidad visual v3 (se carga después)
assets/fonts/         Geist (SIL OFL 1.1, ver OFL.txt)
assets/img/           Fotos WebP + JPEG responsivas; logos oficiales de tiendas, Slack y Minute
```

## Incorporación de colaboradores
La página principal guía al candidato en cuatro pasos: solicitud por email con datos de contacto, consentimiento Contracted AI, compra del soporte de cabeza y, tras la aprobación, entrega de credenciales e instalación de Minute Data y Slack. La página `registro.html` redirige a `index.html#empezar`.

La sección de compatibilidad muestra las familias de teléfonos aceptadas y las variantes excluidas indicadas para el proyecto. La aceptación final del modelo debe confirmarse con Minute Data.

## Editar assets/js/config.js
- `social.instagram`, `tiktok`, `youtube`, `x`, `linkedin`, `facebook`, `threads`, `whatsapp`, `telegram`: URL completa con `https://`. Vacío = ícono oculto. El bloque «Síguenos» del pie y los íconos del bloque Comunidad aparecen solo si hay al menos uno cargado.
- `slack_invite_url`: enlace de invitación (`https://join.slack.com/t/...`). Vacío = botón oculto y aviso de que se envía al aprobar el registro.
- Después de editar, subir el `?v=` de las etiquetas `<script>`/`<link>` (buscar `?v=2026`).

## Tema claro / oscuro
Oscuro por defecto. El botón redondo de la barra cambia el tema; se recuerda solo si la persona acepta «Preferencias» en el aviso de cookies (igual que el idioma).

## Registro
El formulario envía los datos y tres imágenes (DNI frente, DNI dorso y selfie con el DNI) a `contacto.sevor@gmail.com` por FormSubmit. El único paso legal es el consentimiento de tratamiento de datos (Ley 25.326). El primer envío dispara el email de activación única de FormSubmit.

## Marcas de terceros
Ver `TERCEROS.md`. SEVOR Data no está afiliada a Minute (Baker Data LLC), Slack ni a las redes sociales enlazadas.
