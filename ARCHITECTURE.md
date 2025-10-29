# 🎵 Arquitectura de la Aplicación

## 📐 Diagrama de Flujo

```
┌─────────────────────────────────────────────────────────────────┐
│                    SPOTIFY API (Datos)                          │
│                  https://api.spotify.com/v1                     │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP Requests (HttpClient + HttpParams)
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                   SpotifyService (Singleton)                    │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ • searchTracks(query): Observable<Track[]>                │  │
│  │ • getTrack(id): Observable<Track>                         │  │
│  │ • setCurrentTrack(track)                                  │  │
│  │ • addToPlaylist(track)                                    │  │
│  │ • removeFromPlaylist(id)                                  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Observable Streams:                                             │
│  • currentTrack$ (BehaviorSubject)                              │
│  • playlist$ (BehaviorSubject)                                  │
└────────────────────┬────────────────────┬───────────────────────┘
                     │                    │
                     │                    │
        ┌────────────┘                    └────────────┐
        │                                              │
        ▼                                              ▼
┌─────────────────┐                          ┌─────────────────┐
│  HomeComponent  │                          │ SearchComponent │
│      (/)        │                          │    (/search)    │
├─────────────────┤                          ├─────────────────┤
│ • Canción actual│◄──────RouterLink────────►│ • Búsqueda      │
│ • Playlist      │                          │ • Resultados    │
│ • Controles     │                          │ • Controles     │
└─────────────────┘                          └─────────────────┘
        │                                              │
        │                                              │
        └──────────────┐                  ┌───────────┘
                       │                  │
                       ▼                  ▼
              ┌──────────────────────────────┐
              │   TrackDetailComponent       │
              │      (/track/:id)            │
              ├──────────────────────────────┤
              │ • Detalle completo           │
              │ • Route Params (id)          │
              │ • Botón reproducir           │
              └──────────────────────────────┘
```

## 🧩 Componentes Principales

### 1️⃣ AppComponent (Root)
```
┌────────────────────────────────────┐
│          AppComponent              │
│  (Componente raíz standalone)      │
├────────────────────────────────────┤
│ • <router-outlet>                  │
│ • Contenedor principal             │
└────────────────────────────────────┘
```

### 2️⃣ HomeComponent
```
┌─────────────────────────────────────────────────────────────┐
│ ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓  │
│ ┃  NAVBAR (Fixed Top)                                 ┃  │
│ ┃  🎵 Logo    [Inicio] [🔍 Buscar]                    ┃  │
│ ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛  │
│                                                             │
│ ┌──────────────────────────┐  ┌─────────────────────────┐ │
│ │   CANCIÓN ACTUAL         │  │    PLAYLIST ACTUAL      │ │
│ │   (Izquierda - Grande)   │  │    (Derecha - Lista)    │ │
│ │                          │  │                         │ │
│ │  ┌──────────────────┐    │  │  [🎵 Track 1]  [X]     │ │
│ │  │   Album Cover    │    │  │  [🎵 Track 2]  [X]     │ │
│ │  │   (Imagen)       │    │  │  [🎵 Track 3]  [X]     │ │
│ │  └──────────────────┘    │  │  [🎵 Track 4]  [X]     │ │
│ │                          │  │                         │ │
│ │  Nombre de Canción       │  │  (Scrollable)           │ │
│ │  Artista                 │  │                         │ │
│ │  Álbum                   │  │                         │ │
│ └──────────────────────────┘  └─────────────────────────┘ │
│                                                             │
│ ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓  │
│ ┃  CONTROLES (Fixed Bottom)                           ┃  │
│ ┃  [⏮️] [▶️] [⏭️]  Nombre - Artista                   ┃  │
│ ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛  │
└─────────────────────────────────────────────────────────────┘
```

### 3️⃣ SearchComponent
```
┌─────────────────────────────────────────────────────────────┐
│ ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓  │
│ ┃  BARRA DE BÚSQUEDA (Fixed Top)                      ┃  │
│ ┃  [_______Buscar canciones______] [🔍] [← Volver]   ┃  │
│ ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛  │
│                                                             │
│  ┌─────────────────  RESULTADOS  ──────────────────┐       │
│  │                                                  │       │
│  │  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐ │      │
│  │  │ Cover  │  │ Cover  │  │ Cover  │  │ Cover  │ │      │
│  │  │ ▶️ Play│  │ ▶️ Play│  │ ▶️ Play│  │ ▶️ Play│ │      │
│  │  │ Nombre │  │ Nombre │  │ Nombre │  │ Nombre │ │      │
│  │  │ Artista│  │ Artista│  │ Artista│  │ Artista│ │      │
│  │  │ Álbum  │  │ Álbum  │  │ Álbum  │  │ Álbum  │ │      │
│  │  └────────┘  └────────┘  └────────┘  └────────┘ │      │
│  │                                                  │       │
│  │  (Grid responsive con scroll)                   │       │
│  └──────────────────────────────────────────────────┘       │
│                                                             │
│ ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓  │
│ ┃  CONTROLES (Fixed Bottom)                           ┃  │
│ ┃  [⏮️] [▶️] [⏭️]                                     ┃  │
│ ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛  │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Flujo de Datos

### Búsqueda de Canciones
```
Usuario escribe búsqueda
        │
        ▼
