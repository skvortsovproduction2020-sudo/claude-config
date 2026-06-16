#!/bin/bash
# Установка автосинхронизации handoff-файлов (Mac)
# Запустить один раз в Terminal:
# curl -s https://raw.githubusercontent.com/skvortsovproduction2020-sudo/claude-config/main/handoff/setup-serafim-mac.sh | bash

set -e

CLAUDE_DIR="$HOME/.claude"
HOOKS_DIR="$CLAUDE_DIR/hooks"
HANDOFF_DIR="$CLAUDE_DIR/handoff"
SETTINGS_FILE="$CLAUDE_DIR/settings.json"
REPO_URL="https://github.com/skvortsovproduction2020-sudo/claude-config.git"

echo "=== Настройка синхронизации handoff ==="

# 1. Создать папки если нет
mkdir -p "$HOOKS_DIR"
mkdir -p "$HANDOFF_DIR"

# 2. Инициализировать git в .claude если ещё нет
if [ ! -d "$CLAUDE_DIR/.git" ]; then
    git -C "$CLAUDE_DIR" init
    echo "✅ Git инициализирован"
fi

# 3. Добавить remote если ещё нет
if ! git -C "$CLAUDE_DIR" remote | grep -q "claude-handoff"; then
    git -C "$CLAUDE_DIR" remote add claude-handoff "$REPO_URL"
    echo "✅ Remote добавлен"
fi

# 4. Скачать handoff-файлы
echo "⬇️  Скачиваю handoff-файлы..."
git -C "$CLAUDE_DIR" fetch claude-handoff main 2>&1
git -C "$CLAUDE_DIR" checkout claude-handoff/main -- handoff/ 2>&1
git -C "$CLAUDE_DIR" checkout claude-handoff/main -- hooks/handoff-pull.js 2>&1
echo "✅ Handoff-файлы получены"

# 5. Найти node
NODE_PATH=$(which node 2>/dev/null || echo "/usr/local/bin/node")
echo "✅ Node.js: $NODE_PATH"

# 6. Добавить SessionStart хук в settings.json
HOOK_COMMAND="$NODE_PATH $HOOKS_DIR/handoff-pull.js"

if [ ! -f "$SETTINGS_FILE" ]; then
    echo '{"hooks":{}}' > "$SETTINGS_FILE"
fi

# Проверить есть ли уже хук (удалить старый если неправильный)
if grep -q "handoff-pull.js" "$SETTINGS_FILE" 2>/dev/null; then
    echo "⚠️  Удаляю старый хук и перезаписываю..."
fi

# Добавить SessionStart хук через python3 (есть на всех Mac)
python3 - "$SETTINGS_FILE" "$HOOK_COMMAND" <<'PYEOF'
import json, sys

settings_file = sys.argv[1]
hook_cmd = sys.argv[2]

with open(settings_file, "r") as f:
    settings = json.load(f)

if "hooks" not in settings:
    settings["hooks"] = {}

# Убрать старые handoff хуки чтобы не дублировались
sessions = settings["hooks"].get("SessionStart", [])
sessions = [h for h in sessions if "handoff-pull" not in str(h)]

sessions.append({
    "hooks": [{
        "type": "command",
        "command": hook_cmd,
        "timeout": 15
    }]
})

settings["hooks"]["SessionStart"] = sessions

with open(settings_file, "w") as f:
    json.dump(settings, f, indent=2, ensure_ascii=False)

print("✅ Хук SessionStart добавлен в settings.json")
PYEOF

echo ""
echo "=== Готово! ==="
echo "При каждом старте Claude Code handoff-файлы будут обновляться автоматически."
echo ""
echo "Handoff-файлы в: $HANDOFF_DIR"
ls "$HANDOFF_DIR"/*.md 2>/dev/null | xargs -I{} basename {} || true
