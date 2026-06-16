import { factories } from '@strapi/strapi';

// Функція-генератор повідомлення (щоб не дублювати код)
const buildMessage = (attrs: any) => {
  return `🔥 <b>ЗАМОВЛЕННЯ #${attrs.id || ''}</b>\n\n` +
         `📝 <b>Статус:</b> ${attrs.status || 'Нове'}\n` +
         `👤 <b>Клієнт:</b> ${attrs.clientName || 'Не вказано'}\n` +
         `📞 <b>Телефон:</b> ${attrs.clientPhone || 'Не вказано'}\n` +
         `💰 <b>Сума:</b> ${attrs.total || 0} ₴\n\n` +
         `📍 <b>Доставка:</b>\n${attrs.deliveryAddress || 'Не вказано'}\n\n` +
         `📦 <b>Товари:</b>\n${attrs.orderDetails || 'Не вказано'}`;
};

// Генератор клавіатури
const buildKeyboard = (orderId: string | number) => ({
  inline_keyboard: [
    [
      { text: "⏳ В обробку", callback_data: `status_В обробці_${orderId}` },
      { text: "🚚 Відправлено", callback_data: `status_Відправлено_${orderId}` }
    ],
    [
      { text: "✅ Виконано", callback_data: `status_Виконано_${orderId}` }
    ]
  ]
});

export default factories.createCoreController('api::order.order', ({ strapi }) => ({
  // 1. СТВОРЕННЯ ЗАМОВЛЕННЯ
  async create(ctx) {
    const response = await super.create(ctx);
    
    // Додаємо ID до атрибутів для шаблонізатора
    const attrs = { ...response.data.attributes, id: response.data.id };

    try {
      const botToken = process.env.TG_BOT_TOKEN;
      const chatId = process.env.TG_CHAT_ID;

      if (!botToken || botToken.includes('ТВІЙ_ТОКЕН')) return response;

      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: buildMessage(attrs),
          parse_mode: 'HTML',
          reply_markup: buildKeyboard(attrs.id)
        })
      });
    } catch (e) {
      console.error('💥 Помилка відправки ТГ:', e);
    }

    return response;
  },

  // 2. ОБРОБКА КЛІКІВ З ТЕЛЕГРАМУ
  async webhook(ctx) {
    const body = ctx.request.body as any;

    // Перевіряємо, чи це клік по кнопці
    if (body.callback_query) {
      const { id: queryId, data, message } = body.callback_query;
      const chatId = message.chat.id;
      const messageId = message.message_id;

      if (data && data.startsWith('status_')) {
        const parts = data.split('_');
        const newStatus = parts[1];
        const orderId = parts[2];

        try {
          // Оновлюємо статус в БД Strapi (з кастом до any через типи Strapi)
          const updatedOrder = await strapi.entityService.update('api::order.order', orderId, {
            data: { status: newStatus } as any
          });

          const botToken = process.env.TG_BOT_TOKEN;

          // Відповідаємо Телеграму, щоб кнопка перестала "крутитися"
          await fetch(`https://api.telegram.org/bot${botToken}/answerCallbackQuery`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              callback_query_id: queryId,
              text: `✅ Статус змінено на: ${newStatus}`
            })
          });

          // Перемальовуємо сам текст повідомлення
          await fetch(`https://api.telegram.org/bot${botToken}/editMessageText`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              message_id: messageId,
              text: buildMessage(updatedOrder),
              parse_mode: 'HTML',
              reply_markup: buildKeyboard(orderId)
            })
          });

          return ctx.send({ ok: true });
        } catch (e) {
          console.error('Помилка оновлення статусу:', e);
          return ctx.send({ error: 'Помилка оновлення' }, 500);
        }
      }
    }
    
    // Для звичайних повідомлень або якщо щось пішло не так
    return ctx.send({ ok: true });
  }
}));
