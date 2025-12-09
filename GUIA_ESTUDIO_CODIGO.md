# Guía de Estudio - App de Música con Spotify

## 📋 Índice
1. [Arquitectura General](#arquitectura-general)
2. [Configuración de la Aplicación](#configuración-de-la-aplicación)
3. [Modelos de Datos](#modelos-de-datos)
4. [Servicios](#servicios)
5. [Componentes](#componentes)
6. [Enrutamiento](#enrutamiento)
7. [Estilos y Diseño](#estilos-y-diseño)

---

## 1. Arquitectura General

### Estructura del Proyecto
```
src/app/
├── core/                    # Núcleo de la aplicación
│   ├── models/             # Interfaces TypeScript
│   ├── services/           # Lógica de negocio
│   └── constants/          # Valores constantes
├── components/             # Componentes de la UI
│   ├── home/              # Pantalla principal
│   ├── album-detail/      # Vista de álbum
│   ├── track-detail/      # Vista de canción
│   └── artist-detail/     # Vista de artista
├── environments/           # Configuración por entorno
├── app.config.ts          # Configuración de Angular
└── app.routes.ts          # Rutas de navegación
```

### Tecnologías Principales
- **Angular 18**: Framework principal (Standalone Components)
- **TypeScript**: Lenguaje de programación
- **RxJS**: Programación reactiva
- **Spotify Web API**: API de música
- **CSS3**: Estilos con Grid y Flexbox

---

## 2. Configuración de la Aplicación

### `app.config.ts`
```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),  // Optimización de detección de cambios
    provideRouter(routes),                                  // Sistema de rutas
    provideHttpClient()                                     // Cliente HTTP para API calls
  ]
};
```

**¿Qué hace cada provider?**
- `provideZoneChangeDetection`: Mejora el rendimiento agrupando eventos
- `provideRouter`: Habilita la navegación entre vistas
- `provideHttpClient`: Permite hacer peticiones HTTP a Spotify API

### `app.routes.ts`
```typescript
export const routes: Routes = [
  { path: '', loadComponent: () => import('./components/home/home.component') },
  { path: 'album/:id', loadComponent: () => import('./components/album-detail/...') },
  { path: 'track/:id', loadComponent: () => import('./components/track-detail/...') },
  { path: 'artist/:id', loadComponent: () => import('./components/artist-detail/...') },
  { path: '**', redirectTo: '' }
];
```

**Conceptos clave:**
- **Lazy Loading**: `loadComponent()` carga componentes solo cuando se necesitan
- **Parámetros dinámicos**: `:id` captura el ID en la URL
- **Wildcard**: `**` captura rutas no existentes

---

## 3. Modelos de Datos

### `track.model.ts` - Modelo de Canción
```typescript
export interface Track {
  id: string;              // Identificador único
  name: string;            // Nombre de la canción
  artists: Artist[];       // Lista de artistas
  album: Album;            // Álbum al que pertenece
  duration_ms: number;     // Duración en milisegundos
  preview_url: string | null;  // URL de preview de 30 segundos
}
```

**Uso en el código:**
```typescript
// Ejemplo de uso
const track: Track = {
  id: '3n3Ppam7vgaVa1iaRUc9Lp',
  name: 'Mr. Brightside',
  artists: [{ id: '0C0XlULifJtAgn6ZNCW2eu', name: 'The Killers' }],
  album: { id: '...' },
  duration_ms: 222973,  // 3:42 minutos
  preview_url: 'https://...'
};
```

### `album.model.ts` - Modelos de Álbum

#### AlbumItem (para búsquedas)
```typescript
export interface AlbumItem {
  id: string;
  name: string;
  images: Image[];         // Portadas en diferentes tamaños
  artists?: Artist[];
  release_date?: string;   // Formato: 'YYYY-MM-DD'
  total_tracks?: number;
}
```

#### AlbumDetail (para vista completa)
```typescript
export interface AlbumDetail extends Album {
  artists: Artist[];
  tracks: {
    items: AlbumTrack[];   // Lista completa de canciones
  };
  copyrights?: Array<{ text: string; type: string }>;
  genres?: string[];
  label?: string;          // Discográfica
  popularity?: number;     // 0-100
}
```

**¿Por qué dos interfaces?**
- `AlbumItem`: Datos resumidos para listas de búsqueda (más rápido)
- `AlbumDetail`: Datos completos para vista detallada (más información)

### `artist.model.ts` - Modelos de Artista

```typescript
export interface ArtistItem {
  id: string;
  name: string;
  images: Image[];
}

export interface ArtistDetail extends ArtistItem {
  followers: {
    total: number;         // Número de seguidores
  };
  genres: string[];        // ['rock', 'indie rock']
  popularity: number;      // 0-100
  type: string;           // 'artist'
  uri: string;            // Spotify URI
}
```

---

## 4. Servicios

### `spotify.service.ts` - Servicio Principal

#### A. Configuración y Estado
```typescript
export class SpotifyService {
  private apiUrl = 'https://api.spotify.com/v1';
  
  // BehaviorSubject: Emite el último valor a nuevos suscriptores
  private currentTrackSubject = new BehaviorSubject<Track | null>(null);
  private playlistSubject = new BehaviorSubject<Track[]>([]);
  
  // Observable: Expone los datos de forma readonly
  public currentTrack$ = this.currentTrackSubject.asObservable();
  public playlist$ = this.playlistSubject.asObservable();
}
```

**Conceptos de RxJS:**
- `BehaviorSubject`: Almacena y emite el último valor
- `Observable`: Flujo de datos que otros pueden escuchar
- `$` al final: Convención para indicar un Observable

#### B. Autenticación con Spotify
```typescript
private async getAccessToken(): Promise<string> {
  // 1. Obtiene credenciales del environment
  const clientId = environment.spotify.clientId;
  const clientSecret = environment.spotify.clientSecret;
  
  // 2. Codifica en Base64
  const credentials = btoa(`${clientId}:${clientSecret}`);
  
  // 3. Hace petición POST al endpoint de tokens
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });
  
  const data = await response.json();
  return data.access_token;  // Token válido por 1 hora
}
```

**Flujo de autenticación OAuth 2.0 Client Credentials:**
1. Cliente envía ID + Secret codificado en Base64
2. Spotify valida y retorna un access_token
3. Se usa el token en todas las peticiones subsecuentes

#### C. Búsqueda de Música
```typescript
searchAll(query: string): Observable<SearchResponse> {
  // from(): Convierte una Promise en Observable
  return from(this.getAccessToken()).pipe(
    // switchMap: Cancela petición anterior si hay una nueva
    switchMap(token => 
      this.http.get<any>(`${this.apiUrl}/search`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          q: query,
          type: 'track,album,artist',
          limit: '10'
        }
      })
    ),
    // map: Transforma los datos de la respuesta
    map(res => ({
      tracks: res.tracks?.items || [],
      albums: res.albums?.items || [],
      artists: res.artists?.items || []
    }))
  );
}
```

**Operadores de RxJS explicados:**
- `from()`: Convierte Promise en Observable
- `pipe()`: Encadena operadores
- `switchMap()`: Cambia a un nuevo Observable (útil para búsquedas)
- `map()`: Transforma los datos

#### D. Gestión de Playlist
```typescript
addToPlaylist(track: Track): void {
  const currentPlaylist = this.playlistSubject.value;  // Obtiene playlist actual
  
  // Verifica si ya existe
  if (!currentPlaylist.find(t => t.id === track.id)) {
    this.playlistSubject.next([...currentPlaylist, track]);  // Agrega al final
  }
}

removeFromPlaylist(trackId: string): void {
  const currentPlaylist = this.playlistSubject.value;
  const updated = currentPlaylist.filter(t => t.id !== trackId);  // Filtra el removido
  this.playlistSubject.next(updated);
}

setCurrentTrack(track: Track): void {
  this.currentTrackSubject.next(track);  // Emite nueva canción actual
}
```

**Patrón de actualización:**
1. Obtener estado actual: `.value`
2. Crear nuevo array/objeto (inmutabilidad)
3. Emitir nuevo estado: `.next()`

---

## 5. Componentes

### A. HomeComponent - Pantalla Principal

#### Estructura del Estado
```typescript
export class HomeComponent implements OnInit, OnDestroy {
  // Estado del reproductor
  currentTrack: Track | null = null;
  playlist: Track[] = [];
  
  // Estado de la UI
  isQueueVisible: boolean = true;      // Cola expandida/contraída
  
  // Estado de búsqueda
  searchQuery: string = '';
  isLoading: boolean = false;
  hasSearched: boolean = false;
  searchTracks: Track[] = [];
  searchAlbums: AlbumItem[] = [];
  searchArtists: ArtistItem[] = [];
  
  // RxJS
  private searchSubject = new Subject<string>();
}
```

#### Lifecycle Hooks
```typescript
ngOnInit(): void {
  // 1. Se ejecuta al crear el componente
  this.initializeSubscriptions();    // Escucha cambios del servicio
  this.setupSearchDebounce();        // Configura búsqueda con delay
  this.checkApiConnection();         // Verifica conexión con Spotify
}

ngOnDestroy(): void {
  // 2. Se ejecuta al destruir el componente (limpieza)
  this.searchSubject.complete();     // Libera recursos de memoria
}
```

#### Búsqueda con Debounce
```typescript
private setupSearchDebounce(): void {
  this.searchSubject.pipe(
    debounceTime(500),           // Espera 500ms sin cambios
    distinctUntilChanged()       // Solo si el valor cambió
  ).subscribe(searchTerm => {
    if (searchTerm?.trim()) {
      this.performSearch(searchTerm.trim());
    }
  });
}

onSearchInput(): void {
  // Usuario escribe en el input
  this.searchSubject.next(this.searchQuery);  // Emite valor
}
```

**¿Por qué debounce?**
- Sin debounce: Si usuario escribe "Beatles" → 7 peticiones HTTP
- Con debounce: Solo 1 petición 500ms después de que termine de escribir

#### Gestión de Playlist
```typescript
addToPlaylist(track: Track): void {
  this.spotifyService.addToPlaylist(track);  // Delega al servicio
}

selectTrack(track: Track): void {
  this.spotifyService.setCurrentTrack(track);  // Establece como actual
  this.clearSearch();                           // Limpia resultados
}
```

#### Navegación Programática
```typescript
navigateToAlbum(albumId: string): void {
  this.router.navigate(['/album', albumId]);  // Navega a /album/abc123
}

navigateToTrack(trackId: string): void {
  this.router.navigate(['/track', trackId]);
}

navigateToArtist(artistId: string): void {
  this.router.navigate(['/artist', artistId]);
}
```

#### Funciones de Utilidad
```typescript
formatDuration(ms: number): string {
  // Convierte 222973 ms → "3:43"
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

getAlbumImage(item: Track | AlbumItem | ArtistItem): string {
  // Intenta obtener imagen, si no usa placeholder
  const images = (item as any)?.album?.images || (item as any)?.images || [];
  return images[0]?.url || PLACEHOLDER_IMAGE_URL;
}

toggleQueue(): void {
  // Alterna visibilidad de la cola
  this.isQueueVisible = !this.isQueueVisible;
}
```

### B. AlbumDetailComponent - Vista de Álbum

#### Carga de Datos
```typescript
ngOnInit(): void {
  // Obtiene ID de la URL
  const albumId = this.route.snapshot.paramMap.get('id');
  
  if (albumId) {
    this.loadAlbumDetails(albumId);
  }
}

private loadAlbumDetails(albumId: string): void {
  this.isLoading = true;
  
  this.spotifyService.getAlbum(albumId).subscribe({
    next: (album) => {
      this.album = album;
      this.isLoading = false;
    },
    error: (error) => {
      console.error('Error loading album:', error);
      this.errorMessage = 'Error al cargar el álbum';
      this.isLoading = false;
    }
  });
}
```

**Manejo de rutas:**
- `ActivatedRoute`: Accede a parámetros de la URL
- `snapshot.paramMap`: Obtiene parámetros en el momento actual
- `get('id')`: Extrae el valor del parámetro `:id`

#### Reproducción de Tracks
```typescript
playTrack(track: AlbumTrack): void {
  if (this.album) {
    // Convierte AlbumTrack → Track completo
    const fullTrack: Track = {
      id: track.id,
      name: track.name,
      artists: track.artists,
      duration_ms: track.duration_ms,
      preview_url: track.preview_url,
      album: {
        id: this.album.id,
        name: this.album.name,
        images: this.album.images,
        album_type: this.album.album_type,
        release_date: this.album.release_date,
        total_tracks: this.album.total_tracks
      }
    };
    
    this.spotifyService.addToPlaylist(fullTrack);
    this.spotifyService.setCurrentTrack(fullTrack);
    this.router.navigate(['/']);  // Vuelve al reproductor
  }
}
```

**¿Por qué convertir?**
- `AlbumTrack`: Solo tiene info de la canción
- `Track`: Necesita info del álbum completo para el reproductor

#### Cálculos de Duración
```typescript
getTotalDuration(): string {
  if (!this.album?.tracks?.items) return '0 min';
  
  // Suma todas las duraciones
  const totalMs = this.album.tracks.items.reduce(
    (sum, track) => sum + track.duration_ms, 
    0
  );
  
  const totalMinutes = Math.floor(totalMs / 60000);
  return `${totalMinutes} min`;
}

getYear(): string {
  if (!this.album?.release_date) return '';
  return this.album.release_date.split('-')[0];  // '2024-12-01' → '2024'
}
```

### C. TrackDetailComponent - Vista de Canción

```typescript
export class TrackDetailComponent implements OnInit {
  track: Track | null = null;
  
  ngOnInit(): void {
    const trackId = this.route.snapshot.paramMap.get('id');
    if (trackId) {
      this.loadTrackDetails(trackId);
    }
  }
  
  playTrack(): void {
    if (this.track) {
      this.spotifyService.addToPlaylist(this.track);
      this.spotifyService.setCurrentTrack(this.track);
      this.router.navigate(['/']);  // Regresa al reproductor
    }
  }
  
  goToAlbum(): void {
    if (this.track?.album) {
      this.router.navigate(['/album', this.track.album.id]);
    }
  }
  
  goToArtist(artistId: string): void {
    this.router.navigate(['/artist', artistId]);
  }
}
```

### D. ArtistDetailComponent - Vista de Artista

#### Carga de Múltiples Datos
```typescript
private loadArtistData(artistId: string): void {
  this.loading = true;
  
  // 1. Cargar info del artista
  this.spotifyService.getArtist(artistId).subscribe({
    next: (artist) => {
      this.artist = artist;
      
      // 2. Cargar top tracks y álbumes en paralelo
      this.loadTopTracks(artistId);
      this.loadAlbums(artistId);
    },
    error: (err) => {
      this.error = 'No se pudo cargar la información del artista';
      this.loading = false;
    }
  });
}

private loadTopTracks(artistId: string): void {
  this.spotifyService.getArtistTopTracks(artistId).subscribe({
    next: (tracks) => {
      this.topTracks = tracks;
    }
  });
}

private loadAlbums(artistId: string): void {
  this.spotifyService.getArtistAlbums(artistId).subscribe({
    next: (albums) => {
      this.albums = albums;
      this.loading = false;  // Termina cuando carga lo último
    }
  });
}
```

**Carga secuencial vs paralelo:**
- Secuencial: artista → espera → top tracks → espera → álbumes
- Paralelo: artista → top tracks + álbumes simultáneamente

#### Formateo de Números
```typescript
formatFollowers(followers: number): string {
  // 5234123 → '5.2M'
  if (followers >= 1000000) {
    return (followers / 1000000).toFixed(1) + 'M';
  }
  // 45300 → '45.3K'
  else if (followers >= 1000) {
    return (followers / 1000).toFixed(1) + 'K';
  }
  // 543 → '543'
  return followers.toString();
}
```

---

## 6. Enrutamiento

### Parámetros de Ruta
```typescript
// En app.routes.ts
{ path: 'album/:id', ... }

// En el componente
ngOnInit(): void {
  // Forma 1: Snapshot (valor actual)
  const id = this.route.snapshot.paramMap.get('id');
  
  // Forma 2: Observable (escucha cambios)
  this.route.paramMap.subscribe(params => {
    const id = params.get('id');
  });
}
```

### Navegación Programática
```typescript
// Sin parámetros
this.router.navigate(['/']);

// Con parámetros
this.router.navigate(['/album', albumId]);
// Genera: /album/abc123

// Con query params
this.router.navigate(['/search'], { 
  queryParams: { q: 'Beatles' } 
});
// Genera: /search?q=Beatles
```

### Guards (protección de rutas)
```typescript
// Ejemplo de guard (no implementado en tu app)
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  if (authService.isLoggedIn()) {
    return true;
  }
  return false;  // Bloquea acceso
};
```

---

## 7. Estilos y Diseño

### CSS Grid Layout
```css
.app-container {
  display: grid;
  grid-template-areas:
    "main queue"
    "player player";
  grid-template-columns: 1fr auto;  /* Main ocupa espacio restante */
  grid-template-rows: 1fr 100px;    /* Player siempre 100px */
  height: 100vh;
  gap: 8px;
}

.main-content { grid-area: main; }
.queue-panel { grid-area: queue; }
.player-bar { grid-area: player; }
```

**Ventajas de Grid:**
- Layout bidimensional (filas y columnas)
- Posicionamiento nombrado con `grid-area`
- Responsive con `auto` y `fr` units

### Flexbox para Componentes
```css
.track-item {
  display: flex;
  gap: 1rem;
  align-items: center;  /* Centrado vertical */
}

.track-info {
  flex: 1;              /* Toma espacio disponible */
  min-width: 0;         /* Permite text-overflow funcionar */
}

.track-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;  /* "Song name that is ve..." */
}
```

### Transiciones y Animaciones
```css
.queue-panel {
  width: 400px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.queue-panel.collapsed {
  width: 60px;
}

.queue-panel.collapsed .queue-header h3 {
  opacity: 0;
  pointer-events: none;  /* No clickeable cuando oculto */
}
```

**Cubic-bezier:**
- Define la curva de aceleración
- `(0.4, 0, 0.2, 1)` = ease-out suave

### Pseudo-elementos para Overlays
```css
.album-cover {
  position: relative;
}

.play-button-overlay {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  opacity: 0;
  transform: translateY(8px);
  transition: all 0.3s ease;
}

.album-cover:hover .play-button-overlay {
  opacity: 1;
  transform: translateY(0);  /* Sube suavemente */
}
```

### Responsive Design
```css
@media (max-width: 768px) {
  .app-container {
    grid-template-areas:
      "main"
      "player";
    grid-template-columns: 1fr;  /* Una columna */
  }
  
  .queue-panel {
    display: none;  /* Oculta cola en móvil */
  }
  
  .track-hero {
    flex-direction: column;  /* Apila verticalmente */
  }
}
```

---

## 📚 Conceptos Clave para Estudiar

### 1. **TypeScript**
- Interfaces vs Types
- Type narrowing con `as`
- Optional chaining `?.`
- Nullish coalescing `??`

### 2. **RxJS**
- Observable vs Promise
- Subject vs BehaviorSubject
- Operadores: map, switchMap, debounceTime, filter
- Subscription management

### 3. **Angular**
- Standalone Components
- Dependency Injection
- Lifecycle Hooks
- Two-way binding `[(ngModel)]`
- Property binding `[src]`
- Event binding `(click)`
- Structural directives `*ngIf`, `*ngFor`

### 4. **API REST**
- HTTP Methods (GET, POST)
- Headers (Authorization)
- Query Parameters
- OAuth 2.0

### 5. **CSS Moderno**
- CSS Grid vs Flexbox
- Custom Properties (variables)
- Transitions vs Animations
- Transform y Translate
- Media Queries

---

## 🎯 Flujo de Datos Completo

### Ejemplo: Buscar y Reproducir una Canción

1. **Usuario escribe "Beatles"**
   ```
   Input → (ngModelChange) → searchQuery = 'Beatles'
   ```

2. **Debounce espera 500ms**
   ```
   searchSubject.next('Beatles') → debounceTime(500) → emite
   ```

3. **Petición a Spotify API**
   ```
   performSearch('Beatles')
   → getAccessToken() → Token
   → http.get('search?q=Beatles')
   → Respuesta con tracks, albums, artists
   ```

4. **Actualiza UI**
   ```
   searchTracks = [...canciones]
   → *ngFor renderiza cards
   ```

5. **Usuario hace click en canción**
   ```
   (click)="navigateToTrack(track.id)"
   → router.navigate(['/track', '3n3Ppam7...'])
   ```

6. **Carga detalle**
   ```
   TrackDetailComponent.ngOnInit()
   → getTrack('3n3Ppam7...')
   → track = {...datos}
   → Template muestra info
   ```

7. **Usuario presiona "Reproducir"**
   ```
   playTrack()
   → addToPlaylist(track) → playlist.push(track)
   → setCurrentTrack(track) → currentTrack = track
   → navigate(['/']) → Vuelve al home
   ```

8. **Reproductor se actualiza**
   ```
   currentTrack$ emite nuevo valor
   → HomeComponent recibe suscripción
   → Template actualiza player bar
   ```

---

## 💡 Tips para la Presentación

1. **Empieza con la demo**: Muestra la app funcionando primero

2. **Explica la arquitectura**: 
   - "Usé Angular con arquitectura modular"
   - "Separé modelos, servicios y componentes"

3. **Destaca tecnologías**:
   - "RxJS para manejo reactivo de estado"
   - "Lazy loading para optimización"
   - "CSS Grid para layout responsivo"

4. **Menciona buenas prácticas**:
   - "Standalone components (Angular 18)"
   - "TypeScript strict mode"
   - "Documentación con JSDoc"
   - "Manejo de errores con try-catch"

5. **Flujo de usuario**:
   - Búsqueda → Resultados → Detalle → Reproducción
   - Navegación entre vistas
   - Cola de reproducción

---

## 📖 Recursos para Profundizar

- **Angular**: https://angular.io/docs
- **RxJS**: https://rxjs.dev/guide/overview
- **TypeScript**: https://www.typescriptlang.org/docs/
- **Spotify API**: https://developer.spotify.com/documentation/web-api
- **CSS Grid**: https://css-tricks.com/snippets/css/complete-guide-grid/

---

¡Éxito en tu presentación! 🚀
