# Handoff — Studio Cabinet

## 🎯 ЦЕЛЬ ПРОЕКТА
SaaS для контент-мейкеров: генерация сценариев, транскрипция видео/подкастов, база стиля речи, CRM.  
Фронт — Next.js на Vercel, боты — Railway, БД — Supabase.

## 📍 ТЕКУЩЕЕ СОСТОЯНИЕ
*Обновлено: 2026-06-17 (сессия 5)*

- [x] Генератор постов для TG — `/dashboard/tg-posts` (3 режима, 6 форматов, история, фильтр по проекту)
- [x] Система стилей: TG-генератор использует `style_profile` из project_data (приоритет 1)
- [x] Профиль стиля проекта — `POST /api/style-profile/generate`
- [x] Профиль продюсера — секция "🧠 Мой стиль написания" в `/dashboard/settings/profile`
- [x] Контекст сайта автоматически подаётся в ВСЕ генераторы: TG-посты, сценарии, DM, воронки
- [x] **Раздел переименован: «Сбор данных» → «Анализ данных»** (сайдбар + заголовок)
- [x] Раздел "Анализ данных" — вкладки: Сайт / Instagram / Telegram / Подкасты и выступления / **Поисковые запросы**
- [x] Instagram → подвкладки: Скрапинг Apify / Архив ZIP / **Комментарии** (перенесены из Идей)
- [x] **Поисковые запросы** (бывш. «Запросы Y/G») — отдельная вкладка в Анализе данных
- [x] **Идеи для съёмок** — только доска одобренных идей (без вкладок комментариев и поиска)
- [x] Анализ TG-канала: кнопка "в идеи" — дубли/ошибки/индексы исправлены
- [x] Анализ TG-канала: при загрузке автоскрывает уже-в-идеях и уже-удалённые-крестиком
- [x] Анализ TG-канала: крестик (X) — удаление **персистентное** (не возвращается при обновлении)
- [x] Анализ TG-канала: раздел "Удалённые" внизу каждой вкладки + кнопка "Восстановить"
- [x] Анализ TG-канала: **автооткрытие последнего анализа** при заходе на вкладку
- [x] Голосовые источники: исправлена кнопка "в идеи" (дубли, ошибки, обратная связь)
- [x] Голосовые источники: уже-в-идеях вопросы скрываются при открытии источника (персистентно)
- [x] Голосовые источники: **флажок** — пометить источник как "разобрал, на потом" (уходит вниз, янтарный)
- [x] Контекст-подсказка к вопросу сохраняется как `note` в идее (виден в доске идей)
- [x] Ретроактивное обогащение: при открытии доски идей автоподтягивает контекст к старым podcast-идеям
- [x] `/dashboard/collect` — вкладка сохраняется в URL hash (`#telegram`, `#podcasts` и т.д.)
- [x] **Профиль стиля обновляется автоматически** — после обработки голосового источника или TG-анализа
- [x] **Страница «Профиль клиента»** — `/dashboard/client-profile` (первый пункт в "СОЗДАНИЕ КОНТЕНТА")
- [x] Профиль клиента: манера речи, структура мысли, темы, фразы, боли аудитории, что избегать
- [x] Профиль клиента: дата обновления по МСК, счётчики всех источников
- [x] StyleCard в TG-постах → компактная полоска со ссылкой на профиль клиента
- [x] **Профиль собирает ВСЕ источники без лимитов**: голосовые, TG, видео, сценарии рилсов, боли, сайт, DM-возражения
- [x] Параллельная загрузка источников (Promise.all) — быстрее генерация
- [x] **Настройки: дата последнего бэкапа по МСК** под заголовком секции
- [x] **Бэкап: кнопка POST** (без CRON_SECRET) — больше нет ошибки Unauthorized
- [x] **Бэкап: 15 таблиц** — добавлены invoices, contracts, voice_sources, telegram_analyses, scripts, crm_clients, user_settings; убрана несуществующая ideas_items
- [x] **Кабинет продюсера: «Вложено»** = сумма счетов (invoices.total); «Получено» = — (CRM, TBD); убрана карточка «По договорам»
- [x] **Интеграция amoCRM** — полный цикл: sync → transcribe → analyze → insights в профиле клиента

