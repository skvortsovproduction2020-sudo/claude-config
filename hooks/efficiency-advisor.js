/**
 * efficiency-advisor.js
 * PostToolUse hook — следит за паттернами работы и даёт советы по эффективности
 *
 * Срабатывает после: Edit, Write, Bash, MultiEdit
 */

const fs   = require('fs');
const path = require('path');

const STATE_FILE = path.join(process.env.USERPROFILE || 'C:/Users/89117', '.claude', 'efficiency-state.json');

// Читаем входные данные от Claude Code
let raw = '';
process.stdin.on('data', chunk => raw += chunk);
process.stdin.on('end', () => {
  try {
    const data     = JSON.parse(raw || '{}');
    const toolName = data.tool_name || '';
    const toolIn   = data.tool_input || {};

    // Загружаем состояние
    let state = { editCount: {}, totalEdits: 0, sessionStart: Date.now(), lastSuggestion: 0 };
    try {
      if (fs.existsSync(STATE_FILE)) {
        state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
      }
    } catch (e) {}

    const EDIT_TOOLS = ['Edit', 'Write', 'MultiEdit'];
    let suggestion   = null;

    // ── Трекинг редактирований файлов ──────────────────────────────────────
    if (EDIT_TOOLS.includes(toolName)) {
      const filePath = toolIn.file_path || '';
      const base     = filePath ? path.basename(filePath) : '(файл)';

      if (filePath) {
        state.editCount[filePath] = (state.editCount[filePath] || 0) + 1;
        const count = state.editCount[filePath];

        // Один файл редактируется слишком много раз подряд
        if (count === 4) {
          suggestion = `💡 **Эффективность:** \`${base}\` редактируется уже ${count} раза. Если что-то не идёт — остановись и опиши проблему заново с нуля.`;
        }
        if (count === 8) {
          suggestion = `⚠️ **Внимание:** \`${base}\` редактировался ${count} раз. Похоже на зацикливание. Попробуй: "Объясни что именно не работает и почему" — и начни свежий подход.`;
        }
      }

      state.totalEdits++;
    }

    // ── Напоминание о handoff каждые 15 правок ──────────────────────────────
    if (
      state.totalEdits > 0 &&
      state.totalEdits % 15 === 0 &&
      state.totalEdits !== state.lastSuggestion
    ) {
      suggestion = `📋 **Напоминание:** ${state.totalEdits} действий в сессии. Скажи **"обнови handoff"** чтобы сохранить прогресс перед продолжением.`;
      state.lastSuggestion = state.totalEdits;
    }

    // ── Bash: повторяющиеся команды ─────────────────────────────────────────
    if (toolName === 'Bash') {
      const cmd = (toolIn.command || '').toLowerCase();
      state.bashCount = state.bashCount || {};

      // Ключ = первые 40 символов команды (игнорируем аргументы)
      const cmdKey = cmd.substring(0, 40);
      state.bashCount[cmdKey] = (state.bashCount[cmdKey] || 0) + 1;

      if (state.bashCount[cmdKey] === 3) {
        suggestion = `💡 **Эффективность:** Одна и та же команда выполняется уже 3 раза. Возможно стоит автоматизировать или пересмотреть подход?`;
      }
    }

    // ── Сохраняем состояние ─────────────────────────────────────────────────
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));

    // Выводим совет (если есть)
    if (suggestion) {
      console.log('\n' + suggestion + '\n');
    }

    process.exit(0);

  } catch (e) {
    process.exit(0);
  }
});
