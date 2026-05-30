const fs = require('fs')
const path = require('path')

const timestampFile = 'C:\\Users\\89117\\ObsidianStudioCabinet\\.last-save'
const oneHour = 3600
const now = Math.floor(Date.now() / 1000)

try {
  if (fs.existsSync(timestampFile)) {
    const lastSave = parseInt(fs.readFileSync(timestampFile, 'utf8').trim(), 10)
    const elapsed = now - lastSave
    if (elapsed > oneHour) {
      const mins = Math.floor(elapsed / 60)
      console.log(JSON.stringify({
        systemMessage: `Прошло ${mins} мин с последнего сохранения vault. Скажи 'сохрани сессию' чтобы зафиксировать прогресс.`
      }))
    }
  } else {
    fs.writeFileSync(timestampFile, String(now), 'utf8')
  }
} catch (e) {
  // silent fail — never block Claude
}