## 🎭 АРХИТЕКТУРА СТИЛЕЙ (ЗАКОН — не менять!)

```
ПРОФИЛЬ ПРОДЮСЕРА (Александр, один на всё)
  user_settings key='producer_style'
  → analysis.system_prompt_addition → в ВСЕ генераторы (высший приоритет)

СТИЛЬ ПРОЕКТА (per-project, голос клиента)
  project_data key='style_profile'
  → синтезируется из: voice_sources + telegram_analyses + materials + scripts
    + project_pains + website_analysis + dm_dialogs (ai_objections)
  → автообновляется после: обработки голосового источника, сохранения TG-анализа
  → страница: /dashboard/client-profile

СТИЛЬ РИЛСОВ (per-project, отдельная система — НЕ трогать!)
  style_samples таблица + projects.style_analysis
```

Иерархия в генераторах:
1. `producer_style.analysis` (стиль продюсера)
2. `style_profile` из project_data (стиль клиента)
3. Сырые данные: voice_sources + telegram_analyses
4. Fallback: "экспертный, разговорный"

## 🗂 СТРУКТУРА РАЗДЕЛА «АНАЛИЗ ДАННЫХ» (/dashboard/collect)

```
Верхние вкладки:
  Сайт | Instagram | Telegram | Подкасты и выступления | Поисковые запросы

Instagram подвкладки:
  Скрапинг Apify | Архив ZIP | Комментарии

Файлы компонентов:
  app/dashboard/instagram/comments/page.js   — анализ комментариев (Apify, модерация)
  app/dashboard/collect/search/page.js       — поисковые запросы (YouTube + Яндекс)
  app/dashboard/collect/page.js              — оркестратор всех вкладок
```

## 🌐 АРХИТЕКТУРА АНАЛИЗА САЙТА

```
project_data key='website_analysis'         — последний анализ {status, result, url, date}
project_data key='website_analyses_history' — массив до 10 анализов [{id, url, date, result}]
API: POST /api/analyze-website
```

## ⚠️ ВАЖНО — АРХИТЕКТУРА ИДЕЙ

Идеи хранятся **НЕ в таблице `ideas`**, а в `project_data` с `key='ideas_board'` (JSON-массив).  
Страница `/dashboard/ideas` читает `/api/ideas/items` (project_data).  
**Кнопки «+ в идеи»** → POST на `/api/ideas/items`, не на `/api/ideas`.

Структура идеи: `{ id, text, source, note, status, created_at }`
- `source` — тип источника: 'podcast', 'search'/'telegram', 'comments', 'manual'
- `note` — **контекст-подсказка** (почему интересна идея) или источниковая метка

## 📁 КЛЮЧЕВЫЕ ФАЙЛЫ

```
app/dashboard/client-profile/page.js        — профиль клиента (центральная страница стиля)
app/api/style-profile/generate/route.js     — генерация профиля (все источники, без лимитов)
app/api/backup/route.js                     — GET (cron+secret), POST (ручной, без secret)
app/api/backup/info/route.js                — GET последнего бэкапа из Storage
app/dashboard/collect/page.js              — Анализ данных: все вкладки + подвкладки
app/dashboard/collect/search/page.js       — Поисковые запросы (YouTube + Яндекс)
app/dashboard/instagram/comments/page.js  — Комментарии: Apify, модерация, статусы
app/dashboard/instagram/page.js           — Скрапинг Apify (рилсы)
app/dashboard/instagram/archive/page.js   — Архив ZIP
app/dashboard/telegram/page.js            — анализ TG: AddIdeaBtn, xDismiss, автооткрытие
app/dashboard/style/page.js               — голосовые источники: флажки, AddIdeaBtn
app/dashboard/ideas/page.js               — доска идей (только board, без вкладок)
app/api/ideas/items/route.js              — GET/POST/PATCH/DELETE идей (project_data)
app/api/ideas/enrich-context/route.js     — обогащает note у podcast-идей
app/api/producer-style/route.js           — профиль продюсера
app/api/analyze-website/route.js          — анализ сайта + история
app/api/tg-posts/generate/route.js        — генерация TG-постов
app/api/generate-script/route.js          — генерация сценариев
app/api/voice-base/process/route.js       — обработка голосовых источников (→ авто-профиль)
app/api/telegram-analyze/route.js         — TG-анализ (→ авто-профиль)
app/dashboard/website/page.js             — история анализов сайта
app/dashboard/tg-posts/page.js            — генератор постов + компактный StyleCard
app/dashboard/settings/page.js            — настройки + дата последнего бэкапа
app/dashboard/settings/profile/page.js   — профиль продюсера + секция стиля
components/Sidebar.js                     — навигация
```

