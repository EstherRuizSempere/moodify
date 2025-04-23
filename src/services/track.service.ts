import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { Track } from '../app/interfaces/track';

@Injectable({
  providedIn: 'root'
})
export class TrackService {
  private tracks: Track[] = [];
  private tracksLoaded = false;

  constructor(private http: HttpClient) { }

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
          isLiked: track.isLiked || false
        }));
        this.tracksLoaded = true;
      })
    );
  }

  // Métod para actualizar el estado de "like" de una canción
  updateTrackLiked(trackId: string | number, isLiked: boolean): void {
    const index = this.tracks.findIndex(track => track.id === trackId);
    if (index !== -1) {
      this.tracks[index].isLiked = isLiked;
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
