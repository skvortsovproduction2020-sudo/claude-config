---
name: project_max_bot
description: Max бот для khram-spas — полностью реализован и работает, важные детали API и ID
metadata: 
  node_type: memory
  type: project
  originSessionId: ee92227b-9202-4ba1-8ead-1535982a080e
---

## Задача: Бот для мессенджера Max (khram-spas)

**Статус:** ✅ полностью реализовано и работает (25.05.2026)

**Цель:** добавить Max (мессенджер VK) как альтернативный канал уведомлений рядом с Telegram.

## Критически важные детали Max Bot API (botapi.max.ru)

**Правильные форматы запросов (подтверждено тестами):**
- `sendMessage`:    `POST /messages?chat_id={id}`     body: `{"text":"..."}`
- `sendWithBtns`:   `POST /messages?chat_id={id}`     body: `{"text":"...", "attachments":[...]}`
- `answerCallback`: `POST /answers?callback_id={id}`  body: `{"notification":"..."}`
- `editMessage`:    `PUT  /messages?message_id={id}`  body: `{"text":"..."}`

**Главный антипаттерн:** НЕ класть `recipient` в тело запроса — это вызывает "Can't deserialize body". `chat_id` нужен только как query-параметр.

**Recipient type:** всегда использовать `chat_id` (dialog chat_id из `msg.recipient.chat_id`), НЕ `user_id`.

**Авторизация:** `Authorization: TOKEN` (без "Bearer" и без "Bot ").

## Ключевые ID

- Bot user_id: 281843534
- Bot username: id7813204684_bot  
- Александр user_id: 29122500
- Александр dialog chat_id: 292604042

## Связанные файлы

- `lib/max.ts` — обёртка Max Bot API (query-param формат)
- `lib/notify.ts` — двухканальные уведомления (Telegram + Max)
- `app/api/max/webhook/route.ts` — вебхук
- `instrumentation.ts` — авторегистрация вебхука при старте

## Связанные проекты

- [[project_railway]] — деплой в Railway
