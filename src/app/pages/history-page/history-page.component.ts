import { Component, OnInit } from '@angular/core';
import { ListSongComponent } from '../../shared/list-song/list-song.component';
import { FormsModule } from '@angular/forms';
import { Track } from '../../interfaces/track';
import { TrackService } from '../../../services/track.service';
import { TrackPlayerService } from '../../../services/track-player.service';

@Component({
  selector: 'app-history-page',
  imports: [
    FormsModule,
    ListSongComponent
  ],
  templateUrl: './history-page.component.html',
  styleUrl: './history-page.component.css'
})
export class HistoryPageComponent implements OnInit {
  historyTracks: Track[] = [];
  filteredTracks: Track[] = [];
  currentlyPlayingId: string | number | null = null;

  searchTerm: string = '';
  timeFilter: string = 'all';

  constructor(
    private trackService: TrackService,
    private trackPlayerService: TrackPlayerService
  ) { }

  ngOnInit() {
    this.loadTrackData();

    // Suscribirse al track actual y su estado de reproducción
    this.trackPlayerService.currentTrack$.subscribe(track => {
      if (track) {
        this.currentlyPlayingId = track.id;
      } else {
        this.currentlyPlayingId = null;
      }
    });

    // Suscribirse a cambios en el estado de reproducción
    this.trackPlayerService.isPlaying$.subscribe(isPlaying => {
      // Si no está reproduciendo, podríamos querer actualizar algo en la UI
      if (!isPlaying) {
        // Opcional: Hacer algo cuando se pausa la reproducción
      }
    });
  }

  loadTrackData() {
    this.trackService.getData().subscribe({
      next: (tracks) => {
        this.historyTracks = tracks.map(track => ({
          ...track,
          playedAt: track.playedAt || new Date() // Si no tiene playedAt, asignamos la fecha actual
        }));
        this.filterTracks();
      },
      error: (error) => {
        console.error('Error al cargar las canciones:', error);
      }
    });
  }

  filterTracks(): void {
    let filtered = [...this.historyTracks];

    // Filtrar por término de búsqueda
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(track =>
        track.name.toLowerCase().includes(term) ||
        track.artist.toLowerCase().includes(term) ||
        track.album.toLowerCase().includes(term)
      );
    }

    // Filtrar por tiempo
    const now = new Date();
    if (this.timeFilter === 'today') {
      filtered = filtered.filter(track => {
        if (!track.playedAt) return false;
        const trackDate = new Date(track.playedAt);
        return trackDate.getDate() === now.getDate() &&
          trackDate.getMonth() === now.getMonth() &&
          trackDate.getFullYear() === now.getFullYear();
      });
    } else if (this.timeFilter === 'week') {
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);
      filtered = filtered.filter(track =>
        track.playedAt ? new Date(track.playedAt) >= weekAgo : false
      );
    } else if (this.timeFilter === 'month') {
      const monthAgo = new Date(now);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      filtered = filtered.filter(track =>
        track.playedAt ? new Date(track.playedAt) >= monthAgo : false
      );
    }

    this.filteredTracks = filtered;
  }

  onPlayTrack(event: any) {
    // Utiliza el servicio TrackPlayerService para reproducir
    const track = this.historyTracks.find(t => t.id === event.id);
    if (track) {
      this.trackPlayerService.playTrack(track);
    }
  }

  onLikeTrack(event: any) {
    console.log(`💕Super like para: ` + event.name);

    // Busca la canción en el historial
    const track = this.historyTracks.find(t => t.id === event.id);
    if (track) {
      // Utiliza el servicio TrackPlayerService para dar like
      this.trackPlayerService.toggleLike(track);
      // Actualiza el historial para reflejar el cambio
      this.loadTrackData();
    }
  }
}
