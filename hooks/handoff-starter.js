/**
 * handoff-starter.js
 * SessionStart hook — показывает доступные проекты и спрашивает какой открывать
 */

const fs = require('fs');
const path = require('path');

const HANDOFF_DIR = path.join(process.env.USERPROFILE || 'C:/Users/89117', '.claude', 'handoff');
const STATE_FILE  = path.join(process.env.USERPROFILE || 'C:/Users/89117', '.claude', 'efficiency-state.json');

// Сбрасываем счётчики эффективности при каждом старте новой сессии
try {
  fs.writeFileSync(STATE_FILE, JSON.stringify({
    editCount: {},
    totalEdits: 0,
    sessionStart: Date.now(),
    lastSuggestion: 0
  }, null, 2));
} catch (e) {}

// Читаем handoff-файлы
try {
  if (!fs.existsSync(HANDOFF_DIR)) {
    process.exit(0);
  }

  const files = fs.readdirSync(HANDOFF_DIR)
    .filter(f => f.endsWith('.md') && !f.startsWith('_'));

  if (files.length === 0) {
    console.log('📋 Handoff-файлов нет. Скажи "новый проект: [название]" чтобы начать.');
    process.exit(0);
  }

  const projects = files.map(f => {
    const filePath = path.join(HANDOFF_DIR, f);
    const content   = fs.readFileSync(filePath, 'utf8');

    const dateMatch = content.match(/\*Обновлено:\s*(\d{4}-\d{2}-\d{2})\*/);
    const date      = dateMatch ? dateMatch[1] : '—';

    const goalMatch = content.match(/## 🎯 ЦЕЛЬ ПРОЕКТА\n(.+)/);
    const goal      = goalMatch ? goalMatch[1].trim() : '';

    const stepMatch = content.match(/## ➡️ СЛЕДУЮЩИЙ ШАГ\n([\s\S]+?)(?:\n##|$)/);
    const nextStep  = stepMatch
      ? stepMatch[1].trim().replace(/^>\s*/, '').split('\n')[0]
      : '';

    return { name: path.basename(f, '.md'), date, goal, nextStep };
  });

  // Сортируем: сначала самый свежий (по дате из файла)
  projects.sort((a, b) => {
    if (a.date === '—') return 1;
    if (b.date === '—') return -1;
    return b.date.localeCompare(a.date);
  });

  // Иконки для специальных режимов
  const icons = {
    'promt':          '✍️',
    'codechief':      '🤖',
    'khram-spas':     '⛪',
    'avatar':         '💳',
    'studio-cabinet': '🎬',
    'claudteacher':   '🧑‍🏫',
  };

  const lines = projects.map((p, i) => {
    const icon = icons[p.name] || '📁';
    let line = `  ${i + 1}. ${icon} **${p.name}** (обновлён ${p.date})`;
    if (p.goal)     line += `\n     📌 ${p.goal}`;
    if (p.nextStep) line += `\n     ➡️  ${p.nextStep}`;
    return line;
  }).join('\n\n');

  const output = [
    '---',
    '🗂 **Handoff-система | Выбери проект:**',
    '',
    lines,
    '',
    `  ${projects.length + 1}. 🆕 Новый проект`,
    '',
    '👉 Напиши номер или название — загружу контекст и начнём.',
    '---'
  ].join('\n');

  console.log(output);

} catch (e) {
  // Тихий сбой — не мешаем сессии
  process.exit(0);
}
