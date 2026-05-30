# Handoff — Храм Спас на Каменке (khram-spas)

## 🎯 ЦЕЛЬ ПРОЕКТА
Веб-приложение для прихода: расписание богослужений, запись прихожан, роли для всего персонала, уведомления через Telegram и Max, православный календарь.

## 📍 ТЕКУЩЕЕ СОСТОЯНИЕ
*Обновлено: 2026-05-30 (сессия 7)*

- [x] Next.js приложение на Railway (`npm start`)
- [x] 23+ роли: abbot, admin, priest, deacon, altarnik, senior_altarnik, regent, secretary, florist, candle_seller, cleaner, cook, security, it_staff, developer, moderator, **staff** + функциональные
- [x] role_settings в Supabase (permissions + notifications per role)
- [x] Telegram-интеграция (webhook + notify + inline кнопки)
- [x] **Max-интеграция — РАБОТАЕТ** (токен прописан, вебхук зарегистрирован)
  - Бот: «Календарь прихода», username `@id7813204684_bot`
- [x] Православный календарь (lib/orthodox-calendar.ts + sync-calendar.mjs)
- [x] Умный авто-назначение священника: duty / trebny_main / trebny_small
- [x] Статусы украшений (флорист) + хора (регент) в Telegram и на сайте
- [x] Страница флориста `/florist/schedule`
- [x] Священник видит требы по дежурству (не только назначенные)
- [x] Вход по номеру телефона — **OTP через Telegram или Max** (без SMS/Twilio) ✅
- [x] Благословения: анонимность, группировка по ролям в dropdown
- [x] Роли по отделам в UI: **аккордеон (все секции свёрнуты по умолчанию)**
- [x] `/admin/import` — импорт **✅ ВЫПОЛНЕН** (37 сотрудников в базе)
- [x] `/admin/access` — таблица доступов + отправка настоятелю (1 сообщение/чел)
- [x] `/guide` — публичная инструкция по входу
- [x] Online/Offline точка в StaffManager (🟢 < 5 мин / ⚫ офлайн)
- [x] **Множественные доп. роли для священников** — колонка `extra_roles text[]`
- [x] **Имя настоятеля в /book** — динамически из БД (не hardcode)
- [x] **Дубли уведомлений исправлены** — идемпотентность для callback и cron
- [x] Поле `temple` в богослужениях (⛪ Большой / 🕍 Малый храм)
- [x] Задачи: «↩️ Вернуть исполнителю» + «📅 Продлить срок»
- [x] **Псалтирь: конфликты с требами** — psalter_manager получает уведомление при создании/подтверждении требы на дату с чтецами
- [x] **Псалтирь: внешняя форма `/psalter`** — прихожане записываются без авторизации; кафизма назначается автоматически
- [x] **Формат ФИО: Фамилия Имя Отчество** — плейсхолдеры унифицированы во всех формах
- [x] **Вид треб как Календарь** — Google Calendar-style, drag-and-drop для `schedule_editor`+
- [x] **UX: Доп. роли без скролла** — список чекбоксов раскрыт полностью
- [x] **Групповые поручения: идемпотентность** — таблица `task_acks(task_id, acknowledger_id, UNIQUE)`, 1 человек = 1 нажатие, «Уже принято» при повторе
- [x] **extra_roles → пункты меню** — `getEffectivePermissions` принимает `string[]`, страницы передают `canTasks`/`canStaff`/`canSlots` в ScheduleView
- [x] **Кнопка «📋 Требы»** — прямо в навигационной полосе расписания (не в гамбургер-меню)
- [x] **Обратные уведомления — групповые поручения** — при каждом «Принято» настоятель+модераторы получают «✅ Имя принял (2/5)»; при 100% — «✅ Все приняли»
- [x] **Кнопка «❌ Не могу выполнить»** — вторая строка кнопок в индивидуальных поручениях (Telegram + Max); поручение возвращается в очередь, admin получает уведомление
- [x] **РЕДИЗАЙН /book — ВЫПОЛНЕН** (сессия 6)
- [x] **ЕДИНЫЙ КАЛЕНДАРЬ ТРЕБ** — фильтры Все/Богослужения/Требы, подфильтры, верификационные точки 🔴🟡🟢 (сессия 7)
- [x] **ПСАЛТИРЬ В КАЛЕНДАРЕ** — фиолетовые блоки 📖, конфликт ⚠ (сессия 7)
- [x] **ПРИЁМНАЯ НАСТОЯТЕЛЯ** — заявки от сотрудников и прихожан, подтверждение с уведомлением (сессия 7)
- [x] **УВЕДОМЛЕНИЯ ПРИХОЖАНИНУ** — при подтверждении/исполнении требы священником (сессия 7)
- [x] **ФИКс MAX-ПРИВЯЗКИ** — regex расширен, свечница может привязать бот (сессия 7)

