/**
 * secret-scanner.js
 * PreToolUse hook — блокирует запись файла если в содержимом обнаружены секреты.
 *
 * Срабатывает на: Write, Edit
 * Exit 2 = блокировка действия + сообщение пользователю
 */

const path = require('path');

// Паттерны секретов с описанием
const SECRET_PATTERNS = [
  { regex: /sk-ant-api[0-9]{2}-[A-Za-z0-9_-]{90,}/,  label: 'Anthropic API Key' },
  { regex: /ghp_[A-Za-z0-9]{36,}/,                    label: 'GitHub Personal Access Token' },
  { regex: /rnd_[A-Za-z0-9]{20,}/,                    label: 'Render API Key' },
  { regex: /sbp_[a-f0-9]{40}/,                        label: 'Supabase PAT' },
  { regex: /eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.eyJpc3MiOiJzdXBhYmFzZSI/,  label: 'Supabase JWT (service/anon key)' },
  { regex: /\d{9,10}:AA[A-Za-z0-9_-]{33,}/,           label: 'Telegram Bot Token' },
];

// Папки где секреты хранить РАЗРЕШЕНО
const ALLOWED_DIRS = [
  path.join(process.env.USERPROFILE || 'C:/Users/89117', '.claude', 'secrets'),
];

let raw = '';
process.stdin.on('data', chunk => raw += chunk);
process.stdin.on('end', () => {
  try {
    const data     = JSON.parse(raw || '{}');
    const toolName = data.tool_name || '';
    const toolIn   = data.tool_input || {};

    // Определяем текст для проверки и путь файла
    let content  = '';
    let filePath = '';

    if (toolName === 'Write') {
      content  = toolIn.content  || '';
      filePath = toolIn.file_path || '';
    } else if (toolName === 'Edit') {
      content  = toolIn.new_string || '';
      filePath = toolIn.file_path  || '';
    } else {
      process.exit(0);
    }

    // Пропускаем разрешённые папки (secrets)
    const absPath = path.resolve(filePath);
    const inAllowed = ALLOWED_DIRS.some(dir => absPath.startsWith(path.resolve(dir)));
    if (inAllowed) {
      process.exit(0);
    }

    // Проверяем на секреты
    const found = SECRET_PATTERNS.filter(p => p.regex.test(content));

    if (found.length > 0) {
      const labels = found.map(p => `  • ${p.label}`).join('\n');
      console.error(
        `\n🚨 БЛОКИРОВКА — обнаружены секреты в файле: ${path.basename(filePath)}\n` +
        `${labels}\n\n` +
        `Секреты нельзя хранить в коде или handoff-файлах.\n` +
        `Положи их в: C:\\Users\\89117\\.claude\\secrets\\<проект>.env\n`
      );
      process.exit(2); // exit 2 = блокировка + показ сообщения
    }

    process.exit(0);

  } catch (e) {
    process.exit(0); // тихий сбой — не мешаем работе
  }
});