## 🔧 ОСОБЕННОСТИ AddIdeaBtn (TG и Style страницы)

Состояния: `idle` → `saving` → `done` (новый, уходит) / `exists` (дубль, уходит через 800мс) / `error` (остаётся)  
`context` prop → сохраняется в `note` поле идеи (приоритет над source label)  
Маппинг context по типам: topics→description, questions→context, pains→quote, phrases→why

## 🗃 ТАБЛИЦЫ SUPABASE (ключевые)
- `voice_sources` — голосовые источники (questions[{question, context}], chunks, style_notes, status)
- `telegram_analyses` — анализы TG-каналов (phrases, topics, summary, pains, questions)
- `project_data` — key-value per project (ideas_board, style_profile, website_analysis, website_analyses_history, **tg_dismissed**, **voice_flagged**)
- `user_settings` — key-value per user (producer_style)
- `scripts` — сценарии (is_corrected=true → правки продюсера)
- `project_pains` — боли аудитории (text, type)
- `dm_dialogs` — DM-переписки (ai_objections, ai_stage)

## 🔧 ОКРУЖЕНИЕ
- **Фронт**: Vercel (автодеплой из main, ~1 мин)
- **Боты**: Railway, проект `caring-endurance`, команда `node start.js`
- **БД**: Supabase `rrcqpdbnurtdcqposqoe`
- **AI**: claude-haiku-4-5-20251001 (посты/идеи), claude-sonnet-4-6 (анализ сайта, DM, воронки), claude-opus-4-8 (транскрипция, профиль стиля), Groq Whisper

## 🗑 АРХИТЕКТУРА УДАЛЁННЫХ ЭЛЕМЕНТОВ (TG-анализ)

```
project_data key='tg_dismissed' → массив строк (тексты удалённых элементов)

При X-клике:  xDismissItem(tabId, i, text) → добавляет в xDismissed + сохраняет в project_data
При загрузке: applyDismissFilters() = ideas-фильтр + xDismissed-фильтр → строит dismissed Set
Восстановить: undoXDismiss(text) → убирает из xDismissed + пересчитывает dismissed
```

## 🚩 АРХИТЕКТУРА ФЛАЖКОВ (голосовые источники)

```
project_data key='voice_flagged' → массив ID источников (voice_sources.id)

toggleFlag(id): добавляет/убирает из Set → сохраняет в project_data
При загрузке:   fetch voice_flagged → setFlagged(new Set(ids))
UI:             кнопка Flag рядом с Trash; помеченные — янтарный цвет, opacity 0.65, уходят вниз списка
```

## ✅ ПОСЛЕДНЯЯ СЕССИЯ (2026-06-17 сессия 5)

**Что сделали:**

1. **Бэкап: добавлены недостающие таблицы** — обнаружили что invoices, contracts, voice_sources, telegram_analyses, scripts, crm_clients, user_settings не бэкапились. Добавлены в `TABLES` в `app/api/backup/route.js`. Убрана несуществующая `ideas_items`.

