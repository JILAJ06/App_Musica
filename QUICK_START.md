# 🎵 Guía Rápida de Uso

## ⚡ Inicio Rápido

### 1. Obtener Token de Spotify

**Opción A - Usando PowerShell Script (Recomendado)**
```powershell
.\get-spotify-token.ps1
```

**Opción B - Manualmente**
1. Ve a https://developer.spotify.com/console/get-search-item/
2. Haz clic en "GET TOKEN"
3. Copia el token generado

### 2. Configurar el Token

Abre `src/app/services/spotify.service.ts` y reemplaza:
```typescript
private accessToken = 'TU_TOKEN_AQUI';
```

### 3. Iniciar la Aplicación

```bash
npm start
```

Abre tu navegador en: http://localhost:4200

---

## 🎮 Cómo Usar la Aplicación

### Página Principal (/)
- **Canción actual**: Se muestra en grande a la izquierda
- **Playlist**: Lista de canciones a la derecha
- **Click en canción de playlist**: Cambia la canción actual
- **Botón X**: Elimina canción de la playlist

### Búsqueda (/search)
- **Escribe** el nombre de una canción, artista o álbum
- **Presiona Enter** o haz clic en "Buscar"
- **Click en una canción**: Se agrega a la playlist y se reproduce

### Detalle de Canción (/track/:id)
- Muestra información detallada de una canción específica
- Usa **Route Params** para obtener el ID desde la URL

---

## 🧭 Navegación

### RouterLink (Navegación declarativa)
```html
<a routerLink="/">Inicio</a>
<a routerLink="/search">Buscar</a>
```

### Navegación Programática
```typescript
this.router.navigate(['/']);
this.router.navigate(['/search']);
this.router.navigate(['/track', trackId]);
```

### Route Params
```typescript
// En la ruta: /track/:id
this.route.params.subscribe(params => {
  const trackId = params['id'];
});
```

### HTTP Params
```typescript
const params = new HttpParams()
  .set('q', query)
  .set('type', 'track')
  .set('limit', '20');
```

---

## 🎨 Estructura de Colores

### Gradientes Principales
- **Fondo**: `linear-gradient(135deg, #0a1929 0%, #1a2980 100%)`
- **Navbar**: `linear-gradient(90deg, #1e3a8a 0%, #1e40af 100%)`
- **Tarjetas**: `linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)`

### Colores de Acento
- **Primario**: `#3b82f6` (Azul brillante)
- **Hover**: `#2563eb` (Azul oscuro)
- **Texto claro**: `#e0e7ff`
- **Texto medio**: `#93c5fd`
- **Texto suave**: `#bfdbfe`

---

## 📊 Datos Mostrados

La aplicación muestra solo estos datos de cada canción:
- ✅ **Nombre de la canción**
- ✅ **Artista(s)**
- ✅ **Álbum**
- ✅ **Imagen del álbum**

**Nota**: NO se reproduce audio real, solo se muestran los datos.

---

## 🔧 Comandos Útiles

```bash
# Iniciar servidor de desarrollo
npm start

# Construir para producción
npm run build

# Ejecutar en modo watch
npm run watch

# Ver versión de Angular
ng version
```

---

## 🚨 Solución de Problemas

### Error: "401 Unauthorized"
- ❌ Token inválido o expirado
- ✅ Genera un nuevo token y actualiza el servicio

### Error: "CORS"
- ❌ No puedes hacer peticiones desde el navegador sin token
- ✅ Usa el script de PowerShell o la consola de Spotify

### No aparecen resultados
- ❌ Verifica que el token esté correctamente configurado
- ❌ Revisa la consola del navegador (F12) para errores
- ✅ Asegúrate de tener conexión a internet

### La aplicación no inicia
- ✅ Ejecuta `npm install` nuevamente
- ✅ Verifica que tengas Node.js instalado: `node --version`
- ✅ Verifica que tengas Angular CLI: `ng version`

---

## 📝 Características Implementadas

✅ **HTTP Params**: Parámetros en peticiones HTTP
✅ **Route Params**: Parámetros dinámicos en rutas
✅ **Angular Routing**: Sistema de navegación completo
✅ **RouterLink**: Enlaces de navegación declarativos
✅ **Standalone Components**: Componentes independientes
✅ **RxJS Observables**: Programación reactiva
✅ **HttpClient**: Cliente HTTP de Angular
✅ **TypeScript**: Tipado estático
✅ **Responsive Design**: Diseño adaptable

---

## 🎯 Próximos Pasos

Para mejorar la aplicación, podrías:

1. **Implementar autenticación OAuth 2.0** para tokens persistentes
2. **Agregar reproducción real** usando Spotify Player SDK
3. **Guardar playlist** en localStorage o backend
4. **Agregar favoritos** y categorías
5. **Implementar búsqueda por voz**
6. **Agregar animaciones** y transiciones
7. **Modo oscuro/claro** personalizable
8. **Compartir canciones** en redes sociales

---

## 📚 Recursos de Aprendizaje

- [Angular Docs](https://angular.io)
- [Spotify API Docs](https://developer.spotify.com/documentation/web-api)
- [RxJS Guide](https://rxjs.dev/guide/overview)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

¡Disfruta tu aplicación de música! 🎵
