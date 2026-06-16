import { factories } from '@strapi/strapi';

const buildMessage = (attrs: any) => {
  return `🔥 <b>ЗАМОВЛЕННЯ #${attrs.id || ''}</b>\n\n` +
         `📝 <b>Статус:</b> ${attrs.status || 'Нове'}\n` +
         `👤 <b>Клієнт:</b> ${attrs.clientName || 'Не вказано'}\n` +
         `📞 <b>Телефон:</b> ${attrs.clientPhone || 'Не вказано'}\n` +
         `💰 <b>Сума:</b> ${attrs.total || 0} ₴\n\n` +
         `📍 <b>Доставка:</b>\n${attrs.deliveryAddress || 'Не вказано'}\n\n` +
         `📦 <b>Товари:</b>\n${attrs.orderDetails || 'Не вказано'}`;
};

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
  async create(ctx) {
    // 1. Створюємо
    const response = await super.create(ctx);
    
    // 2. Дозапитуємо повний об'єкт з бази, щоб отримати статус, присвоєний Strapi
    const orderId = response.data.id;
    const fullOrder = await strapi.entityService.findOne('api::order.order', orderId);
    
    // 3. Формуємо об'єкт для бота з актуальним станом
    const attrs = { 
      ...response.data.attributes, 
      id: orderId,
      status: fullOrder.status // Беремо точно з БД
    };

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

  async webhook(ctx) {
    const body = ctx.request.body as any;

    if (body.callback_query) {
      const { id: queryId, data, message } = body.callback_query;
      const chatId = message.chat.id;
      const messageId = message.message_id;

      if (data && data.startsWith('status_')) {
        const parts = data.split('_');
        const newStatus = parts[1];
        const orderId = Number(parts[2]); 

        console.log(`🔄 ТГ Вебхук: спроба змінити статус ордера #${orderId} на "${newStatus}"`);

        try {
          const updatedOrder = await strapi.entityService.update('api::order.order', orderId, {
            data: { status: newStatus } as any
          });

          // ФІКС ТИПІЗАЦІЇ ДЛЯ КОНСОЛІ
          console.log(`💾 Статус в базі успішно змінено на:`, (updatedOrder as any).status);

          const botToken = process.env.TG_BOT_TOKEN;

          await fetch(`https://api.telegram.org/bot${botToken}/answerCallbackQuery`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ callback_query_id: queryId, text: `✅ Статус змінено на: ${newStatus}` })
          });

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
        } catch (e: any) {
          console.error('❌ Помилка апдейту статусу в БД:', e.message);
          return ctx.send({ error: 'Помилка оновлення' }, 500);
        }
      }
    }
    return ctx.send({ ok: true });
  }
}));
