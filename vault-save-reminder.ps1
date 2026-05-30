$timestampFile = "C:\Users\89117\ObsidianStudioCabinet\.last-save"
$oneHour = 3600
$now = [int][DateTimeOffset]::UtcNow.ToUnixTimeSeconds()

if (Test-Path $timestampFile) {
    $lastSave = [int](Get-Content $timestampFile -Raw).Trim()
    $elapsed = $now - $lastSave
    if ($elapsed -gt $oneHour) {
        $mins = [int]($elapsed / 60)
        Write-Output "{""systemMessage"": ""Прошло $mins мин с последнего сохранения vault. Скажи 'сохрани сессию' чтобы зафиксировать прогресс.""}"
    }
} else {
    Set-Content -Path $timestampFile -Value $now -Encoding utf8
}
