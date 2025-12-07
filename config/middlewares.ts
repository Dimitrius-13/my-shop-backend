export default [
  "strapi::errors",
  {
    // Налаштування безпеки
    name: "strapi::security",
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
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
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    // Fix CORS (Дозволяємо фронтенд)
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
      formidable: {
        maxFileSize: 25 * 1024 * 1024,
      },
    },
  },
];
