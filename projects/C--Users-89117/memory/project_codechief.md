---
name: project_codechief
description: "CodeChief — AI-платформа для разработчиков, два модуля (CTO Review + Daily Debrief), готовый промт для старта"
metadata: 
  node_type: memory
  type: project
  originSessionId: 800d7f94-a249-4c07-a258-4273372a2bfe
---

# CodeChief — готовый промт для запуска

**Статус:** Запланировано, не начато  
**Стек:** Next.js 14 + Supabase + Railway + Claude API (claude-sonnet-4-6) + Tailwind + shadcn/ui  
**Тема:** Тёмная, минималистичная

## Два модуля в одной платформе

### Модуль 1: CTO Review
Полный анализ проекта — security + код + архитектура  
**Флоу:** URL/IP → внешний скан → запрашивает код (GitHub / файлы / вставить) → полный отчёт  
**Вывод:** Executive Summary (X/10), критические проблемы 🔴, важные 🟡, архитектура 🏗️, чего не хватает ⚠️, план действий

### Модуль 2: Daily Debrief
Ежедневный разбор сессии с Claude  
**Флоу:** Вставляешь отчёт что накодил → система анализирует → ошибки + задачи на завтра  
**Вывод:** Что понял, критические ошибки 🔴, доработки 🟡, задачи на завтра 📋 (готовые инструкции для Claude Code), оценка дня X/10

## Навигация
Dashboard → CTO Review → Daily Debrief → История → Профиль

## База данных (Supabase)
- users, projects
- cto_reviews, cto_findings
- debrief_sessions, debrief_findings, debrief_tasks

## Лимиты (монетизация позже)
- Free: 1 CTO Review + 5 Debriefs в месяц, история 30 дней
- Pro: безлимит + история навсегда + экспорт

## Порядок разработки
1. Supabase: схема + RLS + Auth
2. Next.js: структура + shadcn/ui + тёмная тема
3. Layout: sidebar + auth pages
4. Dashboard: два блока + stats
5. CTO Review: wizard + внешний скан + Claude API + UI
6. Daily Debrief: форма + Claude API + UI задач
7. История: общая лента + фильтры
8. Деплой Railway

## Промт для старта (вставить в Claude Code)
Полный промт сохранён — см. разговор от 2026-05-26.  
Первый шаг после вставки: Claude показывает схему Supabase → ждёт подтверждения.

[[project_railway]]
[[project_supabase]]