2. **Кабинет продюсера: переработаны метрики** — `app/dashboard/page.js`:
   - Шапка: 3 карточки вместо 4 (убрана «По договорам»), «Получено» → «Вложено»
   - Карточки проектов: «Вложено» = invoices.total (счета), «Получено» = — (CRM, TBD)
   - Прогресс-бар убран (нет смысла без «Получено»)

3. **Интеграция amoCRM** — полный цикл:
   - `app/api/amocrm/sync/route.js` — синхронизация выигранных/проигранных сделок (status_id 142/143), заметок, звонков из amoCRM API v4. Тест подключения через POST с `test_only: true`. Сохраняет в `project_data key='amocrm_data'`
   - `app/api/amocrm/transcribe/route.js` — скачивает записи звонков → Groq Whisper → транскрипты. По 5 за раз, мержит с существующими. Сохраняет в `project_data key='amocrm_transcripts'`
   - `app/api/amocrm/analyze/route.js` — заметки + транскрипты → claude-sonnet-4-6 → closing_phrases, rejection_patterns, buyer_portrait, top_objections, insights. Сохраняет в `project_data key='amocrm_insights'`
   - `app/dashboard/collect/crm/page.js` — вкладка CRM: форма подключения → статистика → кнопки → инсайты с аккордеоном
   - `app/dashboard/collect/page.js` — добавлена вкладка «CRM» (фиолетовая)
   - `app/api/style-profile/generate/route.js` — amocrm_insights добавлены как 8-й источник в профиль клиента

**Архитектура amoCRM:**
```
Credentials: project_data key='amocrm_credentials' → { subdomain, token }
Данные:      project_data key='amocrm_data'        → { won_leads, lost_leads, calls }
Транскрипты: project_data key='amocrm_transcripts'  → { transcripts: [{lead_id, text, ...}] }
Инсайты:     project_data key='amocrm_insights'     → { closing_phrases, rejection_patterns, buyer_portrait, top_objections, insights }

amoCRM API: Authorization: Bearer {token}
Base URL:   https://{subdomain}/api/v4/
Won status: 142, Lost status: 143
Звонки:     notes с note_type='call_in'|'call_out', ссылка в params.link
```

---

## ✅ ПОСЛЕДНЯЯ СЕССИЯ (2026-06-17 сессия 4)

**Что сделали — PDF договора (многочисленные итерации):**

1. **Убрали `avoid-all` mode** в html2pdf — он создавал видимые "ящики" (рамки) между блоками содержания. Заменили на `['css', 'legacy']` + CSS `page-break-inside: avoid` на каждом `<p>`.

2. **Заголовки разделов больше не остаются в одиночестве внизу страницы** — в `downloadPDF()` после клонирования DOM добавили обход прямых детей `.contract-body`: каждый `<h2>` + следующий `<p>` оборачиваются в `<div style="page-break-inside:avoid">`. Теперь заголовок физически не может оказаться один внизу страницы без первого абзаца.

3. **Подпись Скворцовой**: высота строки 48 → 70px, maxHeight изображения 32 → 64px, убран `mixBlendMode: multiply` (ухудшал качество в canvas), ширина `maxWidth: 90%`.

4. **Дата не срезается** — добавлен `paddingBottom: 16` в обе ячейки строки подписей.

5. **Дополнительно**: нижний margin PDF 20 → 18mm; paddingBottom в таблице реквизитов 20 → 10.

**Итоговая структура PDF:**
- Страница 1: Шапка + Разделы 1–2 (начало)
- Страница 2: Разделы 2–4
- Страница 3: Разделы 5–7 (без пустого заголовка в конце страницы)
- Страница 4: Раздел 8 (реквизиты + подписи, всегда с новой страницы)

**Изменённые файлы:**
```
app/dashboard/invoices/contracts/[id]/page.js — PDF генерация, подписи
```

---

## ✅ ПОСЛЕДНЯЯ СЕССИЯ (2026-06-16 сессия 3)

**Что сделали — Кабинет продюсера:**

1. **API агрегации** `app/api/producer/dashboard/route.js` — один запрос возвращает все проекты пользователя + по каждому: earned (invoices), invested (contracts.price), leads (crm_clients count), ig прирост (ig_follower_monthly), snapshot (project_data).

