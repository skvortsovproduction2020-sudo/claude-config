const https = require('https')
const TOKEN = '8444026221:AAHmsxaCPbnnW-LCMRD9jKgZR9TvhwuvM34'
const CHAT_ID = '498108685'

let input = ''
process.stdin.on('data', d => input += d)
process.stdin.on('end', () => {
  let hookData = {}
  try { hookData = JSON.parse(input) } catch {}

  const text = `✅ Claude завершил задачу\n📁 ${hookData.cwd || 'studio'}`

  const body = JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: 'HTML' })
  const req = https.request({
    hostname: 'api.telegram.org',
    path: `/bot${TOKEN}/sendMessage`,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
  })
  req.write(body)
  req.end()
})
