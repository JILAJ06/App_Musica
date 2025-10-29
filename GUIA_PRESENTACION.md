# 📖 Guía de Estudio - MusicFlow App

## 🎯 Objetivo del Proyecto
Desarrollar una aplicación web moderna de reproductor de música que consume la **API de Spotify**, implementando búsqueda en tiempo real, gestión de playlist y diseño responsivo usando **Angular 18**.

---

## 🏗️ Arquitectura del Proyecto

### 1️⃣ Patrón de Diseño: **Modular con Core Module**

```
src/app/
├── core/           → Funcionalidad compartida y esencial
├── components/     → Componentes de UI
├── app.config.ts   → Configuración de providers
└── app.routes.ts   → Definición de rutas
```

**¿Por qué esta estructura?**
- ✅ **Separación de responsabilidades**: Cada carpeta tiene un propósito específico
- ✅ **Reutilización**: Models, services y constants se usan en múltiples componentes
- ✅ **Escalabilidad**: Fácil agregar nuevos componentes sin romper la estructura
- ✅ **Mantenibilidad**: Fácil encontrar y modificar código

---

## 📚 Conceptos Clave de Angular Implementados

### 1. **Standalone Components** (Angular 18)
```typescript
@Component({
  selector: 'app-home',
  standalone: true,  // ← No necesita NgModule
  imports: [CommonModule, FormsModule]
})
export class HomeComponent { }
```

**Ventaja**: Simplifica la arquitectura, elimina módulos innecesarios.

### 2. **Dependency Injection**
```typescript
constructor(private spotifyService: SpotifyService) {}
```

**Explicación**: Angular inyecta automáticamente el servicio cuando se crea el componente.

### 3. **Observables y RxJS**
```typescript
// BehaviorSubject mantiene el último valor emitido
private currentTrackSubject = new BehaviorSubject<Track | null>(null);
public currentTrack$ = this.currentTrackSubject.asObservable();

// Subject para debounce de búsqueda
private searchSubject = new Subject<string>();
```

**Patrón usado**: 
- `BehaviorSubject` para estado compartido (currentTrack, playlist)
- `Subject` para eventos (búsqueda)
- Operadores: `debounceTime`, `distinctUntilChanged`, `switchMap`, `map`

### 4. **Lazy Loading**
```typescript
{
  path: '',
  loadComponent: () => import('./components/home/home.component')
    .then(m => m.HomeComponent)
}
```

**Beneficio**: Carga el componente solo cuando se necesita → Mejor rendimiento inicial.

### 5. **HttpClient con HttpParams**
```typescript
const params = new HttpParams()
  .set('q', query)
  .set('type', 'track,album,artist')
  .set('limit', '20');

this.http.get<any>(`${this.apiUrl}/search`, { headers, params })
```

**Ventaja**: Construye URLs de forma segura, evita inyección de código.

### 6. **Two-Way Data Binding**
```html
<input [(ngModel)]="searchQuery" (input)="onSearchInput()">
```

**Explicación**: 
- `[(ngModel)]` → Sincroniza automáticamente input con variable
- `(input)` → Detecta cambios y ejecuta función

---

## 🔍 Flujo de Búsqueda en Tiempo Real

### Paso a Paso:

1. **Usuario escribe en input**
```html
<input [(ngModel)]="searchQuery" (input)="onSearchInput()">
```

2. **onSearchInput() emite al Subject**
```typescript
onSearchInput(): void {
  this.searchSubject.next(this.searchQuery);
}
```

3. **Subject aplica debounce (500ms)**
```typescript
this.searchSubject.pipe(
  debounceTime(SEARCH_DEBOUNCE_TIME),  // Espera 500ms
  distinctUntilChanged()                // Solo si cambió el valor
).subscribe(searchTerm => {
  this.performSearch(searchTerm);
})
```

4. **performSearch() llama al servicio**
```typescript
this.spotifyService.searchAll(query).subscribe({
  next: (res) => {
    this.searchTracks = res.tracks;
    this.searchAlbums = res.albums;
    // ...
  }
})
```

5. **Servicio obtiene token y hace petición HTTP**
```typescript
return from(this.getAccessToken()).pipe(
  switchMap(() => this.http.get<any>(`${apiUrl}/search`, { params }))
)
```

**¿Por qué debounce?**
- Sin debounce: 100 peticiones si escribes "beatles" (1 por letra)
- Con debounce: 1 petición después de 500ms de dejar de escribir
- **Ahorro**: 99% menos peticiones → Mejor rendimiento y respeta rate limits

---

## 🔐 Autenticación con Spotify API

### Client Credentials Flow

