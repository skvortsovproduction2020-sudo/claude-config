# Handoff — Studio Cabinet

## 🎯 ЦЕЛЬ ПРОЕКТА
SaaS для контент-мейкеров: генерация сценариев, транскрипция видео/подкастов, база стиля речи, CRM.  
Фронт — Next.js на Vercel, боты — Railway, БД — Supabase.

## 📍 ТЕКУЩЕЕ СОСТОЯНИЕ
*Обновлено: 2026-05-29*

- [x] Генератор постов для TG — `/dashboard/tg-posts` (3 режима, 6 форматов, история, фильтр по проекту)
- [x] Система стилей: TG-генератор использует `style_profile` из project_data (приоритет 1)
- [x] Профиль стиля проекта — `POST /api/style-profile/generate` (синтез из voice_sources + telegram_analyses + materials)
- [x] Профиль продюсера — секция "🧠 Мой стиль написания" в `/dashboard/settings/profile`
- [x] API `/api/producer-style` — анализ всех правок сценариев + базы знаний
- [x] Сценарии: получают `producerStyle` и вставляют в промт (высший приоритет над стилем проекта)
- [x] Сайдбар: "СОЗДАНИЕ КОНТЕНТА" (было "СОЗДАНИЕ РИЛСОВ"), "Голосовые источники" (было "Стиль")
- [x] Раздел "Сбор данных" — объединены Сайт/Instagram/Telegram в `/dashboard/collect` с табами

## 🎭 АРХИТЕКТУРА СТИЛЕЙ (ЗАКОН — не менять!)

```
ПРОФИЛЬ ПРОДЮСЕРА (Александр, один на всё)
  user_settings key='producer_style'
  → analysis.system_prompt_addition → в ВСЕ генераторы (высший приоритет)
  → learning: из правок scripts (is_corrected=true) + knowledge_bases
  → UI: /dashboard/settings/profile → секция "🧠 Мой стиль написания"

СТИЛЬ ПРОЕКТА (per-project, голос клиента)
  project_data key='style_profile'
  → синтезируется из: voice_sources.style_notes + telegram_analyses.phrases/topics + materials
  → UI: карточка на странице /dashboard/tg-posts
  → API: POST/GET /api/style-profile/generate

СТИЛЬ РИЛСОВ (per-project, отдельная система — НЕ трогать!)
  style_samples таблица + projects.style_analysis
  → UI: кнопка "Стиль проекта" в /dashboard/reels/scripts
```

Иерархия в генераторах:
1. `producer_style.analysis` (стиль продюсера)
2. `style_profile` из project_data (стиль клиента)
3. Сырые данные: voice_sources + telegram_analyses
4. Fallback: "экспертный, разговорный"

## 📁 КЛЮЧЕВЫЕ ФАЙЛЫ

```
app/api/producer-style/route.js              — GET (загрузить), POST analyze/add_knowledge/delete_knowledge
app/api/style-profile/generate/route.js      — GET/POST профиля стиля проекта → project_data
app/api/tg-posts/generate/route.js           — генерация TG-постов (buildStyleBlock: profile→raw→fallback)
app/api/generate-script/route.js             — генерация сценариев (принимает producerStyle)
app/dashboard/tg-posts/page.js               — генератор постов + StyleCard + история
app/dashboard/settings/profile/page.js       — профиль продюсера + секция стиля
app/dashboard/reels/scripts/page.js          — сценарии (загружает producerStyle при открытии)
app/dashboard/collect/page.js                — объединённый сбор данных (Сайт/Instagram/Telegram)
components/Sidebar.js                        — навигация
```

## ⚠️ ВАЖНО — АРХИТЕКТУРА ИДЕЙ
Идеи хранятся **НЕ в таблице `ideas`**, а в `project_data` с `key='ideas_board'` (JSON-массив).  
Страница `/dashboard/ideas` читает `/api/ideas/items` (project_data).  
**Кнопки «+ в идеи»** → POST на `/api/ideas/items`, не на `/api/ideas`.

## 🗃 ТАБЛИЦЫ SUPABASE (ключевые)
- `voice_sources` — голосовые источники (style_notes, chunks, transcript, status)
- `telegram_analyses` — анализы TG-каналов (phrases, topics, summary, pains)
- `project_data` — key-value per project (ideas_board, tg_posts_history, style_profile)
- `user_settings` — key-value per user (producer_style, universal_style_analysis)
- `scripts` — сценарии (original_content + content = правка, is_corrected=true)
- `style_samples` — примеры сценариев для стиля рилсов (отдельная система)

## 🔧 ОКРУЖЕНИЕ
- **Фронт**: Vercel (автодеплой из main, ~1 мин)
- **Боты**: Railway, проект `caring-endurance`, команда `node start.js`
- **БД**: Supabase `rrcqpdbnurtdcqposqoe`
- **AI**: claude-haiku-4-5-20251001 (генерация), claude-opus-4-7 (транскрипция/анализ), Groq Whisper

## ✅ СЕССИЯ 2026-05-29

**Что сделали:**
1. Генератор постов для TG (`/dashboard/tg-posts`) — 3 режима, 6 форматов, история, стиль из проекта
2. Система стилей проекта — `style_profile` синтезируется из всех данных, подаётся в TG-генератор
3. Профиль продюсера — секция "Мой стиль написания" в настройках (правки → паттерны + базы знаний)
4. Подключили `producerStyle` к генератору сценариев
5. Зафиксирована архитектура стилей: продюсер + проект — раздельно, не смешивать

**Что не сработало:**
- Секция профиля продюсера сначала была невидима (rgba 0.05 сливалась с фоном) → переделана в стандартный Section

## ➡️ СЛЕДУЮЩИЙ ШАГ
1. Проверить что секция "🧠 Мой стиль написания" видна в профиле после последнего фикса
2. Протестировать кнопку "Сформировать стиль" (нужны исправленные сценарии или база знаний)
3. Добавить TG-посты тоже к обучению (когда редактируется пост → обновляет producer_style)
