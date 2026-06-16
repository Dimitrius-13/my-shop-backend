'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::order.order', ({ strapi }) => ({
  async create(ctx) {
    console.log('====================================');
    console.log('📥 КОНТРОЛЕР ORDER ВИКЛИКАНО');
    console.log('Вхідні дані з фронта:', JSON.stringify(ctx.request.body));
    console.log('====================================');

    // Забираємо дані прямо з реквесту, так 100% надійно для будь-якої версії Strapi
    const { clientName, clientPhone, total, orderDetails, deliveryAddress } = ctx.request.body.data || {};

    // 1. Спочатку залізобетонно пишемо в базу
    const response = await super.create(ctx);

    // 2. Робимо прямий синхронний запит до ТГ без фонових таймаутів (для дебагу)
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

      const tgData = await tgRes.json();
      
      if (tgData.ok) {
        console.log('✅ Telegram API повернув успіх:', tgData);
      } else {
        console.error('❌ Telegram API відхилив запит:', tgData);
      }

    } catch (tgError) {
      console.error('💥 КРИТИЧНА ПОМИЛКА В БЛОЦІ ТГ:', tgError.message);
    }

    // 3. Повертаємо відповідь фронту
    return response;
  }
}));
