# Port Connection Checker Script
# Run this to verify all services are running on correct ports

Write-Host "🔍 Checking Port Connections..." -ForegroundColor Cyan
Write-Host ""

# Check Port 8800 - Parlant Server
Write-Host "1. Parlant Server (Port 8800):" -ForegroundColor Yellow
$parlant = Get-NetTCPConnection -LocalPort 8800 -State Listen -ErrorAction SilentlyContinue
if ($parlant) {
    Write-Host "   ✅ Port 8800 is LISTENING" -ForegroundColor Green
    Write-Host "   Process ID: $($parlant.OwningProcess)" -ForegroundColor Gray
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8800" -TimeoutSec 2 -ErrorAction Stop
        Write-Host "   ✅ Server is responding" -ForegroundColor Green
    } catch {
        Write-Host "   ⚠️  Server may still be initializing" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ❌ Port 8800 is NOT listening" -ForegroundColor Red
    Write-Host "   → Start: cd parlant; uv run parlant_agent_server.py" -ForegroundColor Gray
}
Write-Host ""

# Check Port 5000 - FastAPI Backend
Write-Host "2. FastAPI Backend (Port 5000):" -ForegroundColor Yellow
$fastapi = Get-NetTCPConnection -LocalPort 5000 -State Listen -ErrorAction SilentlyContinue
if ($fastapi) {
    Write-Host "   ✅ Port 5000 is LISTENING" -ForegroundColor Green
    Write-Host "   Process ID: $($fastapi.OwningProcess)" -ForegroundColor Gray
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -TimeoutSec 2 -ErrorAction Stop
        $data = $response.Content | ConvertFrom-Json
        Write-Host "   ✅ API is responding" -ForegroundColor Green
        Write-Host "   Status: $($data.status)" -ForegroundColor Gray
        Write-Host "   Parlant Ready: $($data.parlant_ready)" -ForegroundColor Gray
    } catch {
        Write-Host "   ⚠️  API endpoint error: $($_.Exception.Message)" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ❌ Port 5000 is NOT listening" -ForegroundColor Red
    Write-Host "   → Start: cd backend; uv run api_server.py" -ForegroundColor Gray
}
Write-Host ""

# Check Port 3300 - Next.js Frontend
Write-Host "3. Next.js Frontend (Port 3300):" -ForegroundColor Yellow
$frontend = Get-NetTCPConnection -LocalPort 3300 -State Listen -ErrorAction SilentlyContinue
if ($frontend) {
    Write-Host "   ✅ Port 3300 is LISTENING" -ForegroundColor Green
    Write-Host "   Process ID: $($frontend.OwningProcess)" -ForegroundColor Gray
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3300" -TimeoutSec 2 -ErrorAction Stop
        Write-Host "   ✅ Frontend is responding" -ForegroundColor Green
    } catch {
        Write-Host "   ⚠️  Frontend may still be compiling" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ❌ Port 3300 is NOT listening" -ForegroundColor Red
    Write-Host "   → Start: cd frontend; npm run dev" -ForegroundColor Gray
}
Write-Host ""

# Check agent_id.txt
Write-Host "4. Parlant Agent ID:" -ForegroundColor Yellow
$agentIdPath = "parlant/parlant-data/agent_id.txt"
if (Test-Path $agentIdPath) {
    $agentId = Get-Content $agentIdPath -Raw
    Write-Host "   ✅ agent_id.txt exists" -ForegroundColor Green
    Write-Host "   Agent ID: $($agentId.Trim())" -ForegroundColor Gray
} else {
    Write-Host "   ❌ agent_id.txt NOT found" -ForegroundColor Red
    Write-Host "   → Start Parlant server first to generate it" -ForegroundColor Gray
}
Write-Host ""

# Summary
Write-Host "📊 Summary:" -ForegroundColor Cyan
$allRunning = ($parlant -ne $null) -and ($fastapi -ne $null) -and ($frontend -ne $null)
if ($allRunning) {
    Write-Host "   ✅ All services are running!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Access Points:" -ForegroundColor Cyan
    Write-Host "   Frontend: http://localhost:3300" -ForegroundColor White
    Write-Host "   API Docs: http://localhost:5000/docs" -ForegroundColor White
    Write-Host "   Health:   http://localhost:5000/api/health" -ForegroundColor White
    Write-Host "   Parlant:  http://localhost:8800" -ForegroundColor White
} else {
    Write-Host "   ⚠️  Some services are not running" -ForegroundColor Yellow
    Write-Host "   Check the messages above for details" -ForegroundColor Gray
}