```typescript
private async getAccessToken(): Promise<void> {
  // 1. Verificar si token es válido
  if (this.accessToken && Date.now() < this.tokenExpiration) {
    return;
  }

  // 2. Preparar body con grant_type
  const body = new HttpParams().set('grant_type', 'client_credentials');
  
  // 3. Header con credenciales en Base64
  const headers = new HttpHeaders({
    'Authorization': 'Basic ' + btoa(`${clientId}:${clientSecret}`)
  });

  // 4. POST a /token
  this.http.post<any>(this.authUrl, body.toString(), { headers })
    .subscribe(response => {
      this.accessToken = response.access_token;
      this.tokenExpiration = Date.now() + (response.expires_in * 1000);
    });
}
```

**Flujo OAuth 2.0:**
1. App envía `clientId` + `clientSecret`
2. Spotify valida credenciales
3. Spotify devuelve `access_token` (válido 1 hora)
4. App usa token en header `Authorization: Bearer <token>`

**Ventaja de Client Credentials:**
- ✅ Simple de implementar
- ✅ No requiere login de usuario
- ❌ Solo acceso a datos públicos (no playlists privadas)

---

## 🎨 Gestión de Estado con BehaviorSubject

### Patrón Observable Store

```typescript
// SERVICIO (Store)
private currentTrackSubject = new BehaviorSubject<Track | null>(null);
public currentTrack$ = this.currentTrackSubject.asObservable();

setCurrentTrack(track: Track): void {
  this.currentTrackSubject.next(track);  // Emite nuevo valor
}

// COMPONENTE (Consumer)
ngOnInit(): void {
  this.spotifyService.currentTrack$.subscribe(track => {
    this.currentTrack = track;  // Se actualiza automáticamente
  });
}
```

**¿Por qué BehaviorSubject?**
- ✅ Mantiene siempre el último valor
- ✅ Nuevos subscribers reciben valor inmediato
- ✅ Ideal para estado compartido entre componentes

**Comparación con alternativas:**

| Opción | BehaviorSubject | @Input/@Output | LocalStorage |
|--------|----------------|----------------|--------------|
| Reactividad | ✅ Automática | ❌ Manual | ❌ Manual |
| Estado inicial | ✅ Sí | ❌ No | ⚠️ Persistente |
| Entre componentes | ✅ Fácil | ⚠️ Solo padre-hijo | ✅ Global |
| Type Safety | ✅ TypeScript | ✅ TypeScript | ❌ Strings |

---

## 📦 Interfaces TypeScript

### Track Model
```typescript
export interface Track {
  id: string;              // Identificador único
  name: string;            // Nombre de la canción
  artists: Artist[];       // Array de artistas
  album: Album;            // Información del álbum
  duration_ms: number;     // Duración en milisegundos
  preview_url: string | null;  // URL de preview (30 seg)
}
```

**Beneficios de TypeScript:**
- ✅ Autocomplete en VS Code
- ✅ Errores en tiempo de compilación
- ✅ Documentación automática (JSDoc)
- ✅ Refactoring seguro

### Barrel Exports
```typescript
// core/models/index.ts
export * from './track.model';
export * from './artist.model';
export * from './album.model';

// Uso limpio:
import { Track, Artist, Album } from '../../core/models';

// En lugar de:
import { Track } from '../../core/models/track.model';
import { Artist } from '../../core/models/artist.model';
```

---

## 🎯 Métodos Clave del Componente

### 1. Búsqueda Automática
```typescript
setupSearchDebounce(): void {
  this.searchSubject.pipe(
    debounceTime(500),           // Espera 500ms
    distinctUntilChanged()       // Solo si cambió
  ).subscribe(searchTerm => {
    if (searchTerm.trim()) {
      this.performSearch(searchTerm);
    }
  });
}
```

### 2. Manejo de Errores HTTP
```typescript
private handleSearchError(error: any): void {
  if (error?.status === 401) {
    this.errorMessage = 'Token expirado';
  } else if (error?.status === 429) {
    this.errorMessage = 'Límite de peticiones alcanzado';
  } else {
    this.errorMessage = 'Error al buscar';
  }
}
```

**Códigos HTTP importantes:**
- `200` - OK
- `401` - Unauthorized (token inválido)
- `429` - Too Many Requests (rate limit)
- `500` - Internal Server Error

### 3. Formateo de Datos
```typescript
formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
// Ejemplo: 200040 ms → "3:20"
```

---

## 🎨 CSS y Diseño

### Grid Layout
```css
.app-container {
  display: grid;
  grid-template-areas: "main queue" "player player";
  grid-template-columns: 1fr 400px;
  grid-template-rows: 1fr 120px;
}
```

**Ventajas de Grid:**
- ✅ Layout bidimensional (filas y columnas)
- ✅ Responsive con media queries
- ✅ Áreas nombradas para claridad

