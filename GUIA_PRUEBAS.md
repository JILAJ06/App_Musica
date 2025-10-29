# 🧪 Guía de Pruebas - Conexión API Spotify

## ✅ Pruebas para Verificar la Conexión

### 1️⃣ Verificar Token en Consola del Navegador

1. Abre la aplicación en http://localhost:4200
2. Presiona **F12** para abrir DevTools
3. Ve a la pestaña **Console**
4. Deberías ver:
   ```
   ✅ Token de Spotify obtenido correctamente
   ```

**¿Qué significa?**
- ✅ Si ves el mensaje: La autenticación funcionó
- ❌ Si ves un error: Hay un problema con las credenciales

---

### 2️⃣ Verificar Indicador Visual

1. Haz clic en **"Buscar"** en la navegación
2. En la parte superior debería aparecer:
   ```
   🟢 API Conectada
   ```

**¿Qué significa?**
- ✅ Punto verde parpadeante: API lista para usar
- ❌ No aparece: La API aún se está conectando

---

### 3️⃣ Hacer una Búsqueda de Prueba

1. En el campo de búsqueda, escribe: **"Imagine Dragons"**
2. Haz clic en **"🔍 Buscar"** o presiona **Enter**
3. Deberías ver:
   - Spinner de carga
   - Mensaje "Buscando..."
   - Resultados con imágenes de álbumes

**Pruebas adicionales:**
- Busca: "The Beatles"
- Busca: "Taylor Swift"
- Busca: "Bad Bunny"

**Resultados esperados:**
- ✅ Aparecen 20 canciones por búsqueda
- ✅ Cada canción tiene imagen, nombre, artista y álbum
- ✅ Puedes hacer clic en cualquier canción

---

### 4️⃣ Verificar Detalles de Canción

1. Después de buscar, haz clic en **cualquier canción**
2. Deberías ser redirigido a la página principal
3. La canción debería aparecer:
   - En el panel izquierdo (grande)
   - En la playlist derecha

**¿Qué significa?**
- ✅ Funciona: Los datos se están cargando correctamente desde Spotify

---

### 5️⃣ Verificar en Network Tab

1. Abre DevTools (F12)
2. Ve a la pestaña **Network**
3. Haz una búsqueda
4. Deberías ver peticiones a:
   ```
   https://accounts.spotify.com/api/token
   https://api.spotify.com/v1/search
   ```

**Analiza las respuestas:**
- ✅ Status 200: Éxito
- ❌ Status 401: Error de autenticación
- ❌ Status 429: Demasiadas peticiones

---

## 🐛 Solución de Problemas Comunes

### ❌ Error: "Invalid client credentials"

**Causa:** Las credenciales en `environment.ts` son incorrectas.

**Solución:**
1. Abre `src/environments/environment.ts`
2. Verifica que:
   ```typescript
   clientId: '794acf82b75f4875bbc3b832e1f9f1e0'
   clientSecret: 'bcbd1c2a2eff4413bc0f715a9d1e0eae'
   ```
3. Asegúrate de que no hay espacios extra
4. Reinicia el servidor: `Ctrl+C` → `npm start`

---

### ❌ Error: CORS / No 'Access-Control-Allow-Origin'

**Causa:** Esto es normal con Client Credentials Flow desde el navegador.

**Solución:**
- No te preocupes, es un warning esperado
- Las búsquedas deberían funcionar igual
- El token se obtiene correctamente

---

### ❌ No aparecen resultados

**Posibles causas:**

1. **Token no obtenido aún**
   - Espera 2-3 segundos después de cargar la página
   - Verifica el mensaje verde "API Conectada"

2. **Búsqueda vacía**
   - Asegúrate de escribir algo en el campo

3. **Problema de red**
   - Verifica tu conexión a Internet
   - Verifica en Network tab si las peticiones se están haciendo

---

### ❌ Error 401 - Unauthorized

**Causa:** Token inválido o expirado.

**Solución:**
1. Refresca la página (F5)
2. El token se renovará automáticamente
3. Si persiste, verifica las credenciales

---

### ❌ Error 429 - Too Many Requests

**Causa:** Has hecho demasiadas búsquedas muy rápido.

**Solución:**
1. Espera 30 segundos
2. Intenta de nuevo
3. Spotify tiene límites de peticiones por minuto

---

## 📊 Comandos de Debugging en Consola

Abre la consola del navegador (F12) y prueba estos comandos:

### Verificar estado del servicio:
```javascript
// En la consola del navegador, después de buscar algo
// Verifica si hay errores en Network tab
```

### Ver token actual (en ambiente de desarrollo):
```javascript
// El servicio imprime automáticamente el estado
// Busca mensajes con ✅ o ❌ en la consola
```

---

## ✅ Checklist de Verificación Completa

Marca cada ítem cuando lo hayas verificado:

- [ ] ✅ Mensaje "Token obtenido correctamente" en consola
- [ ] 🟢 Indicador "API Conectada" visible en búsqueda
- [ ] 🔍 Búsqueda de "Imagine Dragons" retorna resultados
- [ ] 🖼️ Las imágenes de álbumes se cargan correctamente
- [ ] 🎵 Al hacer clic en una canción, se agrega a la playlist
- [ ] 📊 En Network tab aparecen peticiones exitosas (200)
- [ ] 🔄 Puedes hacer múltiples búsquedas sin errores
- [ ] 📱 La interfaz se ve moderna con efectos glassmórficos

---

## 🎉 Todo Funciona Correctamente

Si todos los checks están marcados, **¡tu aplicación está 100% funcional!**

### Puedes:
- 🔍 Buscar cualquier canción de Spotify
- 📋 Crear tu propia playlist
- 🎵 Ver información completa de cada track
- ✨ Disfrutar de la interfaz moderna

---

## 📞 ¿Necesitas Ayuda?

Si encuentras algún error que no está en esta guía:

1. **Copia el mensaje de error completo** de la consola
2. **Toma una captura** de la pestaña Network
3. **Verifica** que el servidor esté corriendo (npm start)
4. **Revisa** que las credenciales en `environment.ts` sean correctas

---

**¡Disfruta de tu aplicación de música!** 🎧🎶
