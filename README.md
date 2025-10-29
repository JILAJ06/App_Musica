# 🎵 App Reproductor de Música - Spotify

Aplicación de reproductor de música desarrollada en Angular que utiliza la API de Spotify. Diseñada con una paleta de colores en tonalidades azules.

## 🎨 Características

- **Búsqueda de canciones**: Interfaz de búsqueda con la API de Spotify
- **Visualización de canciones**: Muestra información de las canciones (nombre, artista, álbum)
- **Playlist dinámica**: Gestión de lista de reproducción en tiempo real
- **Diseño responsivo**: Interfaz moderna con gradientes azules
- **Navegación fija**: Barra de búsqueda arriba y controles abajo siempre visibles

## 🛠️ Tecnologías utilizadas

- **Angular 18** (Standalone Components)
- **TypeScript**
- **RxJS** para programación reactiva
- **HttpClient** con HttpParams para consumo de API
- **Angular Router** con RouterLink y Route Params
- **Spotify Web API**

## 📋 Requisitos previos

- Node.js (versión 18 o superior)
- npm o yarn
- Cuenta de desarrollador de Spotify

## 🔑 Configuración de Spotify API

1. Ve a [Spotify for Developers](https://developer.spotify.com/)
2. Inicia sesión con tu cuenta de Spotify
3. Ve a "Dashboard" y crea una nueva aplicación
4. Obtén tu **Client ID** y **Client Secret**
5. Para obtener un token de acceso:
   - Usa la herramienta [Spotify Web API Console](https://developer.spotify.com/console/)
   - O implementa el flujo de OAuth 2.0

6. Abre el archivo `src/app/services/spotify.service.ts`
7. Reemplaza `'TU_TOKEN_AQUI'` con tu token de acceso:

```typescript
private accessToken = 'TU_TOKEN_DE_SPOTIFY';
```

**Nota**: El token expira después de 1 hora. Para producción, implementa el flujo completo de OAuth 2.0.

## 🚀 Instalación

1. Clona o descarga este repositorio

2. Instala las dependencias:
```bash
npm install
```

3. Configura tu token de Spotify en `src/app/services/spotify.service.ts`

4. Inicia el servidor de desarrollo:
```bash
npm start
```

5. Abre tu navegador en `http://localhost:4200`

## 📁 Estructura del proyecto

```
src/
├── app/
│   ├── components/
│   │   ├── home/              # Página principal con playlist
│   │   ├── search/            # Búsqueda de canciones
│   │   └── track-detail/      # Detalle de canción (Route Params)
│   ├── models/
│   │   └── track.model.ts     # Interfaces de TypeScript
│   ├── services/
│   │   └── spotify.service.ts # Servicio con HttpParams
│   ├── app.component.ts
│   ├── app.config.ts
│   └── app.routes.ts          # Configuración de rutas
├── styles.css
└── index.html
```

## 🎯 Funcionalidades implementadas

### HTTP Params
- Uso de `HttpParams` en las peticiones a la API de Spotify
- Parámetros de búsqueda configurables (query, type, limit)

### Route Params
- Ruta `/track/:id` que usa parámetros dinámicos
- Acceso a parámetros mediante `ActivatedRoute`

### Angular Routing
- Configuración de rutas con lazy loading
- Navegación programática con `Router`
- Redirección de rutas no encontradas

### Router Link
- Enlaces de navegación declarativos
- Navegación entre componentes sin recargar la página

## 🎨 Diseño

La aplicación utiliza una paleta de colores en tonalidades azules:
- **Primarios**: #0a1929, #1a2980, #1e3a8a
- **Acentos**: #3b82f6, #60a5fa
- **Texto**: #e0e7ff, #93c5fd, #bfdbfe

### Layout

- **Barra superior fija**: Navegación y búsqueda
- **Contenido central**:
  - Izquierda: Canción actual en grande
  - Derecha: Playlist actual
- **Barra inferior fija**: Controles de reproducción

## 📝 Notas importantes

- Esta aplicación **NO reproduce audio**, solo muestra información de las canciones
- Los datos mostrados son: nombre de canción, artista y álbum
- La API de Spotify tiene límites de uso, revisa la documentación oficial
- El token de acceso debe renovarse periódicamente

## 🔧 Scripts disponibles

```bash
npm start          # Inicia servidor de desarrollo
npm run build      # Construye la aplicación para producción
npm run watch      # Construye en modo desarrollo con watch
npm test           # Ejecuta las pruebas
```

## 📚 Recursos

- [Documentación de Angular](https://angular.io/docs)
- [Spotify Web API](https://developer.spotify.com/documentation/web-api)
- [Angular Router](https://angular.io/guide/router)
- [HttpClient Angular](https://angular.io/guide/http)

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request.

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.
