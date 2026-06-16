'use strict';

module.exports = {
  async afterCreate(event) {
    // result - це об'єкт щойно створеного запису в базі
    const { result } = event;
    const { clientName, clientPhone, total, orderDetails, deliveryAddress } = result;

    // Формуємо красиве повідомлення з HTML тегами для жирного шрифту
    const message = `🔥 <b>НОВЕ ЗАМОВЛЕННЯ!</b>\n\n` +
                    `👤 <b>Клієнт:</b> ${clientName}\n` +
                    `📞 <b>Телефон:</b> ${clientPhone}\n` +
                    `💰 <b>Сума:</b> ${total} ₴\n\n` +
                    `📍 <b>Доставка:</b>\n${deliveryAddress || 'Не вказано'}\n\n` +
                    `📦 <b>Товари:</b>\n${orderDetails}`;

    const botToken = process.env.TG_BOT_TOKEN || 'ТВІЙ_ТОКЕН_ВІД_BOTFATHER';
    const chatId = process.env.TG_CHAT_ID || 'ТВІЙ_ID_КОРИСТУВАЧА';

    if (!botToken || !chatId || botToken.includes('ТВІЙ_ТОКЕН')) {
      console.log('Телеграм токени не налаштовані. Пропускаю відправку.');
      return;
    }

    try {
      // Використовуємо нативний fetch (доступний в Node.js 18+)
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML'
        })
      });
      console.log('✅ Сповіщення успішно відправлено в Telegram');
    } catch (error) {
      console.error('❌ Помилка відправки в Telegram:', error);
    }
  }
};
