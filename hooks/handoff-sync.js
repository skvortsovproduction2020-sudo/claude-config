#!/usr/bin/env node
// Auto-sync handoff files to GitHub after every Write/Edit

const { execSync } = require('child_process');

let input = '';
process.stdin.on('data', chunk => (input += chunk));
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    const filePath = (data.tool_input?.file_path || '').replace(/\\/g, '/');

    if (!filePath.includes('.claude/handoff/')) return;

    const repo = 'C:/Users/89117/.claude';

    execSync(`git -C "${repo}" add handoff/*.md`, { stdio: 'pipe' });

    const changed = execSync(`git -C "${repo}" diff --cached --name-only`, {
      encoding: 'utf8',
    }).trim();

    if (!changed) return;

    const filename = filePath.split('/').pop();
    const date = new Date().toISOString().slice(0, 16).replace('T', ' ');
    execSync(`git -C "${repo}" commit -m "auto: ${filename} ${date}"`, { stdio: 'pipe' });
    execSync(`git -C "${repo}" push origin main`, { stdio: 'pipe' });
  } catch (_) {
    // Silent — не блокировать Claude
  }
});
