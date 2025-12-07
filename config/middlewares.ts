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
  {
    // --- ВИПРАВЛЕНИЙ БЛОК CORS (Critical Fix) ---
    name: 'strapi::cors',
    config: {
      enabled: true,
      headers: '*',
      origin: [
        'http://localhost:3000', // Для локальної розробки
        'https://megastore-tech.pp.ua', // Ваш основний домен Vercel
        'https://www.megastore-tech.pp.ua', // Ваш домен з WWW
        'https://megastore-tech.vercel.app', // Якщо ви використовуєте домен Vercel
        'https://megastore-tech-pp-ua.onrender.com', // Ваш бекенд Render
        // Можливо, потрібно додати ваш домен Render для адмінки, якщо він інший
      ],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
      keepHeaderOnError: true,
    },
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
