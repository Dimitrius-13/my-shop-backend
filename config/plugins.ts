export default () => ({
  upload: {
    config: {
      provider: "cloudinary",
      providerOptions: {
        cloud_name: "dtmb3momt",
        api_key: "361327885255856",
        api_secret: "CmyfslUABHXtVjzx1nzF_1IBkTw",
      },
      actionOptions: {
        upload: {},
        delete: {},
      },
      // Вимикаємо локальний ресайз, щоб не падав Render по пам'яті
      responsiveDimensions: false,
      skipResponsiveDimensions: true,
    },
  },
});
