import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::order.order', ({ strapi }) => ({
  async create(ctx) {
    const requestBody = ctx.request.body as any;
    const { clientName, clientPhone, total, orderDetails, deliveryAddress } = requestBody.data || {};

    const response = await super.create(ctx);

    try {
      const botToken = process.env.TG_BOT_TOKEN || 'ТВІЙ_ТОКЕН_ТУТ';
      const chatId = process.env.TG_CHAT_ID || 'ТВІЙ_CHAT_ID_ТУТ';

      if (!botToken || botToken.includes('ТВІЙ_ТОКЕН')) return response;

      // Додали рядок про статус (беремо дефолтний, бо це створення)
      const message = `🔥 <b>НОВЕ ЗАМОВЛЕННЯ!</b>\n\n` +
                      `📝 <b>Статус:</b> Нове\n` +
                      `👤 <b>Клієнт:</b> ${clientName || 'Не вказано'}\n` +
                      `📞 <b>Телефон:</b> ${clientPhone || 'Не вказано'}\n` +
                      `💰 <b>Сума:</b> ${total || 0} ₴\n\n` +
                      `📍 <b>Доставка:</b>\n${deliveryAddress || 'Не вказано'}\n\n` +
                      `📦 <b>Товари:</b>\n${orderDetails || 'Не вказано'}`;

      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'HTML' })
      });
    } catch (tgError: any) {
      console.error('💥 Помилка ТГ:', tgError.message);
    }

    return response;
  }
}));
