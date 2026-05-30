---
name: project_secretary_role
description: "Добавлена роль secretary (Секретарь настоятеля) — права, уведомления, доступы"
metadata: 
  node_type: memory
  type: project
  originSessionId: ee92227b-9202-4ba1-8ead-1535982a080e
---

## Роль `secretary` — Секретарь настоятеля

**Статус:** реализована (сессия 2026-05-26)

## Что умеет

- Редактирует календарь настоятеля (AbbotScheduleModal с canEdit=true)
- Получает уведомления о новых заявках на встречу (`abbot_meeting`) и обращениях (`abbot_appeal`)
- Получает уведомления о поручениях настоятеля (tasks) через `notifyAbbot()`
- Видит панель «Благословения» (задачи)
- Видит «Записи» прихожан (BookingsModal) — как все сотрудники

## Где задействована

- `types/index.ts` — добавлена в UserRole
- `app/actions/staff.ts` — STAFF_ROLE_LABELS + MANAGEABLE_ROLES
- `app/actions/tasks.ts` — notifyAbbot() рассылает по `in('role', ['abbot','secretary'])`
- `app/actions/abbot-schedule.ts` — submitAbbotAppeal/submitMeetingRequest notify `['abbot','admin','secretary']`
- `components/schedule/ScheduleView.tsx` — canEditAbbot включает secretary; кнопка Благословения видна

## Назначение роли

В Supabase → таблица `profiles` → поле `role` = `'secretary'`  
Ограничений (CHECK constraint) на поле нет, строка принимается напрямую.
