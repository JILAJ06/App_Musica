# 📂 Estructura del Proyecto

Esta aplicación sigue una arquitectura modular y escalable basada en Angular con mejores prácticas de organización de código.

## 🏗️ Organización de Carpetas

```
src/app/
├── core/                      # Módulo Core - Funcionalidad base
│   ├── models/               # Modelos de datos (interfaces TypeScript)
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
├── components/               # Componentes de la aplicación
│   └── home/                # Componente principal
│       ├── home.component.ts
│       ├── home.component.html
│       └── home.component.css
│
├── app.component.ts         # Componente raíz
├── app.config.ts            # Configuración de la app
└── app.routes.ts            # Definición de rutas
```

## 📦 Módulo Core

El módulo **core** contiene toda la funcionalidad compartida y esencial de la aplicación:

### Models
Interfaces TypeScript que definen la estructura de datos:
- `Track`: Información de canciones
- `Artist`: Información de artistas
- `Album`: Información de álbumes
- `Image`: Estructura de imágenes de Spotify
- `SearchResponse`: Respuestas de búsqueda

### Services
Servicios singleton que gestionan la lógica de negocio:
- `SpotifyService`: Comunicación con la API de Spotify

### Constants
Valores constantes utilizados en toda la aplicación:
- `SEARCH_DEBOUNCE_TIME`: Tiempo de debounce para búsquedas (500ms)
- `PLACEHOLDER_IMAGE_URL`: URL de imagen placeholder
- `ERROR_MESSAGES`: Mensajes de error predefinidos
- `ALBUM_TYPES`: Tipos de álbum soportados

## 🎯 Barrel Exports

Cada carpeta incluye un archivo `index.ts` que exporta todos sus elementos (barrel pattern):

```typescript
// Importación limpia desde core
import { Track, SpotifyService, SEARCH_DEBOUNCE_TIME } from '@app/core';

// En lugar de:
import { Track } from '@app/core/models/track.model';
import { SpotifyService } from '@app/core/services/spotify.service';
import { SEARCH_DEBOUNCE_TIME } from '@app/core/constants/app.constants';
```

## 📝 Convenciones de Código

### Comentarios JSDoc
Todos los métodos y clases están documentados con JSDoc:

```typescript
/**
 * Ejecuta la búsqueda en la API de Spotify
 * @param query Término de búsqueda
 */
performSearch(query: string): void {
  // ...
}
```

### Organización de Métodos
Los métodos se agrupan por categoría con separadores visuales:

```typescript
// ===========================
// Métodos de búsqueda
// ===========================

// ===========================
// Gestión de playlist
// ===========================

// ===========================
// Métodos de utilidad
// ===========================
```

### Nomenclatura
- **Componentes**: PascalCase (ej: `HomeComponent`)
- **Servicios**: PascalCase con sufijo Service (ej: `SpotifyService`)
- **Interfaces**: PascalCase (ej: `Track`, `Album`)
- **Constantes**: SCREAMING_SNAKE_CASE (ej: `SEARCH_DEBOUNCE_TIME`)
- **Variables/Métodos**: camelCase (ej: `searchQuery`, `performSearch`)

## 🔄 Flujo de Datos

```
Usuario escribe en búsqueda
        ↓
HomeComponent.onSearchInput()
        ↓
searchSubject (debounce 500ms)
        ↓
HomeComponent.performSearch()
        ↓
SpotifyService.searchAll()
        ↓
API de Spotify
        ↓
Resultados mostrados en template
```

## 🚀 Beneficios de esta Estructura

✅ **Escalabilidad**: Fácil agregar nuevos componentes y servicios
✅ **Mantenibilidad**: Código organizado y documentado
✅ **Reutilización**: Modelos y servicios compartidos
✅ **Legibilidad**: Estructura clara con comentarios
✅ **Type Safety**: TypeScript con interfaces bien definidas
✅ **Barrel Exports**: Imports limpios y concisos

## 📚 Próximos Pasos

Para mantener esta estructura:
1. Nuevos modelos → `core/models/`
2. Nuevos servicios → `core/services/`
3. Nuevas constantes → `core/constants/`
4. Nuevos componentes → `components/nombre-componente/`
5. Actualizar `index.ts` correspondiente para barrel exports
