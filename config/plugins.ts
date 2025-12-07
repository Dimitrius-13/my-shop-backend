// config/plugins.js
module.exports = ({ env }) => ({
  // Налаштування стандартного плагіна Upload
  upload: {
    config: {
      // Вказуємо, що використовуємо Cloudinary
      provider: "cloudinary",
      providerOptions: {
        cloud_name: env("CLOUDINARY_NAME"),
        api_key: env("CLOUDINARY_KEY"),
        api_secret: env("CLOUDINARY_SECRET"),
      },
      actionOptions: {
        upload: {},
        delete: {},
      },
    },
  },
});