2. **API парсинга скринов** `app/api/producer/parse-stats/route.js` — принимает base64-изображение, отправляет в Claude Vision (claude-sonnet-4-6), извлекает: subscribers, avg_views, reach, likes, growth → сохраняет в `project_data` key=`metrics_snapshot`. Работает для любой платформы (IG, TG, YT).

3. **API команды** `app/api/producer/team/route.js` — GET/POST списка участников в `user_settings` key=`producer_team`. Авторизация через Bearer token.

4. **Новая главная `/dashboard/page.js`** — полностью переписана:
   - Шапка-сводка: проекты / получено / по договорам / заявок
   - Grid карточек проектов (1/2/3 колонки) с метриками
   - Кнопка 📷 на карточке → загрузить скрин → Claude Vision → обновление метрик
   - Прогресс-бар вложено/получено
   - Секция «Команда» с inline-добавлением участников

**Новые файлы:**
```
app/api/producer/dashboard/route.js   — агрегация всех метрик
app/api/producer/parse-stats/route.js — Vision-парсер скринов
app/api/producer/team/route.js        — команда продюсера
```

**Изменённые файлы:**
```
app/dashboard/page.js — новая главная (кабинет продюсера)
```

---

## ✅ ПОСЛЕДНЯЯ СЕССИЯ (2026-06-16 сессия 2)

**Что сделали — полировка печати договоров:**

1. **Фамилия заказчика в подписи** — было "предприниматель С. А. Н.", стало "Славиогло А. Н.". Исправлен парсинг: убирается "Индивидуальный предприниматель" из начала `client_name` перед формированием инициалов.

2. **Подпись исполнителя** — загружается из реквизитов (`/api/invoices/requisites`) как в актах. Изображение подписи отображается над линией в разделе 8.

3. **Скрытие сайдбара при печати** — добавлено в `Sidebar.js`: `print:hidden` на мобильный `div.fixed` и десктопный `aside`. Дополнительно в print CSS договора: `aside { display:none }` и `.fixed { display:none }`.

4. **Секция 8 — разбивка по страницам** — добавлен `page-break-before: always` → секция реквизитов всегда начинается с новой (последней) страницы.

5. **Поля PDF** — добавлен `@page { margin: 20mm }` — браузерные поля бумаги, применяются ко всем страницам.

6. **Структура секции 8** — переписана: таблица с `<colgroup>` (50%/50%), реквизиты в строке 1, подписи в отдельной строке 2 — оба блока подписей всегда на одном горизонтальном уровне.

**Изменённые файлы:**
```
app/dashboard/invoices/contracts/[id]/page.js  — подпись, печать, секция 8
components/Sidebar.js                          — print:hidden на оба элемента
```

---

## ✅ ПОСЛЕДНЯЯ СЕССИЯ (2026-06-16 сессия 1)

**Что сделали — система договоров + каталог услуг:**

1. **Новый клиент Славиогло** — создан проект `ИП Славиогло Александр Николаевич` в БД (id: `0b6a515d-e3b5-4e9b-b685-092bf982ab19`). Реквизиты: ИНН 504714914642, ОГРНИП 317500700009331, ПАО Сбербанк, р/с 40802810540000097289. Адрес: 141411, М.О. Солнечногорский р-н, д. Подолино, Мкр Велтон парк, ул. Лесная д 8 кв 27.

2. **Система договоров** — новая вкладка «Договоры» рядом со Счета/Акты:
   - Таблица: №, Дата, Заказчик, Тип (Стандарт/Воронка), Сумма, Статус (Подписан/Ожидает)
   - Новый договор: форма с автозаполнением из реквизитов проекта
   - Два типа: `standard` (фикса) и `funnel` (3% + фикса за съёмку)
   - Полный юридический текст договора (разделы 1–8) — готов к печати/PDF
   - Кнопка «Отметить подписанным» + загрузка подписанного файла (Storage bucket `contracts`)
   - Кнопка «Редактировать» → `/contracts/[id]/edit` — меняет тип, условия воронки, все поля
   - Условия воронки (п.4.6, 4.7): идентификация по телефону/TG, только при фиксе ≥300к

