# 🎵 Configuración de la API de Spotify

## ✅ Estado Actual
Tu aplicación ya está configurada con las credenciales de Spotify:

- **Client ID**: `794acf82b75f4875bbc3b832e1f9f1e0`
- **Client Secret**: `bcbd1c2a2eff4413bc0f715a9d1e0eae`
- **Redirect URI**: `http://127.0.0.1:4200/callback`

## 🚀 Cómo Funciona

La aplicación usa el flujo **Client Credentials Flow** de Spotify:

1. Al iniciar el servicio `SpotifyService`, automáticamente se obtiene un token de acceso
2. Este token se renueva automáticamente cuando expira (cada 1 hora)
3. Todas las peticiones a la API incluyen el token en los headers

## 📝 Archivos Configurados

### 1. `src/environments/environment.ts`
Contiene las credenciales para desarrollo:
```typescript
export const environment = {
  production: false,
  spotify: {
    clientId: '794acf82b75f4875bbc3b832e1f9f1e0',
    clientSecret: 'bcbd1c2a2eff4413bc0f715a9d1e0eae',
    redirectUri: 'http://127.0.0.1:4200/callback'
  }
};
```

### 2. `src/app/services/spotify.service.ts`
Servicio actualizado que:
- Obtiene el token automáticamente al iniciar
- Usa `HttpParams` para las búsquedas
- Renueva el token cuando expira
- Gestiona errores de autenticación

## 🔧 Uso de la API

### Buscar Canciones
```typescript
this.spotifyService.searchTracks('Imagine Dragons').subscribe(tracks => {
  console.log(tracks);
});
```

### Obtener Detalles de una Canción
```typescript
this.spotifyService.getTrack('trackId').subscribe(track => {
  console.log(track);
});
```

## ⚠️ Limitaciones del Client Credentials Flow

Este flujo NO permite:
- ❌ Reproducir música
- ❌ Acceder a playlists del usuario
- ❌ Modificar la biblioteca del usuario

Este flujo SÍ permite:
- ✅ Buscar canciones
- ✅ Obtener información de canciones
- ✅ Obtener información de artistas
- ✅ Obtener información de álbumes

## 🔒 Seguridad

**IMPORTANTE**: Las credenciales están en archivos locales. Para producción:

1. ❌ **NO subas las credenciales a GitHub**
2. ✅ **Usa variables de entorno del servidor**
3. ✅ **Implementa un backend que maneje la autenticación**

## 🧪 Probar la Conexión

1. Inicia el servidor de desarrollo:
```bash
npm start
```

2. Abre la consola del navegador (F12)
3. Deberías ver: `✅ Token de Spotify obtenido correctamente`
4. Busca una canción para probar la API

## 📚 Documentación

- [Spotify Web API](https://developer.spotify.com/documentation/web-api)
- [Client Credentials Flow](https://developer.spotify.com/documentation/general/guides/authorization/client-credentials/)
- [API Reference](https://developer.spotify.com/documentation/web-api/reference/)

## 🐛 Solución de Problemas

### Error: "Invalid client credentials"
- Verifica que el Client ID y Client Secret sean correctos
- Asegúrate de que la app esté en modo Development en Spotify Dashboard

### Error: CORS
- El Client Credentials Flow no requiere Redirect URI para búsquedas
- Si ves errores CORS, es porque estás usando un endpoint que requiere autenticación de usuario

### Error: "Token expired"
- El servicio renueva el token automáticamente
- Si persiste, recarga la aplicación

## 🎉 ¡Todo Listo!

Tu aplicación está configurada y lista para usar la API de Spotify. Simplemente inicia el servidor y comienza a buscar música.
