export default {
  routes: [
    {
      method: 'POST',
      path: '/orders/telegram-webhook',
      handler: 'order.webhook',
      config: {
        auth: false, // Відключаємо авторизацію, щоб ТГ міг достукатися
      },
    },
  ],
};