### Gradientes
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Glassmorphism
```css
background: rgba(255, 255, 255, 0.1);
backdrop-filter: blur(10px);
border: 1px solid rgba(255, 255, 255, 0.2);
```

---

## 🔄 Lifecycle Hooks

```typescript
ngOnInit(): void {
  // Se ejecuta UNA VEZ al crear el componente
  this.initializeSubscriptions();
  this.setupSearchDebounce();
}

ngOnDestroy(): void {
  // Se ejecuta al destruir el componente
  this.searchSubject.complete();  // Evita memory leaks
}
```

**¿Por qué complete()?**
- Sin `.complete()` → Subject sigue activo → Memory leak
- Con `.complete()` → Subject se cierra → Libera memoria

---

## 📊 Ventajas de Esta Implementación

### 1. **Performance**
- ✅ Lazy loading de componentes
- ✅ Debounce reduce peticiones HTTP
- ✅ Standalone components (menor bundle)
- ✅ OnPush change detection (futuro)

### 2. **Experiencia de Usuario**
- ✅ Búsqueda en tiempo real
- ✅ Sin recargas de página
- ✅ Feedback visual (loading, errores)
- ✅ Diseño responsivo

### 3. **Calidad de Código**
- ✅ TypeScript strict mode
- ✅ JSDoc completo
- ✅ Separación de responsabilidades
- ✅ Nombres descriptivos

### 4. **Escalabilidad**
- ✅ Fácil agregar componentes
- ✅ Servicios reutilizables
- ✅ Constantes centralizadas
- ✅ Barrel exports

---

## 🎤 Puntos Clave para la Presentación

### 1. **Inicio: Problema y Solución**
> "Desarrollé una app que consume la API de Spotify para buscar música en tiempo real, implementando debounce para optimizar peticiones y mejorar la experiencia de usuario."

### 2. **Arquitectura**
> "Usé Angular 18 con standalone components y una arquitectura modular con core module, separando models, services y constants para facilitar el mantenimiento."

### 3. **Tecnologías Destacadas**
> "Implementé RxJS con Subject y BehaviorSubject para gestión de estado reactivo, HttpClient para consumo de API, y TypeScript para type safety."

### 4. **Optimizaciones**
> "Apliqué debounce de 500ms para reducir peticiones HTTP en un 99%, lazy loading para mejorar rendimiento inicial, y renovación automática de token OAuth."

### 5. **Resultado**
> "Una aplicación profesional con búsqueda en tiempo real, gestión de playlist, diseño responsivo inspirado en Spotify, y código limpio documentado con JSDoc."

---

## 🧪 Demo en Vivo - Qué Mostrar

1. **Búsqueda en tiempo real**
   - Escribir lentamente y mostrar cómo no hace peticiones hasta esperar 500ms
   - Buscar "The Beatles" → Muestra tracks, albums, artists

2. **Agregar a playlist**
   - Seleccionar canción → Se muestra en "Now Playing"
   - Se agrega a la cola automáticamente

3. **Diseño responsivo**
   - Cambiar tamaño de ventana → Mostrar cómo se adapta
   - Mobile: Cola oculta
   - Desktop: 2 columnas

4. **Manejo de errores**
   - Desconectar internet → Mostrar mensaje de error
   - Mostrar console con logs de token

---

## 📝 Preguntas Frecuentes

### ¿Por qué Angular y no React/Vue?
- TypeScript nativo
- Dependency Injection out-of-the-box
- RxJS integrado
- CLI potente

### ¿Por qué BehaviorSubject y no Redux?
- Proyecto pequeño-mediano
- Menos boilerplate
- Nativo de RxJS
- Más simple de mantener

### ¿Cómo mejorarias la app?
- Agregar reproducción de audio (preview_url)
- Implementar OAuth con login de usuario
- Agregar playlists persistentes (backend)
- Testing con Jasmine/Karma
- PWA para uso offline

### ¿Qué aprendiste?
- Consumo de APIs REST
- Autenticación OAuth 2.0
- Programación reactiva con RxJS
- Arquitectura modular
- Optimización de performance

---

## 🚀 Comandos Útiles

```bash
# Desarrollo
npm start                 # http://localhost:4200

# Producción
npm run build            # ./dist

# Testing
npm test

# Linting
npm run lint
```

---

## 📚 Recursos para Profundizar

- [Angular Docs](https://angular.io/docs)
- [RxJS Operators](https://rxjs.dev/api)
- [Spotify API](https://developer.spotify.com/documentation/web-api)
- [OAuth 2.0](https://oauth.net/2/)

---

**¡Éxito en tu presentación! 🎉**
