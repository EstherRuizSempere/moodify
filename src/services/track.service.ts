import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {map, Observable, of, tap} from 'rxjs';
import {Track} from '../app/interfaces/track';
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TrackService {
  private tracks: Track[] = [];
  private tracksLoaded = false;
  private backendBaseUrl = environment.moodifyApiUrl+ 'music/';

  constructor(private http: HttpClient) {
  }

  getData(): Observable<Track[]> {
    // Si ya tenemos los tracks cargados, devolvemos un Observable con ellos
    if (this.tracksLoaded) {
      return of(this.tracks);
    }

    // Cargamos los tracks desde el JSON
    return this.http.get<Track[]>('assets/data/songs.json').pipe(
      tap(tracks => {
        console.log('Canciones cargadas desde el JSON', tracks);

        // Agregamos fecha de reproducción si no existe
        this.tracks = tracks.map(track => ({
          ...track,
          playedAt: track.playedAt ? new Date(track.playedAt) : new Date(),
          isLiked: track.isLiked || false,
          addedToFavoritesAt: null
        }));
        this.tracksLoaded = true;

        // Después de cargar las canciones → sincronizamos favoritos
        this.syncFavoritesWithBackend();
      }),
      map(() => this.tracks)
    );
  }

  //Metod para obtener las canciones favoritas
  getFavorites(): Observable<Track[]> {
    const userId = parseInt(localStorage.getItem('user_id') || '0');
    if (userId === 0) {
      return of([]);
    }

    return this.http.get<any>(this.backendBaseUrl + 'favorites_list.php?user_id=' + userId).pipe(
      tap(response => {
        console.log('Favoritos cargados desde el backend:', response);
      }),
      map((response: any) => {
        // Verificamos que la respuesta sea exitosa y contenga un array de IDs
        if (response.status === 'success' && Array.isArray(response.data)) {
          // Creamos un mapa de IDs de canciones favoritas con su fecha de añadido
          const favoriteMap = new Map<string, string>();
          // Llenamos el mapa con los IDs y las fechas de añadido
          response.data.forEach((item: any) => {
            // Aseguramos que track_id sea un string
            favoriteMap.set(item.track_id.toString(), item.added_at);
          });

          // Filtramos las canciones favoritas con la fecha real de added_at
          const favoriteTracks = this.tracks.filter(track =>
            favoriteMap.has(track.id.toString())
          ).map(track => ({
            // Mapeamos las canciones favoritas a la estructura Track
            ...track,
            isLiked: true,
            addedToFavoritesAt: new Date(favoriteMap.get(track.id.toString())!)
          }));

          return favoriteTracks;
        } else {
          console.error('Error al cargar los favoritos desde el backend', response.message);
          return [];
        }
      })
    );
  }

  // Métod para actualizar el estado de "like" de una canción
  updateTrackLiked(trackId: string | number, isLiked: boolean): void {
    const index = this.tracks.findIndex(track => track.id === trackId);
    if (index !== -1) {
      this.tracks[index].isLiked = isLiked;
      this.tracks[index].addedToFavoritesAt = isLiked ? new Date() : null;

      const userId = parseInt(localStorage.getItem('user_id') || '0');
      if (userId !== 0) {
        const url = isLiked ? this.backendBaseUrl + 'favorites_add.php' : this.backendBaseUrl + 'favorites_remove.php';

        const body = new HttpParams()
          .set('user_id', userId.toString())
          .set('track_id', trackId.toString());

        this.http.post<any>(url, body).subscribe({
          next: response => {
            console.log('Favoritos actualizados', response);
          },
          error: error => {
            console.error('Error al actualizar los favoritos ❌', error);
          }
        });
      }
    }
  }

  // Métod para registrar que una canción fue reproducida
  updateTrackPlayed(trackId: string | number): void {
    const index = this.tracks.findIndex(track => track.id === trackId);
    if (index !== -1) {
      this.tracks[index].playedAt = new Date();

      const userId = parseInt(localStorage.getItem('user_id') || '0');
      if (userId !== 0) {
        const body = new HttpParams()
          .set('user_id', userId.toString())
          .set('track_id', trackId.toString());

        this.http.post<any>(this.backendBaseUrl + 'history_add.php', body).subscribe({
          next: response => {
            console.log('Historial añadido', response);
          },
          error: error => {
            console.error('Error al añadir el historial ❌', error);
          }
        });
      }
    }
  }

// Métod para obtener el historial de reproducciones desde el backend
  private syncFavoritesWithBackend(): void {
    const userId = parseInt(localStorage.getItem('user_id') || '0');
    if (userId === 0) return;

    this.http.get<any>(this.backendBaseUrl + 'favorites_list.php?user_id=' + userId).subscribe({
      next: response => {
        if (response.status === 'success' && Array.isArray(response.data)) {
          // Creamos un Map con track_id → added_at
          const favoriteMap = new Map<string, string>();
          response.data.forEach((item: any) => {
            favoriteMap.set(item.track_id.toString(), item.added_at);
          });

          // Sincronizamos isLiked y addedToFavoritesAt correctamente
          this.tracks.forEach(track => {
            const favoriteAddedAt = favoriteMap.get(track.id.toString());
            if (favoriteAddedAt) {
              // Si la canción está en favoritos, actualizamos isLiked y addedToFavoritesAt
              track.isLiked = true;
              track.addedToFavoritesAt = new Date(favoriteAddedAt);
            } else {
              // Si no está en favoritos, aseguramos que isLiked sea false y addedToFavoritesAt sea null
              track.isLiked = false;
              track.addedToFavoritesAt = null;
            }
          });

          console.log('Favoritos sincronizados desde el backend', favoriteMap);
        }
      },
      error: error => {
        console.error('Error al sincronizar los favoritos ❌', error);
      }
    });
  }


// Métod para obtener el historial de reproducciones
  getHistory(limit: number = 15): Observable<{ track_id: string, played_at: string }[]> {
    const userId = parseInt(localStorage.getItem('user_id') || '0');
    if (userId === 0) {
      return of([]);
    }

    const url = `${this.backendBaseUrl}history_list.php?user_id=${userId}&limit=${limit}`;

    return this.http.get<any>(url).pipe(
      tap(response => {
        console.log('Historial cargado desde el backend', response);
      }),
      map((response: any) => {
        if (response.status === 'success' && Array.isArray(response.data)) {
          return response.data.map((item: any) => ({
            track_id: item.track_id,
            played_at: item.played_at
          }));
        } else {
          console.error('Error al cargar el historial desde el backnd', response.message);
          return [];
        }
      })
    );
  }
}