3. **Каталог услуг в счетах** — при ручном вводе услуги кнопка «Сохранить в каталог»:
   - API `/api/invoices/catalog` (GET/POST/DELETE) — хранит в `user_settings.service_catalog`
   - Дефолтные услуги + кастомные пользователя (без дублей)
   - Работает в форме создания (`new/page.js`) и редактирования (`[id]/edit/page.js`)
   - После сохранения: подтверждение «Сохранено в каталог» (Check icon)

4. **Баг numToWords** — исправлена функция прописи: для 300 000+ показывало «undefined тысяч» (обращение к `tens[30]` которого нет). Переписана с helper `chunk()`, корректно работает до 999 999.

**Новые файлы:**
```
app/api/contracts/route.js                  — список/создание договоров
app/api/contracts/[id]/route.js             — GET/PATCH/DELETE договора
app/api/contracts/[id]/upload/route.js      — загрузка подписанного файла
app/api/invoices/catalog/route.js           — каталог услуг (user_settings)
app/dashboard/invoices/contracts/new/page.js       — форма нового договора
app/dashboard/invoices/contracts/[id]/page.js      — просмотр + печать
app/dashboard/invoices/contracts/[id]/edit/page.js — редактирование договора
```

**Новые таблицы БД:**
```
contracts: id, project_id, user_id, number, date, type (standard/funnel),
           client_* (реквизиты), videos_count, shooting_days, price, tg_url,
           funnel_percent, funnel_fixed_price, signed, signed_at, signed_file_url
Storage bucket: contracts (для подписанных файлов)
```

---

## ✅ ПОСЛЕДНЯЯ СЕССИЯ (2026-06-10)

**Что сделали — три исправления:**
1. **Бот: текст сценария обрезался** — Telegram ограничивает caption у медиа до 1024 символов. Исправлено: caption жёстко режется на 1020 символов + "...", если обрезан — автоматически отправляется второе сообщение с полным текстом. Файл: `bot.js`, функция `sendScriptsForDay`.
2. **Форма нового счёта: нет label "Название"** — у всех колонок (Ед., Кол-во, Цена ₽) был заголовок, у поля "Название" не было. Добавлен label. Файл: `app/dashboard/invoices/new/page.js`.
3. **PDF счёта: наслоение в шапке** — строки "Банк получателя" и "Получатель" перекрывались из-за конфликта `borderCollapse` + `colSpan/rowSpan`. Шапка полностью переписана с flex-контейнером и явными border. Файл: `app/dashboard/invoices/[id]/page.js`.

---

## ✅ ПОСЛЕДНЯЯ СЕССИЯ (2026-06-09 сессия 4)

**Что сделали — раздел «Оплата и договор» (счета/акты):**
1. **Чекбокс «Без подписи»** — на вкладке Акт появился чекбокс. При включении: электронная подпись скрыта, но место под ручную подпись (64px) остаётся.
2. **Вкладки Счета / Акты** на странице списка — переключатель в стиле pill, заголовок меняется, жёлтая подсказка в режиме Акты.
3. **В режиме Акты:** зелёный бейдж «Акт», кнопка «Открыть акт» (ведёт на `?tab=act`), скрыты «Изменить» и «Удалить».
4. **Сохранение даты акта** — добавлена колонка `act_date DATE` в таблицу `invoices`. При изменении даты — сразу сохраняется в БД, надпись «Сохранено» на 2 сек.
5. **Заголовок страницы** — в режиме Акт показывает «Акт №153 от 24.04.2026» (дата акта, не счёта).
6. **Имя PDF-файла** — скачивается с датой акта.
7. **Список актов** — колонка Дата показывает `act_date` если задана, иначе дату счёта.
8. **Сортировка** — список счетов и актов сортируется по номеру убыванием (самый новый сверху).

