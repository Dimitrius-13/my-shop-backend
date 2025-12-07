// config/middlewares.ts
export default [
<<<<<<< HEAD
  "strapi::errors",
  {
    // Налаштування безпеки
    name: "strapi::security",
=======
  'strapi::errors',
  {
    // Налаштування безпеки
    name: 'strapi::security',
>>>>>>> 4e2e856332b0bd98a159ea27fdf38e6b6deb8785
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
<<<<<<< HEAD
          "connect-src": ["'self'", "https:"],
          "img-src": [
            "'self'",
            "data:",
            "blob:",
            "dl.airtable.com",
            "res.cloudinary.com",
            "megastore-tech.pp.ua",
            "*.vercel-dns.com",
          ],
          "media-src": [
            "'self'",
            "data:",
            "blob:",
            "dl.airtable.com",
            "res.cloudinary.com",
=======
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
>>>>>>> 4e2e856332b0bd98a159ea27fdf38e6b6deb8785
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    // Fix CORS (Дозволяємо фронтенд)
<<<<<<< HEAD
    name: "strapi::cors",
    config: {
      enabled: true,
      headers: "*",
      origin: [
        "http://localhost:3000",
        "https://megastore-tech.pp.ua",
        "https://www.megastore-tech.pp.ua",
        "https://megastore-tech-pp-ua.onrender.com", // Замініть на свій реальний домен Render
      ],
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"],
      keepHeaderOnError: true,
    },
  },
  "strapi::poweredBy",
  "strapi::logger",
  "strapi::query",
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
  {
    // Fix Payload Limit (Заміна для 'strapi::body' middleware)
    name: "strapi::body",
    config: {
      jsonLimit: "25mb",
      formLimit: "25mb",
      textLimit: "25mb",
=======
    name: 'strapi::cors',
    config: {
      enabled: true,
      headers: '*',
      origin: [
        'http://localhost:3000',
        'https://megastore-tech.pp.ua',
        'https://www.megastore-tech.pp.ua',
        'https://megastore-tech-pp-ua.onrender.com', // Замініть на свій реальний домен Render
      ],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
      keepHeaderOnError: true,
    },
  },
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
  {
    // Fix Payload Limit (Заміна для 'strapi::body' middleware)
    name: 'strapi::body',
    config: {
      jsonLimit: '25mb',
      formLimit: '25mb',
      textLimit: '25mb',
>>>>>>> 4e2e856332b0bd98a159ea27fdf38e6b6deb8785
      formidable: {
        maxFileSize: 25 * 1024 * 1024,
      },
    },
  },
];
