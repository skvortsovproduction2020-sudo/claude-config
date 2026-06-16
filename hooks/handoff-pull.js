#!/usr/bin/env node
// Pulls latest handoff files from GitHub at session start
// Устанавливается на машине отца Серафима

const { execSync } = require('child_process');
const path = require('path');
const os = require('os');

const claudeDir = path.join(os.homedir(), '.claude');
const REPO_URL = 'https://github.com/skvortsovproduction2020-sudo/claude-config.git';

try {
  // Проверяем, есть ли git remote в .claude
  const remotes = execSync(`git -C "${claudeDir}" remote -v 2>&1`, { encoding: 'utf8' });

  if (!remotes.includes('claude-config')) {
    // Первый запуск: добавляем remote если ещё нет
    execSync(`git -C "${claudeDir}" remote add claude-handoff ${REPO_URL}`, { stdio: 'pipe' });
  }

  // Скачиваем только папку handoff/
  execSync(`git -C "${claudeDir}" fetch claude-handoff main`, { stdio: 'pipe' });
  execSync(`git -C "${claudeDir}" checkout claude-handoff/main -- handoff/`, { stdio: 'pipe' });

  console.log('✅ Handoff синхронизирован с GitHub');
} catch (e) {
  // Не блокировать сессию при ошибке
  console.log('⚠️ Handoff sync пропущен:', e.message?.slice(0, 80));
}
