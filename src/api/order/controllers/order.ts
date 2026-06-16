'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::order.order', ({ strapi }) => ({
  async create(ctx) {
    // 1. Викликаємо дефолтний метод Strapi, щоб замовлення записалось у БД
    const response = await super.create(ctx);

    // 2. Витягуємо збережені дані
    const attrs = response.data.attributes;

    // 3. Відправляємо в ТГ асинхронно, щоб не гальмувати відповідь фронтенду
    setImmediate(async () => {
      try {
        const message = `🔥 <b>НОВЕ ЗАМОВЛЕННЯ!</b>\n\n` +
                        `👤 <b>Клієнт:</b> ${attrs.clientName}\n` +
                        `📞 <b>Телефон:</b> ${attrs.clientPhone}\n` +
                        `💰 <b>Сума:</b> ${attrs.total} ₴\n\n` +
                        `📍 <b>Доставка:</b>\n${attrs.deliveryAddress || 'Не вказано'}\n\n` +
                        `📦 <b>Товари:</b>\n${attrs.orderDetails}`;

        // Вписуй свої токени сюди
        const botToken = process.env.TG_BOT_TOKEN || 'ТВІЙ_ТОКЕН';
        const chatId = process.env.TG_CHAT_ID || 'ТВІЙ_ID';

        if (!botToken || botToken.includes('ТВІЙ_ТОКЕН')) return;

        // Нода 20та, юзаємо нативний fetch, ніяких додаткових імпортів
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'HTML'
          })
        });
        
        console.log('✅ ТГ-сповіщення відправлено з контролера');
      } catch (error) {
        console.error('❌ Помилка ТГ:', error);
      }
    });

    // 4. Віддаємо фронтенду 200 OK
    return response;
  }
}));
