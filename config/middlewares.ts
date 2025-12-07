// config/middlewares.js
module.exports = [
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': [
            "'self'",
            'data:',
            'blob:',
            'dl.airtable.com',
            'res.cloudinary.com',
            'megastore-tech.pp.ua',
            '*.vercel-dns.com'
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            'dl.airtable.com',
            'res.cloudinary.com',
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  // --- ТУТ БУВ ДУБЛІКАТ 'strapi::body', МИ ЙОГО ВИДАЛИЛИ ---
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
  // --- ЗАЛИШАЄМО ЛИШЕ ЦЕЙ БЛОК З НАЛАШТУВАННЯМИ ЛІМІТУ ---
  {
    name: 'strapi::body',
    config: {
      jsonLimit: '25mb',
      formLimit: '25mb',
      textLimit: '25mb',
      formidable: {
        maxFileSize: 25 * 1024 * 1024,
      },
    },
  },
];