## 🗂 РЕДИЗАЙН /book (сессия 6) — детали

### Новая структура страницы
Главное меню — 5 аккордеон-блоков + расписание богослужений сверху:

| Блок | Что внутри |
|------|-----------|
| ✦ Таинства | Крещение (четверги 18:50) · Венчание (авто-беседа) |
| ⛪ Требы в храме | Отпевание · Молебен · Панихида · Освящение машины · Исповедь · Беседа |
| 🏠 Пригласить священника | Причастие · Соборование · Выезд к больному · Освящение кв. · Панихида на кладбище · Выездное отпевание |
| 📖 Псалтирь | Ссылка на /psalter |
| ✉️ Приёмная настоятеля | Телефон + email + обращение + встреча |

### Новые роли в priests.extra_roles
| Роль | Кто | Назначение |
|------|-----|-----------|
| `baptism_responsible` | диакон Иоанн Дейнес | уведомление при записи на крещение |
| `wedding_responsible` | иерей Владислав Уличев | контроль назначения бесед |
| `funeral_responsible` | иерей Алексий Сергеев | уведомление при записи на отпевание |
| `services_moderator` | иерей Алексий Сергеев | исповедь, беседы, молебны, панихиды, освящение машин |
| `offsite_responsible` | настоятель (через role='abbot') | выездные требы |

### Алгоритм очереди бесед (венчание)
- Поле `duty_queue_index INT` в таблице `priests`
- Следующий священник = наименьший `duty_queue_index` среди `rank='Иерей'`
- Слоты = дни дежурства + все сб/вс
- После записи → `duty_queue_index + 1`
- Принцип: кто ведёт беседу — тот совершает Венчание

### Маршрутизация треб
| Тип | Куда |
|-----|------|
| Крещение | → `baptism_responsible` (диакон Иоанн), четверг 18:50 |
| Венчание | → очередной иерей + `wedding_responsible` для контроля |
| Отпевание | → `funeral_responsible` + admins |
| Молебен/Панихида/Освящение машины | → `services_moderator` |
| Исповедь/Беседа (20/40 мин) | → `services_moderator` |
| Выезды (все типы) | → настоятель (abbot) |

### Контакты приёмной
- 📞 +7 (905) 211-88-81
- ✉️ reception@krestovozdvizhenie.ru

## 📱 ТЕЛЕФОНЫ В БАЗЕ (привязаны к TG/Max)
| Профиль | Телефон | TG | Max |
|---------|---------|-----|-----|
| иерей Серафим Дейнес (abbot) | +79673412888 | ✅ | ✅ |
| иерей Алексий Бакулин (priest) | +79119534056 | ✅ | ✅ |
| диакон Иоанн Дейнес (deacon) | +79956057412 | ✅ | — |
| Тестовый акк / developer | +79111888877 | ✅ | — |

**Без телефона (вход только по email+пароль):**
иерей Владислав Уличев (admin), иерей Алексий Сергеев, иерей Игорь Лещинский, Жанна Кикиа (regent), Олеся Афанасова (florist)

## ⚠️ АНТИПАТТЕРНЫ — ИЗВЕСТНЫЕ БАГИ

| Ситуация | Что случилось | Решение |
|----------|---------------|---------|
| Настоятель не заходит по телефону | `is_archived = true` в profiles | SQL: `UPDATE profiles SET is_archived = false WHERE role = 'abbot'` |
| OTP код приходит, но «Ошибка входа» | `banned_until` в auth.users (≈2036) | SQL: `UPDATE auth.users SET banned_until = NULL WHERE id = '...'` |
| **Архивирование ставит БАН в auth.users** | `archiveStaff` делает: `is_archived=true` + `ban_duration:'87600h'` | При ручном восстановлении через SQL нужно исправлять **оба**: profiles И auth.users |
| «Выполнено» не работает после «Принято» | Идемпотентность блокировала action='done' при status='accepted' | Раздельные if для accept и done в tasks.ts |
| Max кнопки показывают `...` | `answerCallback('...')` вызывался ДО хендлера | Убрать ранний вызов из max/webhook/route.ts |
| `verifyOtp` падает в браузере | `@supabase/ssr` требует server-side для установки кук | Вызывать через route handler `/api/auth/otp-verify` |
| Флорист отображается в «Алтарники» | Попала в таблицу `priests` без ранга | `DELETE FROM priests WHERE profile_id = '...'` |
| Свечница не может войти через Max OTP | `max_chat_id` не заполнен в профиле | Она должна сначала привязать бота кодом `/start [код]` |

