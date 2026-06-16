'use strict';

module.exports = {
  register(/*{ strapi }*/) {},

  async bootstrap({ strapi }) {
    // Отримуємо доступ до внутрішнього сховища налаштувань плагіна
    const pluginStore = strapi.store({
      environment: '',
      type: 'plugin',
      name: 'users-permissions',
    });

    // Витягуємо поточні Advanced Settings
    const settings = await pluginStore.get({ key: 'advanced' });

    // Якщо підтвердження пошти увімкнено — жорстко вимикаємо його
    if (settings && settings.email_confirmation) {
      settings.email_confirmation = false;
      await pluginStore.set({ key: 'advanced', value: settings });
      console.log('✅ Email confirmation forcibly disabled via bootstrap');
    }
  },
};