**Архитектура act_date:**
```
invoices.act_date DATE (nullable)
- null → используется inv.date (дата счёта)
- задана → используется в заголовке, PDF, списке актов
- сохраняется при изменении инпута даты на вкладке Акт
```

---

## ✅ ПОСЛЕДНЯЯ СЕССИЯ (2026-06-09 сессия 3)

**Что сделали:**
1. **Отчёт по воронке ПроАвто** — собрали данные из amoCRM (скрины), сформировали полный отчёт: 255 заявок в директ, 24 номера, 2 продажи на 95 000 ₽, 7 отказов (86% игнор).
2. **HTML-презентация** — создан файл `C:\Users\89117\proavto-report.html` (7 слайдов, стиль old money: зелёный + золото). Слайды: титул, воронка, деньги, отказы, что сделано, инсайты, следующий шаг.
3. **Кнопка «⬇ Скачать PDF»** — добавлена на страницу, генерирует PDF через html2canvas + jsPDF (pixel-perfect, как на экране). PDF создаётся по размеру окна браузера — нужно разворачивать на весь экран перед генерацией.
4. **Фикс символа ₽** — Playfair Display не содержит ₽, добавлен JS-обёртка через Segoe UI.

**Что не доделали:**
- PDF всё ещё имеет проблему с размером страницы (слайд не заполняет всю страницу) — требует проверки в полноэкранном режиме.

**Решения по отчёту:**
- Убрана критика ОП (игнор — это факт, не чья-то вина)
- Вопрос «почему 24 номера а в CRM 16» — оставлен как открытый вопрос к заказчику
- Интеграция SaleBot → CRM отложена

---

## ✅ ПОСЛЕДНЯЯ СЕССИЯ (2026-06-07 сессия 2)

**Что обсуждали:**
1. **49 скриптов без `example_id`** — решили оставить как есть. Влияние: в боте такие скрипты приходят только текстом, без видео сверху. Некритично, это старые скрипты (храм 2022, бизнес-темы).
2. **Интеграция SaleBot → CRM студии** — изучили API SaleBot, план сформирован (не выполнен).

**SaleBot API (docs.salebot.pro) — что доступно:**
- `GET /api/{key}/get_clients` — список клиентов (до 500 за раз, offset/limit)
- `GET /api/{key}/get_variables?client_id=` — переменные клиента (теги, статусы, суммы)
- `POST /api/{key}/find_clients` — поиск по переменным с фильтрами
- `GET /api/{key}/get_history?client_id=` — история диалога
- Авторизация: API-ключ в URL, генерируется в настройках SaleBot

**Что хотим сделать:**
Новый раздел в CRM студии — «Воронка» — синхронизация из SaleBot:
- Дашборд: пришло → контакт → предоплата → отказ
- Список клиентов с тегами из SaleBot
- AI-анализ причин отказа по истории диалогов
- Связка с существующей CRM

**Заблокировано:** не знаем как называются переменные в SaleBot у Александра (статус, предоплата, отказ и т.д.) — нужно уточнить перед реализацией.

---

## ✅ СЕССИЯ 1 (2026-06-07)

**Что сделали:**
1. **Видео-примеры: кнопка удаления на мобильном** — была скрыта через `opacity-0 group-hover:opacity-100` (hover на мобильном не работает). Заменили на `md:opacity-0 md:group-hover:opacity-100` — на мобильном кнопка всегда видна, на десктопе — по hover. Цвет иконки: красный `#ef4444`. Файл: `app/dashboard/reels/examples/page.js`.
2. **Видео-примеры: pull-to-refresh (свайп вниз = обновление)** — добавили `touchStart/Move/End` обработчики. При свайпе ≥ 50px от верха страницы вызывает `load()`. Визуальный индикатор `RefreshCw` по ходу тяги.
3. **Бот: голосовые примеры (OGG) не отображались как видео** — корневая причина: голосовые сообщения (OGG) загружались в Storage как `direct_xxx.mp4` с `contentType: video/mp4`. Telegram отклонял `sendVideo`, `catch {}` молча глотал ошибку. Исправлено:
   - `handleMedia`: AUDIO_EXTS-детект → загрузка с правильным расширением `.oga` и `audio/ogg`
   - `sendScriptsForDay`: `sendVideo` → при ошибке → `sendAudio` fallback → при ошибке → текст. Ошибки теперь логируются.
   - Веб `examples/page.js`: для URL с `.oga/.ogg` рендерится `<audio>` плеер вместо чёрного `<video>`