## 📁 КЛЮЧЕВЫЕ ФАЙЛЫ
```
C:\Users\89117\khram-spas\

app/book/page.tsx                  — страница /book (5 аккордеон-блоков)
app/actions/bookings.ts            — createBaptismBooking, createWeddingBooking,
                                     createConfessionBooking, getNextWeddingCounselor,
                                     incrementWeddingCounselorQueue, notifyPriestByRole
components/booking/BookingView.tsx — главный компонент /book (2200+ строк)
  Шаги: menu, baptism_form, wedding_slots/form, funeral_form,
        service_form, confession_form, home/home_form,
        abbot_reception/appeal/meeting, schedule, done

app/login/page.tsx                 — вход (телефон + OTP через TG/Max, fallback логин+пароль)
app/actions/otp-login.ts           — requestLoginOtp + verifyLoginOtp
app/api/auth/otp-verify/route.ts   — GET ?token_hash=XXX → verifyOtp server-side → /dashboard
app/actions/tasks.ts               — createTask, assignTask, handleTaskCallback, handleTaskCallbackMax
                                     handleTaskDecline, handleTaskDeclineMax, acknowledgeGroupTask
app/actions/psalter.ts             — loadPsalterWeek, savePsalterReading, checkAndNotifyPsalterConflict
                                     loadPsalterPublicSlots, createPublicPsalterSignup
app/actions/role-settings.ts       — getEffectivePermissions(role, extraRoles: string[])
app/admin/schedule/page.tsx        — читает extra_roles, передаёт canTasks/canStaff/canSlots
app/dashboard/page.tsx             — touchLastSeen, redirect по роли, учитывает extra_roles
app/admin/staff/page.tsx           — панель сотрудников
app/admin/access/page.tsx          — таблица доступов + отправка настоятелю

app/api/telegram/webhook/route.ts  — обработчик: group_ack, task_accept/done/decline, booking_*, deco_*, choir_*
app/api/max/webhook/route.ts       — то же для Max
app/api/max/set-webhook/route.ts   — GET ?secret=CRON_SECRET → регистрирует вебхук Max

app/psalter/page.tsx               — публичная страница записи на чтение (без авторизации)

components/booking/BookingView.tsx — форма записи прихожан (5 блоков)
components/booking/BookingsModal.tsx         — список треб + переключатель Список/Календарь
components/booking/BookingsCalendarView.tsx  — Google Calendar вид (drag-and-drop)
components/psalter/PsalterPublicView.tsx     — форма публичной записи на псалтирь
components/schedule/PsalterModal.tsx         — внутренний редактор чтецов
components/admin/StaffManager.tsx            — аккордеон секций; PriestEditCard (доп. роли без скролла)
components/schedule/ScheduleView.tsx         — canTasks/canStaff/canSlots props, кнопка «📋 Требы»
components/schedule/TasksModal.tsx           — благословения: dropdown с <optgroup> по ролям

lib/notify.ts                      — двойной отправщик Telegram+Max
lib/role-defaults.ts               — DEFAULT_ROLE_PERMISSIONS (включая 5 новых ролей routing)
lib/notification-router.ts         — notifyByEvent (дедупликация по chat_id)
lib/max.ts                         — Max API (Authorization: TOKEN без Bearer)
lib/task-group-defs.ts             — TASK_GROUP_DEFS (вынесен из use server файла)
lib/booking-constants.ts           — BOOKING_TYPE_LABELS, PERSONAL_TYPES, TEMPLE_TYPES, HOME_TYPES
```

## 🔧 ОКРУЖЕНИЕ
- **Деплой**: Railway, проект `caring-endurance`, сервис `khram-spas`
- **URL**: https://khram-spas-production.up.railway.app
- **БД**: Supabase, project `brtkdmrktzukmrokkihg`
- **Ключи**: `C:\Users\89117\.claude\secrets\khram-spas.env`
- **Telegram бот**: @HramSpasBot
- **Max бот**: @id7813204684_bot («Календарь прихода»), токен в Railway `MAX_BOT_TOKEN`
- **ВАЖНО**: НЕ запускать локально — только Railway
- **Деплой через**: `railway up --detach`
- **GitHub**: https://github.com/skvortsovproduction2020-sudo/khram-spas (ветка master, работает)

## 👥 РОЛИ В СИСТЕМЕ

### Духовенство
`priest` `deacon` `altarnik` `senior_altarnik`

### Администрация
`abbot` `admin` `moderator` `secretary` `developer`

### Хор
`regent`

### Службы
`florist` `candle_seller` `cleaner` `cook` `security` `it_staff`

### Без точной роли
`staff` — матушка, казначей, бухгалтер, организатор, рабочий (5 чел)

