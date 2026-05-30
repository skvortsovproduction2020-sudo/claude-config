# Handoff — TaskFlow

*Обновлено: 2026-05-28*

## 🔒 СТАТУС: ЗАМОРОЖЕН

Проект заморожен 2026-05-28. Планируется объединение с studio-cabinet в будущем.
Ключи ротированы и хранятся в `~/.claude/secrets/taskflow.env` — Render не обновлялся (не нужно).
При возобновлении: обновить env vars на Render (бот + MCP) и пополнить Anthropic баланс ($0.28 осталось).

## 🎯 ЦЕЛЬ ПРОЕКТА
Система автоматизации задач: TG Bot собирает задачи из чатов → Web App планирует и отправляет в Claude Code → MCP Server уведомляет и получает отчёты → бот присылает результат в Telegram.

---

## 📍 ТЕКУЩЕЕ СОСТОЯНИЕ

| Этап | Статус | Детали |
|---|---|---|
| 1. База данных Supabase | ✅ ГОТОВО | 7 таблиц (+ sources), RLS, Realtime |
| 2. MCP Server | ✅ ГОТОВО, РАБОТАЕТ | Render `https://taskflow-mcp-1a0n.onrender.com` |
| 3. Telegram Bot | ✅ ГОТОВО, РАБОТАЕТ | Source чат подключён, фильтр 20:00 МСК |
| 4. Web App | ✅ ЗАДЕПЛОЕН | `https://taskflow-web-gbke.onrender.com` + PWA (iPhone) |
| 5. Финал / E2E | ⏳ НЕ ПРОВЕРЕН | Ждёт первого сообщения в группе |

---

## ✅ ПОСЛЕДНЯЯ СЕССИЯ (2026-05-28)

### Сделано:
1. **Web App** создан (Next.js 14, Old Money Forest Green)
   - TaskList с табами: Все / Очередь / В работе / Готово / Блок
   - TaskCard с кнопкой «→ Claude» (отправляет в MCP)
   - API: `GET /api/tasks`, `POST /api/tasks/send`
2. **PWA** — можно добавить на главный экран iPhone (Safari → Поделиться → На экран Домой)
3. **Таблица `sources`** создана в Supabase (бот читает source-чаты из неё)
4. **Webhook исправлен** — Web App теперь правильно шлёт `POST /webhook/tasks-assigned` с `{secret, project, task_ids}`
5. **Фильтр времени** в боте:
   - Накопленные сообщения: берёт только >= 20:00 МСК
   - Живые (новые) сообщения: берёт всегда
6. **Source чат подключён** — «Проект CRM для Храма», Chat ID `-1003950524096`
   - PROJECT = `CRM Храм`, CATEGORY = `Задачи`
7. **Команда /chatid** добавлена в бота — отвечает ID текущего чата

### Что не сработало:
- @RawDataBot не давал chat ID группы — пришлось добавить /chatid в самого бота
- Render PUT env-vars заменяет ВСЕ переменные — нужно всегда передавать полный список

---

## ➡️ СЛЕДУЮЩИЙ ШАГ

### 1. E2E тест (первоочередно):
- Написать сообщение с задачей в **«Проект CRM для Храма»** после 20:00 МСК
- Бот должен: поставить 👀 → обработать Claude → поставить 📋
- Задача появляется на `https://taskflow-web-gbke.onrender.com`
- Нажать «→ Claude» → задача уходит в MCP → статус меняется

### 2. Добавить второй source чат (по желанию):
```
SOURCE_2_CHAT_ID = <ID чата>
SOURCE_2_PROJECT = <название>
SOURCE_2_CATEGORY = <категория>
```
Добавить через Render API (PUT с полным списком всех env vars)

---

## 🔑 КЛЮЧИ И СЕРВИСЫ

⚠️ Ключи в безопасном хранилище: `C:\Users\89117\.claude\secrets\taskflow.env`

| Сервис | ID / URL |
|--------|---------|
| Supabase | `wyobazafngizikxxujjg` |
| Telegram Bot | `@skvortsovasist_Bot`, Render `srv-d8bbund7vvec73elq6g0` |
| MCP Server | `https://taskflow-mcp-1a0n.onrender.com`, `srv-d8bb9619rddc738fgks0` |
| Web App | `https://taskflow-web-gbke.onrender.com`, `srv-d8c70g6gvqtc73eaggm0` |
| GitHub (web) | `skvortsovproduction2020-sudo/taskflow-web` |
| GitHub (bot) | `skvortsovproduction2020-sudo/taskflow-bot` |

## 📁 Локальный код
- MCP: `C:\Users\89117\taskflow\mcp`
- Bot: `C:\Users\89117\taskflow\bot`
- Web: `C:\Users\89117\taskflow\web`

## 🗄 Supabase — 7 таблиц
tasks, projects, users, messages, webhooks, logs, **sources**

## 🤖 Env vars бота на Render (полный список — всегда передавать все!)
```
PYTHON_VERSION=3.11.0
BOT_TOKEN=***
ADMIN_TELEGRAM_ID=498108685
ANTHROPIC_API_KEY=***
OPENAI_API_KEY=placeholder
SUPABASE_URL=***
SUPABASE_SERVICE_KEY=***
SOURCE_1_CHAT_ID=-1003950524096
SOURCE_1_PROJECT=CRM Храм
SOURCE_1_CATEGORY=Задачи
TIME_FILTER_START_HOUR=20
```

## 🐛 Антипаттерны
- **НЕ** создавать Render-сервис как `web_service` для polling-бота — добавлять aiohttp health server
- **НЕ** использовать `python3` в bash на Windows — PowerShell или bash
- **НЕ** путать URL: бот `taskflow-bot-ja9d`, MCP `taskflow-mcp-1a0n`, web `taskflow-web-gbke`
- **НЕ** забывать `serviceDetails.envSpecificDetails` при создании Render-сервиса через API
- **НЕ** делать PUT env-vars с неполным списком — Render удалит остальные
- **НЕ** писать ключи в .env.local вручную — использовать `setup-env.ps1`
