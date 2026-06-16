# Установка автосинхронизации handoff-файлов
# Запустить один раз в PowerShell на машине отца Серафима

$claudeDir = "$env:USERPROFILE\.claude"
$hooksDir = "$claudeDir\hooks"
$handoffDir = "$claudeDir\handoff"
$settingsFile = "$claudeDir\settings.json"
$repoUrl = "https://github.com/skvortsovproduction2020-sudo/claude-config.git"
$nodeExe = "C:\Program Files\nodejs\node.exe"

Write-Host "=== Настройка синхронизации handoff ===" -ForegroundColor Cyan

# 1. Создать папки если нет
New-Item -ItemType Directory -Force -Path $hooksDir | Out-Null
New-Item -ItemType Directory -Force -Path $handoffDir | Out-Null

# 2. Инициализировать git в .claude если ещё нет
if (-not (Test-Path "$claudeDir\.git")) {
    git -C $claudeDir init
    Write-Host "✅ Git инициализирован" -ForegroundColor Green
}

# 3. Добавить remote если ещё нет
$remotes = git -C $claudeDir remote 2>&1
if ($remotes -notcontains "claude-handoff") {
    git -C $claudeDir remote add claude-handoff $repoUrl
    Write-Host "✅ Remote добавлен" -ForegroundColor Green
}

# 4. Скачать handoff-файлы
Write-Host "⬇️  Скачиваю handoff-файлы..." -ForegroundColor Yellow
git -C $claudeDir fetch claude-handoff main 2>&1
git -C $claudeDir checkout claude-handoff/main -- handoff/ 2>&1
git -C $claudeDir checkout claude-handoff/main -- "hooks/handoff-pull.js" 2>&1
Write-Host "✅ Handoff-файлы получены" -ForegroundColor Green

# 5. Добавить SessionStart хук в settings.json
if (Test-Path $settingsFile) {
    $settings = Get-Content $settingsFile -Raw | ConvertFrom-Json
} else {
    $settings = [PSCustomObject]@{ hooks = [PSCustomObject]@{} }
}

$hookCommand = "`"$nodeExe`" `"$hooksDir\handoff-pull.js`""
$newHook = [PSCustomObject]@{
    hooks = @(
        [PSCustomObject]@{
            type    = "command"
            command = $hookCommand
            timeout = 15
        }
    )
}

if (-not $settings.hooks.SessionStart) {
    $settings.hooks | Add-Member -NotePropertyName SessionStart -NotePropertyValue @($newHook)
} else {
    $settings.hooks.SessionStart += $newHook
}

$settings | ConvertTo-Json -Depth 10 | Set-Content $settingsFile -Encoding utf8
Write-Host "✅ Хук SessionStart добавлен в settings.json" -ForegroundColor Green

Write-Host ""
Write-Host "=== Готово! ===" -ForegroundColor Cyan
Write-Host "При каждом старте Claude Code handoff-файлы будут обновляться автоматически." -ForegroundColor White
