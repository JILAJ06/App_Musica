# Script para obtener token de Spotify
# Uso: .\get-spotify-token.ps1

Write-Host "=== Obtener Token de Spotify ===" -ForegroundColor Cyan
Write-Host ""

# Solicitar credenciales
$client_id = Read-Host "Ingresa tu Client ID de Spotify"
$client_secret = Read-Host "Ingresa tu Client Secret de Spotify" -AsSecureString
$client_secret_plain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($client_secret)
)

Write-Host ""
Write-Host "Obteniendo token..." -ForegroundColor Yellow

try {
    # Crear credenciales en Base64
    $credentials = "$client_id:$client_secret_plain"
    $encodedCredentials = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes($credentials))

    # Configurar headers
    $headers = @{
        "Authorization" = "Basic $encodedCredentials"
        "Content-Type" = "application/x-www-form-urlencoded"
    }

    # Hacer la petición
    $body = "grant_type=client_credentials"
    $response = Invoke-RestMethod -Uri "https://accounts.spotify.com/api/token" -Method Post -Headers $headers -Body $body

    Write-Host ""
    Write-Host "¡Éxito! Token obtenido:" -ForegroundColor Green
    Write-Host ""
    Write-Host $response.access_token -ForegroundColor White
    Write-Host ""
    Write-Host "Expira en: $($response.expires_in) segundos ($($response.expires_in / 60) minutos)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Ahora copia este token y pégalo en:" -ForegroundColor Cyan
    Write-Host "src/app/services/spotify.service.ts" -ForegroundColor White
    Write-Host ""

    # Opcional: copiar al portapapeles
    $response.access_token | Set-Clipboard
    Write-Host "✓ El token ha sido copiado al portapapeles" -ForegroundColor Green
}
catch {
    Write-Host ""
    Write-Host "Error al obtener el token:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "Verifica que tus credenciales sean correctas" -ForegroundColor Yellow
}

Write-Host ""
Read-Host "Presiona Enter para salir"