4. **Анализ данных съёмочного дня** — написали и запустили диагностический скрипт `check-voice-examples.mjs`. Выяснили: 65 скриптов в архиве, 16 с `example_id` (все `Video by ...`), 49 без примера. Скрипты без примера — разные проекты (автошкола, бизнес, храм), созданы без кнопки «Создать сценарий».

**Что не сработало:**
- «Голосовое 24.05.2026» записей в БД не обнаружено (видимо были в другом проекте или уже удалены) — скрипт миграции `fix-voice-examples.mjs` нашёл 0 записей для исправления.

## ⚠️ ВАЖНО — АУДИО-ПРИМЕРЫ (архитектура)

```
Голосовые сообщения в боте → handleMedia → isExample=true
  → AUDIO_EXTS = ['.oga', '.ogg', '.mp3', '.m4a', '.wav']
  → Загрузка: contentType='audio/ogg', расширение '.oga'
  → public_url сохраняется
  → В боте: sendVideo → fail → sendAudio (fallback)
  → На вебе: /\.(oga|ogg|mp3|m4a|wav)(\?|$)/i.test(url) → <audio> вместо <video>

Видеофайлы → расширение '.mp4', contentType='video/mp4' — без изменений
```

## 🔧 МИГРАЦИИ БД (без SQL Editor)

`exec_migration` RPC функция создана в Supabase studio.
```js
// Запустить из C:\Users\89117\studio\:
// node _migrate.mjs
import { readFileSync } from 'fs'
import { createClient } from './node_modules/@supabase/supabase-js/dist/index.mjs'
// ... парсим studio-cabinet.env ...
const { error } = await supabase.rpc('exec_migration', { migration_sql: 'ALTER TABLE ...' })
```

## ➡️ СЛЕДУЮЩИЙ ШАГ

### ✅ Выполнено (2026-06-09 сессия 4)
- Чекбокс «Без подписи» в акте (место под ручную подпись остаётся)
- Вкладки Счета / Акты в списке
- Сохранение даты акта в `invoices.act_date`
- Заголовок, PDF-файл, список актов — всё с правильной датой
- Сортировка по номеру убыванием

### ✅ Выполнено (2026-06-09 сессия 3)
- Отчёт по воронке ПроАвто: HTML-презентация `C:\Users\89117\proavto-report.html`
- Кнопка «⬇ Скачать PDF» через html2canvas + jsPDF
- Фикс символа ₽ в PDF

### ✅ Выполнено (2026-06-07)
- Кнопка удаления примеров на мобильном
- Pull-to-refresh на странице примеров
- Фикс аудио-примеров (OGG) в боте и на вебе
- 49 скриптов без `example_id` — решено оставить как есть

### ➡️ Следующий шаг

1. **amoCRM — подключить первый проект** — зайти в Анализ данных → CRM, ввести поддомен и токен клиента (например ПроАвто / Гусев), нажать «Синхронизировать» и проверить что данные тянутся

2. **«Получено» в кабинете продюсера** — сейчас показывает `—`. Нужно определить источник: откуда брать «реально полученные деньги» (из CRM, из банка, ручной ввод?). Как решим — реализовать

3. **Раздел «Отчёты» в студии** — страница внутри кабинета: вводишь данные по воронке → Claude генерирует HTML-презентацию (образец: `C:\Users\89117\proavto-report.html`)

4. **Интеграция SaleBot → CRM** (отложено) — ждёт названий переменных от Александра (как называется «статус», «предоплата», «отказ» в его SaleBot)