SearchComponent.onSearch()
        │
        ▼
SpotifyService.searchTracks(query)
        │
        ├── HttpParams { q, type, limit }
        │
        ▼
HTTP GET → Spotify API
        │
        ▼
Observable<Track[]>
        │
        ▼
SearchComponent.searchResults = tracks
        │
        ▼
Template muestra resultados
```

### Seleccionar Canción
```
Usuario hace click en canción
        │
        ▼
Component.selectTrack(track)
        │
        ▼
SpotifyService.setCurrentTrack(track)
        │
        ├── currentTrack$.next(track)
        │
        └── addToPlaylist(track)
                │
                ▼
        playlist$.next([...playlist, track])
        │
        ▼
HomeComponent recibe actualización
        │
        ▼
Template se actualiza automáticamente
```

### Navegación por ID
```
Usuario navega a /track/123
        │
        ▼
Angular Router → TrackDetailComponent
        │
        ▼
ActivatedRoute.params.subscribe()
        │
        ▼
trackId = params['id']  // Route Params
        │
        ▼
SpotifyService.getTrack(trackId)
        │
        ▼
HTTP GET → Spotify API
        │
        ▼
Observable<Track>
        │
        ▼
Component muestra detalles
```

## 🎨 Sistema de Colores (Tonalidades Azules)

```
┌─────────────────────────────────────────────┐
│  Paleta de Colores                          │
├─────────────────────────────────────────────┤
│  #0a1929  ████  Fondo oscuro                │
│  #1a2980  ████  Gradiente fondo             │
│  #1e3a8a  ████  Navbar/Footer base          │
│  #1e40af  ████  Navbar/Footer gradiente     │
│  #2563eb  ████  Tarjetas/Hover              │
│  #3b82f6  ████  Primario/Botones            │
│  #60a5fa  ████  Títulos/Acentos             │
│  #93c5fd  ████  Texto secundario            │
│  #bfdbfe  ████  Texto terciario             │
│  #e0e7ff  ████  Texto principal             │
└─────────────────────────────────────────────┘
```

## 📱 Layout Responsivo

### Desktop (> 1024px)
```
├─────────────────────────────────────┤
│        NAVBAR (100% width)          │
├────────────────────┬────────────────┤
│   CURRENT TRACK    │   PLAYLIST     │
│      (70%)         │     (30%)      │
│                    │                │
├─────────────────────────────────────┤
│       CONTROLS (100% width)         │
└─────────────────────────────────────┘
```

### Mobile (< 1024px)
```
├──────────────────────┤
│   NAVBAR (100%)      │
├──────────────────────┤
│   CURRENT TRACK      │
│      (100%)          │
│   (Playlist hidden)  │
│                      │
├──────────────────────┤
│  CONTROLS (100%)     │
└──────────────────────┘
```

## 🛣️ Rutas de la Aplicación

```typescript
routes = [
  { path: '', component: HomeComponent },
  { path: 'search', component: SearchComponent },
  { path: 'track/:id', component: TrackDetailComponent },
  { path: '**', redirectTo: '' }
]
```

### Navegación
- **Declarativa**: `<a routerLink="/search">Buscar</a>`
- **Programática**: `router.navigate(['/track', trackId])`
- **Parámetros**: `route.params.subscribe(p => p['id'])`

## 🔐 Autenticación con Spotify

```
┌──────────────────────────────────────────────┐
│  Spotify Developer Dashboard                 │
│  • Crear App                                 │
│  • Obtener Client ID + Client Secret        │
└───────────────┬──────────────────────────────┘
                │
                ▼
┌──────────────────────────────────────────────┐
│  OAuth 2.0 Client Credentials Flow           │
│  POST /api/token                             │
│  Body: grant_type=client_credentials         │
└───────────────┬──────────────────────────────┘
                │
                ▼
┌──────────────────────────────────────────────┐
│  Access Token (válido por 1 hora)            │
│  • Usado en header: Authorization: Bearer   │
└───────────────┬──────────────────────────────┘
                │
                ▼
┌──────────────────────────────────────────────┐
│  SpotifyService                              │
│  • Todas las peticiones usan el token       │
└──────────────────────────────────────────────┘
```

---

Esta arquitectura permite:
- ✅ **Separación de responsabilidades**
- ✅ **Reutilización de código**
- ✅ **Mantenibilidad**
- ✅ **Escalabilidad**
- ✅ **Testing sencillo**
