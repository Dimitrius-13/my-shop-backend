// config/plugins.js
module.exports = ({ env }) => ({
  upload: {
    config: {
      // --- ЦЕЙ БЛОК ПРИБИРАЄ ПОПЕРЕДЖЕННЯ ---
      security: {
        // Дозволяємо тільки безпечні типи зображень
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        maxFileSize: 5 * 1024 * 1024, // Обмеження розміру 5MB
      },
      // --------------------------------------
      
      provider: 'cloudinary',
      providerOptions: {
        cloud_name: env('CLOUDINARY_NAME'),
        api_key: env('CLOUDINARY_KEY'),
        api_secret: env('CLOUDINARY_SECRET'),
      },
      actionOptions: {
        upload: {},
        delete: {},
      },
    },
  },
});
