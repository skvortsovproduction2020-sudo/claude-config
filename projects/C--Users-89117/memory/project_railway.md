---
name: project-railway-bot
description: "Телеграм бот studio-cabinet задеплоен на Railway — проект caring-endurance, сервис studio-cabinet"
metadata: 
  node_type: memory
  type: project
  originSessionId: f4110cfa-f065-4673-83c5-acbc565ab6c1
---

Оба бота (`bot.js` и `agent-bot.js`) должны работать на Railway — НЕ на локальном компьютере НИКОГДА.

- Проект на Railway: **caring-endurance**
- Сервис: **studio-cabinet** (id: bc37c8e3-13cd-42e0-b931-4a468ac3100b)
- Workspace: skvortsovproduction2020-sudo's Projects (id: 2f8097b3-3091-451c-821c-7376d6ed1c38)
- Railway API токен (claude): `879f0755-7a4f-4c00-9299-a6db2d47c4da`
- Запуск обоих ботов: `CMD ["node", "start.js"]` в Dockerfile
- Автодеплой при `git push` в `main` — НО webhook иногда не срабатывает, тогда нужен ручной редеплой через API

**КРИТИЧЕСКОЕ ПРАВИЛО:** НИКОГДА не запускать ботов локально (`node bot.js`, `node start.js`, `node agent-bot.js`). Даже для теста. Даже временно. Пользователь уже исправлял эту ошибку несколько раз.

**Ручной редеплой через Railway API:**
```
curl -X POST https://backboard.railway.app/graphql/v2 \
  -H "Authorization: Bearer 879f0755-7a4f-4c00-9299-a6db2d47c4da" \
  -H "Content-Type: application/json" \
  --data-binary '{"query":"mutation { deploymentRedeploy(id: \"<deployment_id>\") { id status } }"}'
```
Последний известный deployment id: `bab124b6-fa7f-4e94-b171-8b11e2e03088` (запущен 15.05.2026)

**Why:** Бот должен работать 24/7 даже когда компьютер выключен. Локальный запуск = бот умрёт при закрытии ноутбука. Это приводило к путанице и двойным инстансам (409 Conflict).

**How to apply:** Если бот не работает → редеплой на Railway. Если Railway не подхватывает коммиты → ручной редеплой через API. НИКОГДА не предлагать запуск локально.