### Функциональные
`baptism_priest` `wedding_priest` `funeral_priest`
`schedule_editor` `bookings_manager` `staff_manager` `psalter_manager`

### Маршрутизация треб (extra_roles в priests)
`baptism_responsible` `wedding_responsible` `funeral_responsible`
`services_moderator` `offsite_responsible`

## 📊 СОСТОЯНИЕ БАЗЫ (на 2026-05-29)
**37 профилей** в системе:
- Клир: abbot(1), priest(3), deacon(1), altarnik(2), senior_altarnik(1) = 8
- Администрация: admin(1), developer(1), moderator(1), secretary(1) = 4
- Хор: regent(1) = 1
- Службы: florist(2), candle_seller(4), cleaner(6), cook(2), security(4), it_staff(1) = 19
- Без роли: staff(5) = 5

## 🗃 SUPABASE — ТАБЛИЦЫ
- `task_acks(id, task_id uuid → tasks, acknowledger_id text, acked_at, UNIQUE(task_id, acknowledger_id))` — идемпотентность групповых поручений
- `priests.duty_queue_index INT DEFAULT 0` — счётчик очереди бесед перед венчанием

## 🔐 ФОРМАТ ДОСТУПОВ ДЛЯ СОТРУДНИКОВ
- **Email (логин)**: `[10 цифр телефона]@khram-spas.ru`
- **Пароль**: те же 10 цифр телефона
- **TG-код**: 6-символьный hex → написать @HramSpasBot

## ✅ ПОСЛЕДНЯЯ СЕССИЯ
*Дата: 2026-05-30 (сессия 7 — объединённый календарь + Приёмная + уведомления)*

**Что сделали:**

### Коммит 1: Единый календарь треб (BookingsCalendarView)
- Полная переработка: загружает богослужения + требы параллельно
- Три фильтра: **Все | Богослужения | Требы**; подфильтры треб: Встречи / В храме / Выезды
- Цветовые статусы верификации: 🔴 никто не отреагировал / 🟡 частично / 🟢 готово
- Логика верификации: венчание (беседа+священник), крещение (катехизис+священник), отпевание (хор+декор+священник)
- Кнопка ⚙ Слоты — только для drag-доступа внутри модала
- «Слоты треб» убраны из мобильного меню
- BookingsModal: открывается в режиме календаря по умолчанию для CALENDAR_ROLES

### Коммит 2: Приёмная настоятеля (AbbotScheduleModal)
- **abbot-schedule.ts**: `loadAbbotMeetingRequests`, `submitStaffMeetingRequest`, `confirmMeetingRequest`, `cancelMeetingRequest`
- **AbbotScheduleModal**: два таба — «📅 Расписание» и «✉️ Заявки» (счётчик новых)
- Настоятель/admin: видит полные данные + кнопки «Подтвердить» (с датой/временем) / «Отклонить»; уведомление прихожанину при подтверждении
- Сотрудники: видят «занято» без деталей + кнопка «📅 Записаться к настоятелю» с формой
- Встречи из bookings (abbot_meeting, abbot_appeal) отображаются в расписании и на вкладке заявок

### Коммит 3: Псалтирь + уведомления прихожанину + фикс свечницы
- **BookingsCalendarView**: загружает `psalter_readings` за неделю → фиолетовые блоки 📖 с кафизмой и именем; конфликт с требами помечается ⚠
- **bookings.ts**: `notifyParishioner(phone, text)` — ищет профиль по телефону, отправляет в TG/Max; вызывается из `handleBookingCallback` и `handleBookingCallbackMax` при accept («Договорились») и done («Исполнено»)
- **Max webhook**: regex для `/start` расширен `[a-z0-9\-_]{4,40}` — принимает link_code любой длины (был `{6}`, что блокировало свечниц)

**Что не сработало:**
- Ничего критичного.

**Open вопросы:**
- Нет.

**Нерешённые баги (ниже приоритетом):**
1. «Намеренно отклонил соединение» — ошибка на некоторых телефонах, вероятно Railway SSL
2. Свечница: после деплоя нужно чтобы она отправила `/start [её код]` боту @id7813204684_bot — код виден в `/admin/access`

## ➡️ СЛЕДУЮЩИЙ ШАГ

**Проверить задеплоенное:**
- Открыть «Требы» → убедиться что Псалтирь (фиолетовые блоки) видна в календаре
- Открыть «Приёмная настоятеля» → вкладка «Заявки», форма сотрудника «Записаться»
- Протестировать: священник нажимает «Договорились» → прихожанин получает уведомление в TG

**Возможные следующие задачи:**
- Проверить вход свечницы через Max после регистрации `/start [код]`
- SSL/«отклонил соединение» — разобраться с какими устройствами воспроизводится
