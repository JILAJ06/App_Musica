# 🎵 MusicFlow - Spotify Player

Aplicación moderna de reproductor de música desarrollada en **Angular 18** que utiliza la API de Spotify. Diseño inspirado en Spotify con búsqueda en tiempo real y gestión de playlist.

## ✨ Características

- 🔍 **Búsqueda en tiempo real** - Resultados mientras escribes (debounce de 500ms)
- 🎵 **Integración completa con Spotify API** - Canciones, álbumes y artistas
- 📋 **Gestión de playlist dinámica** - Agrega y elimina canciones
- 🎨 **Diseño moderno** - Interfaz inspirada en Spotify con degradados
- 📱 **Totalmente responsivo** - Funciona en desktop, tablet y móvil
- ⚡ **Rendimiento optimizado** - Lazy loading y standalone components

## 🛠️ Stack Tecnológico

- **Angular 18** - Framework con standalone components
- **TypeScript 5** - Tipado estático y JSDoc completo
- **RxJS 7** - Programación reactiva (Subject, debounceTime, distinctUntilChanged)
- **Spotify Web API** - Autenticación Client Credentials Flow
- **CSS3** - Grid Layout, gradientes y glassmorphism

## 📋 Requisitos Previos

- **Node.js** 18 o superior
- **npm** o **yarn**
- Cuenta de desarrollador de Spotify

## � Instalación y Configuración

### 1️⃣ Clonar e instalar dependencias

```bash
git clone <tu-repositorio>
cd App_Musica
npm install
```

### 2️⃣ Configurar Spotify API

1. Ve a [Spotify for Developers](https://developer.spotify.com/dashboard)
2. Crea una nueva aplicación
3. Obtén tu **Client ID** y **Client Secret**
4. Crea un archivo `.env` en la raíz del proyecto:

```env
SPOTIFY_CLIENT_ID=tu_client_id_aqui
SPOTIFY_CLIENT_SECRET=tu_client_secret_aqui
```

5. Actualiza `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  spotify: {
    clientId: 'TU_CLIENT_ID',
    clientSecret: 'TU_CLIENT_SECRET'
  }
};
```

### 3️⃣ Ejecutar la aplicación

```bash
npm start
```

Abre tu navegador en `http://localhost:4200`

## 📁 Estructura del Proyecto

```
src/app/
├── core/                      # Módulo Core - Funcionalidad base
│   ├── models/               # Interfaces TypeScript (Track, Album, Artist)
│   │   ├── track.model.ts
│   │   ├── artist.model.ts
│   │   ├── album.model.ts
│   │   ├── image.model.ts
│   │   ├── search.model.ts
│   │   └── index.ts          # Barrel export
│   ├── services/             # Servicios compartidos
│   │   ├── spotify.service.ts
│   │   └── index.ts
│   ├── constants/            # Constantes de la aplicación
│   │   ├── app.constants.ts
│   │   └── index.ts
│   └── index.ts              # Barrel export principal
│
├── components/               # Componentes de UI
│   └── home/                # Componente principal
│       ├── home.component.ts
│       ├── home.component.html
│       └── home.component.css
│
├── app.component.ts         # Componente raíz
├── app.config.ts            # Configuración de la app
└── app.routes.ts            # Definición de rutas
```

### �️ Arquitectura

**Principios aplicados:**
- ✅ **Separación de responsabilidades** - Core, Components, Services
- ✅ **Barrel Exports** - Imports limpios con `index.ts`
- ✅ **JSDoc completo** - Documentación en todos los métodos
- ✅ **Constantes centralizadas** - Sin valores hardcodeados
- ✅ **Type Safety** - TypeScript strict mode

## 🎯 Funcionalidades Implementadas

### 🔍 Búsqueda en Tiempo Real
```typescript
// Debounce de 500ms para evitar llamadas excesivas
searchSubject.pipe(
  debounceTime(SEARCH_DEBOUNCE_TIME),
  distinctUntilChanged()
)
```

### 🎵 Gestión de Playlist
- Agregar canciones (sin duplicados)
- Eliminar canciones
- Visualizar canción actual
- Cola de reproducción

### 🔐 Autenticación Spotify
- Client Credentials Flow
- Renovación automática de token
- Manejo de errores (401, 429)

### 📱 Diseño Responsivo
- **Desktop**: 2 columnas (contenido principal + cola)
- **Tablet**: 1 columna con cola oculta
- **Mobile**: Layout vertical optimizado

## 🎨 Diseño y Paleta de Colores

### Colores Principales
```css
--bg-dark: #0a0e27
--bg-card: #1a1f3a
--accent-blue: #3b82f6
--accent-purple: #8b5cf6
--text-primary: #ffffff
--text-secondary: #94a3b8
```

### Layout
- **Header**: Logo + Barra de búsqueda (fijo superior)
- **Main**: Contenido principal con resultados de búsqueda
- **Queue**: Cola de reproducción (derecha)
- **Player Bar**: Controles de reproducción (fijo inferior)

## 🔧 Scripts Disponibles

```bash
npm start          # Servidor de desarrollo (puerto 4200)
npm run build      # Build de producción
npm run watch      # Build en modo watch
npm test           # Ejecutar tests
npm run lint       # Linter de código
```

## 📚 Recursos y Documentación

- [Angular Documentation](https://angular.io/docs)
- [Spotify Web API](https://developer.spotify.com/documentation/web-api)
- [RxJS Operators](https://rxjs.dev/guide/operators)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🤝 Contribuir

Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## � Notas Importantes

- ⚠️ **Sin reproducción de audio**: Esta app solo muestra información, no reproduce música
- 🔄 **Token expira en 1 hora**: Se renueva automáticamente
- 📊 **Rate Limits**: Spotify API tiene límites de peticiones
- 🔒 **Seguridad**: No expongas tus credenciales en repositorios públicos

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

---

Desarrollado con ❤️ usando Angular 18 y Spotify API
