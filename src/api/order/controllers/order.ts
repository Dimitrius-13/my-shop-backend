import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::order.order', ({ strapi }) => ({
  async create(ctx) {
    console.log('====================================');
    console.log('📥 КОНТРОЛЕР ORDER ВИКЛИКАНО');
    console.log('Вхідні дані з фронта:', JSON.stringify(ctx.request.body));
    console.log('====================================');

    // Кастимо body до any, щоб TS не сварився на поля
    const requestBody = ctx.request.body as any;
    const { clientName, clientPhone, total, orderDetails, deliveryAddress } = requestBody.data || {};

    // 1. Запис в базу
    const response = await super.create(ctx);

    // 2. Блок Telegram
    try {
      const botToken = process.env.TG_BOT_TOKEN || 'ТВІЙ_ТОКЕН_ТУТ';
      const chatId = process.env.TG_CHAT_ID || 'ТВІЙ_CHAT_ID_ТУТ';

      if (!botToken || botToken.includes('ТВІЙ_ТОКЕН')) {
        console.log('⚠️ ТГ-токени не прописані в коді або в .env');
        return response;
      }

      const message = `🔥 <b>НОВЕ ЗАМОВЛЕННЯ!</b>\n\n` +
                      `👤 <b>Клієнт:</b> ${clientName || 'Не вказано'}\n` +
                      `📞 <b>Телефон:</b> ${clientPhone || 'Не вказано'}\n` +
                      `💰 <b>Сума:</b> ${total || 0} ₴\n\n` +
                      `📍 <b>Доставка:</b>\n${deliveryAddress || 'Не вказано'}\n\n` +
                      `📦 <b>Товари:</b>\n${orderDetails || 'Не вказано'}`;

      console.log('🚀 Пробую відправити запит в Telegram API...');
      
      const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML'
        })
      });

      // TS Fix: Явний каст до any + використання нативного tgRes.ok
      const tgData = await tgRes.json() as any;
      
      if (tgRes.ok) {
        console.log('✅ Telegram API повернув успіх:', tgData);
      } else {
        console.error('❌ Telegram API відхилив запит:', tgData);
      }

    } catch (tgError: any) {
      console.error('💥 КРИТИЧНА ПОМИЛКА В БЛОЦІ ТГ:', tgError.message);
    }

    // 3. Віддаємо респонс фронту
    return response;
  }
}));
