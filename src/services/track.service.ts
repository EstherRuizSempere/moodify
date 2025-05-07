import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of, tap} from 'rxjs';
import {Track} from '../app/interfaces/track';

@Injectable({
  providedIn: 'root'
})
export class TrackService {
  private tracks: Track[] = [];
  private tracksLoaded = false;

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
        // Agregamos fecha de reproducción si no existe
        this.tracks = tracks.map(track => ({
          ...track,
          playedAt: track.playedAt || new Date(),
          isLiked: track.isLiked || false,
          addedToFavoritesAt: track.isLiked ? (track.addedToFavoritesAt || new Date()) : null
        }));
        this.tracksLoaded = true;
      })
    );
  }

  //Metod para obtener las canciones favoritas
  getFavorites(): Observable<Track[]> {
    //Asegurar la carga de datos
    if (!this.tracksLoaded) {
      return this.getData().pipe(
        tap(() => {
        }),
        //Al cargar los datos devolvemos los favoritos
        tap(tracks => tracks.filter(track => track.isLiked))
      );
    }

    //Si están cargados, devuelve los favoritos
    return of(this.tracks.filter(track => track.isLiked));
  }

  // Métod para actualizar el estado de "like" de una canción
  updateTrackLiked(trackId: string | number, isLiked: boolean): void {
    const index = this.tracks.findIndex(track => track.id === trackId);
    if (index !== -1) {
      this.tracks[index].isLiked = isLiked;

      //actualizar la fecha en la que se puso en favoritos
      if (isLiked) {
        this.tracks[index].addedToFavoritesAt = new Date();
      }else{
        //Si quito like, elimino la fecha
        this.tracks[index].addedToFavoritesAt = null;
      }
    }
  }

  // Métod para registrar que una canción fue reproducida
  updateTrackPlayed(trackId: string | number): void {
    const index = this.tracks.findIndex(track => track.id === trackId);
    if (index !== -1) {
      this.tracks[index].playedAt = new Date();
    }
  }
}
