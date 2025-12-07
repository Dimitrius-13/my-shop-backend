// config/middlewares.js
 
module.exports = [
  'strapi::errors',
  {
    // Налаштування безпеки
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          // Додаємо Cloudinary та домен Vercel до дозволених
          'img-src': [
            "'self'",
            'data:',
            'blob:',
            'dl.airtable.com',
            'res.cloudinary.com', // Дозволяємо зображення з Cloudinary
            'megastore-tech.pp.ua', // Дозволяємо ваш фронтенд
            '*.vercel-dns.com' // Дозволяємо vercel
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            'dl.airtable.com',
            'res.cloudinary.com', // Дозволяємо медіа з Cloudinary
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
  'strapi::body', // Стандартний обробник тіла
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
  // --- НАЙВАЖЛИВІША ЧАСТИНА: ЗБІЛЬШЕННЯ ЛІМІТУ ---
  {
    name: 'strapi::body',
    config: {
      // Збільшуємо ліміт тіла запиту до 25 МБ (стандарт 8 МБ)
      jsonLimit: '25mb',
      formLimit: '25mb',
      textLimit: '25mb',
      formidable: {
        maxFileSize: 25 * 1024 * 1024, // Максимальний розмір файлу (25 МБ)
      },
    },
  },
];
