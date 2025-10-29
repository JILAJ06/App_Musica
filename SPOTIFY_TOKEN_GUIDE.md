# Cómo obtener un Token de Acceso de Spotify

## Método 1: Uso de la Consola de Spotify (Rápido - Para desarrollo)

1. Ve a [Spotify Web API Console](https://developer.spotify.com/console/get-search-item/)

2. Haz clic en "GET TOKEN"

3. Selecciona los scopes necesarios (para esta app no necesitas ninguno especial)

4. Haz clic en "REQUEST TOKEN"

5. Copia el token generado

6. Pega el token en `src/app/services/spotify.service.ts`:
   ```typescript
   private accessToken = 'TU_TOKEN_AQUI';
   ```

**Nota**: Este token expira en 1 hora.

---

## Método 2: Client Credentials Flow (Recomendado para desarrollo)

### Paso 1: Crear una aplicación en Spotify

1. Ve a [Spotify Dashboard](https://developer.spotify.com/dashboard)
2. Inicia sesión con tu cuenta de Spotify
3. Haz clic en "Create app"
4. Completa el formulario:
   - **App name**: Mi App de Música
   - **App description**: App de reproductor de música
   - **Redirect URI**: http://localhost:4200
5. Acepta los términos y haz clic en "Save"
6. Guarda tu **Client ID** y **Client Secret**

### Paso 2: Obtener el token con cURL (Windows PowerShell)

Abre PowerShell y ejecuta:

```powershell
$client_id = "TU_CLIENT_ID"
$client_secret = "TU_CLIENT_SECRET"
$credentials = "$client_id:$client_secret"
$encodedCredentials = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes($credentials))

$headers = @{
    "Authorization" = "Basic $encodedCredentials"
    "Content-Type" = "application/x-www-form-urlencoded"
}

$body = "grant_type=client_credentials"

$response = Invoke-RestMethod -Uri "https://accounts.spotify.com/api/token" -Method Post -Headers $headers -Body $body

Write-Host "Token de acceso:"
Write-Host $response.access_token
```

### Paso 3: Usar el token

Copia el token generado y pégalo en `src/app/services/spotify.service.ts`:

```typescript
private accessToken = 'PEGA_TU_TOKEN_AQUI';
```

---

## Método 3: Usando Node.js

Crea un archivo `get-token.js`:

```javascript
const clientId = 'TU_CLIENT_ID';
const clientSecret = 'TU_CLIENT_SECRET';

const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

fetch('https://accounts.spotify.com/api/token', {
  method: 'POST',
  headers: {
    'Authorization': `Basic ${credentials}`,
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: 'grant_type=client_credentials'
})
.then(response => response.json())
.then(data => {
  console.log('Token de acceso:');
  console.log(data.access_token);
})
.catch(error => console.error('Error:', error));
```

Ejecuta:
```bash
node get-token.js
```

---

## Método 4: Directamente con fetch en el navegador

1. Ve a [Spotify Accounts](https://accounts.spotify.com/api/token)

2. Abre la consola del navegador (F12)

3. Ejecuta:

```javascript
const clientId = 'TU_CLIENT_ID';
const clientSecret = 'TU_CLIENT_SECRET';
const credentials = btoa(`${clientId}:${clientSecret}`);

fetch('https://accounts.spotify.com/api/token', {
  method: 'POST',
  headers: {
    'Authorization': `Basic ${credentials}`,
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: 'grant_type=client_credentials'
})
.then(r => r.json())
.then(data => console.log('Token:', data.access_token));
```

---

## Renovación automática del token (Para producción)

Para implementar renovación automática, modifica el servicio de Spotify:

```typescript
export class SpotifyService {
  private clientId = 'TU_CLIENT_ID';
  private clientSecret = 'TU_CLIENT_SECRET';
  private accessToken: string = '';
  private tokenExpiry: number = 0;

  constructor(private http: HttpClient) {
    this.refreshToken();
  }

  private refreshToken(): void {
    const credentials = btoa(`${this.clientId}:${this.clientSecret}`);
    const headers = new HttpHeaders({
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    this.http.post('https://accounts.spotify.com/api/token', 
      'grant_type=client_credentials',
      { headers }
    ).subscribe((response: any) => {
      this.accessToken = response.access_token;
      this.tokenExpiry = Date.now() + (response.expires_in * 1000);
      
      // Renovar automáticamente antes de que expire
      setTimeout(() => this.refreshToken(), (response.expires_in - 60) * 1000);
    });
  }
}
```

---

## Solución de problemas

### Error CORS
Si obtienes errores de CORS al intentar obtener el token desde el navegador, usa uno de estos métodos:
- Método 1: Consola de Spotify (más fácil)
- Método 2: PowerShell o terminal
- Método 3: Node.js

### Token inválido
- Verifica que hayas copiado el token completo
- Asegúrate de que no haya espacios adicionales
- El token expira cada hora, genera uno nuevo

### 401 Unauthorized
- Verifica tu Client ID y Client Secret
- Asegúrate de que tu app esté activa en el Dashboard de Spotify

---

## Tokens de ejemplo (NO FUNCIONAN - solo para referencia)

Los tokens tienen este formato:
```
BQBxxx...xxxyyy (aproximadamente 200 caracteres)
```

**NUNCA** compartas tus tokens o credenciales en repositorios públicos.
