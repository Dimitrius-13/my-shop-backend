// config/plugins.js
module.exports = ({ env }) => ({
  upload: {
    config: {
      // --- БЛОК, ЩО ПРИБИРАЄ ПОПЕРЕДЖЕННЯ ---
      security: {
        // Дозволяємо тільки безпечні типи зображень
<<<<<<< HEAD
        allowedMimeTypes: [
          "image/jpeg",
          "image/png",
          "image/gif",
          "image/webp",
        ],
        maxFileSize: 5 * 1024 * 1024, // Обмеження розміру 5MB
      },
      // --------------------------------------

      provider: "cloudinary",
=======
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        maxFileSize: 5 * 1024 * 1024, // Обмеження розміру 5MB
      },
      // --------------------------------------
      
      provider: 'cloudinary',
>>>>>>> 4e2e856332b0bd98a159ea27fdf38e6b6deb8785
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
