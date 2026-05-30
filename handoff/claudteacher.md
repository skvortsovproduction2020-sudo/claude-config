# Handoff — ClaudTeacher

*Обновлено: 2026-05-30*

## 🎯 ЦЕЛЬ

Персональный наставник по vibe coding с Claude. Александр спрашивает как улучшить работу, эффективность, качество и безопасность — получает конкретные советы и внедряет их.

## 📍 ЧТО ЭТО

Не проект с деплоем, не бот — это сессия в Claude Code. Роль: ментор, гений, советник по работе с Claude Code.

## ✅ ПОСЛЕДНЯЯ СЕССИЯ (2026-05-30)

### 1. Промт для друга-новичка
Собрали универсальный сетап-промт (уровень 0, русский язык, полный комплект):
- Краткая инструкция (3 шага: установить расширение, открыть чат, вставить промт)
- Промт: Claude задаёт 3 вопроса (имя, проекты, USERNAME) → создаёт CLAUDE.md + handoff папку + объясняет систему

### 2. Настройка claude.ai (веб-версия)
- ✅ Custom Instructions: кто такой Александр, правила поведения, формат задачи
- ✅ Project "Мои проекты": инструкции по 4 проектам
- ✅ Файлы: загружены все 7 handoff файлов (studio, khram-spas, avatar, taskflow, promt, claudteacher, _template)
- Исправлено: локация Нидерланды → Россия, Санкт-Петербург (обновлено в memory)

### 3. Апгрейд моделей в studio-cabinet
Подняли 4 файла с Haiku/Sonnet → claude-opus-4-8:
- `app/api/tg-posts/generate/route.js`
- `app/api/generate-script/route.js`
- `app/api/producer-style/route.js`
- `app/api/style-profile/generate/route.js`
Задеплоено (git push → Vercel).

### 4. GitHub резервная копия .claude — НЕ ЗАВЕРШЕНО
Создали репозиторий `skvortsovproduction2020-sudo/claude-config` (приватный).
Сделали git init + первый коммит — но push упал: в папке `projects/` есть .jsonl файлы до 188 МБ (логи сессий), GitHub не принимает файлы >100 МБ.

**Что нужно доделать в следующий раз:**
1. Добавить `projects/` в `.gitignore`
2. Сбросить коммит: `git reset HEAD~1`
3. Сделать новый коммит без больших файлов
4. Пушнуть в claude-config

## ⏳ НЕЗАКРЫТЫЕ ХВОСТЫ

- GitHub резервная копия .claude — почти готово, осталось исправить .gitignore (см. выше)
- Supabase PAT (khram-spas) — не сменили, зайти на supabase.com с gmail → Access Tokens → сменить `sbp_17ce...`
- Anthropic API key — не ротирован (taskflow заморожен, не критично)

## ➡️ СЛЕДУЮЩИЙ ШАГ

1. Завершить GitHub резервную копию (5 минут, я сделаю сам):
   - Добавить `projects/` в .gitignore
   - git reset + новый коммит + push
2. Закрыть хвост с Supabase PAT для khram-spas

## 📚 ТЕМЫ ДЛЯ БУДУЩИХ СЕССИЙ

- Как писать хорошие промты для Claude Code (контекст файла vs слова)
- Когда делать /compact и как читать процент контекста — практика
- Как структурировать большие задачи чтобы не терять контекст
- Лучшие паттерны для работы с Railway/Supabase через Claude
- .gitignore аудит в studio и taskflow репозиториях
- Следить за migration guide — когда выйдет Opus 4.9/5.0
