/* SEVOR Data — configuración del sitio. Es el ÚNICO archivo que hay que editar para enlaces y códigos.
   - Deja un valor en "" para ocultarlo: una red social vacía, una invitación de Slack vacía
     o un código de Minute vacío no se muestran (el código vacío muestra «Próximamente»).
   - Los enlaces deben empezar con https:// (si no, se ignoran por seguridad).
   - Después de editar, sube el número ?v= de los <script> en los HTML (busca "?v=2026")
     para que los navegadores descarguen la versión nueva.
   - Si cambias BASE_URL (sin barra final), ejecuta también ./set-base-url.sh para actualizar
     sitemap.xml, robots.txt y las etiquetas <head> (son HTML estático para SEO). */
window.SEVOR_CONFIG = {
  BASE_URL: "https://sevor-data.dev.ar",
  EMAIL: "contacto.sevor@gmail.com",
  // Endpoint de FormSubmit. Tras la activación única puedes reemplazar el email
  // por el alias aleatorio que entrega FormSubmit, para ocultar la dirección.
  FORM_ENDPOINT: "https://formsubmit.co/contacto.sevor@gmail.com",
  DEFAULT_LANG: "es",
  LANGS: ["es", "en", "pt", "it", "fr", "de"],

  // Redes sociales: pega la URL completa del perfil (https://...). Vacío = ícono oculto.
  // El bloque «Síguenos» aparece solo cuando hay al menos un enlace cargado.
  social: {
    instagram: "",  // ej. "https://www.instagram.com/sevordata"
    tiktok: "",     // ej. "https://www.tiktok.com/@sevordata"
    youtube: "",    // ej. "https://www.youtube.com/@sevordata"
    x: "",          // ej. "https://x.com/sevordata"
    linkedin: "",   // ej. "https://www.linkedin.com/company/sevordata"
    facebook: "",   // ej. "https://www.facebook.com/sevordata"
    threads: "",    // ej. "https://www.threads.net/@sevordata"
    whatsapp: "",   // ej. "https://whatsapp.com/channel/..." (canal público, nunca un número personal)
    telegram: ""    // ej. "https://t.me/sevordata"
  },

  // Enlace de invitación al Slack (https://join.slack.com/t/...). Vacío = botón oculto.
  slack_invite_url: "https://join.slack.com/t/sevordata/shared_invite/zt-4g931fpol-ku5nuPkSy9ipBK6WKgmwig",

  // Código de organización de Minute (ej. "ABCD1234"). Vacío = se muestra «Próximamente».
  minute_org_code: "mwq3rf",

  // Páginas oficiales de las tiendas (Minute Data de Baker Data LLC, y Slack).
  apps: {
    minute_ios: "https://apps.apple.com/us/app/minute-data/id6760918280",
    minute_android: "https://play.google.com/store/apps/details?id=com.bakerdata.minute",
    slack_ios: "https://apps.apple.com/app/slack/id618783545",
    slack_android: "https://play.google.com/store/apps/details?id=com.Slack",
    slack_desktop: "https://slack.com/downloads"
  }
};
