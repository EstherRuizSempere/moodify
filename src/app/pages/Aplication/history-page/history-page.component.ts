import { Component, OnInit } from '@angular/core';
import { ListSongComponent } from '../../../shared/list-song/list-song.component';
import { FormsModule } from '@angular/forms';
import { Track } from '../../../interfaces/track';
import { TrackService } from '../../../../services/track.service';
import { TrackPlayerService } from '../../../../services/track-player.service';

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
  paginatedTracks: Track[] = [];
  currentlyPlayingId: string | number | null = null;

  // Filtros
  searchTerm: string = '';
  timeFilter: string = 'all';

  // Paginación
  currentPage: number = 1;
  pageSize: number = 7;
  totalPages: number = 1;

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
      if (!isPlaying) {
      }
    });
  }

  loadTrackData() {
    //Cargo las canciones
    this.trackService.getData().subscribe({
      next: (tracks) => {
        //Cargo el historial de canciones desde el backend
        this.trackService.getHistory().subscribe({
          next:(history) => {
            //history será mi array de track id y playedAt
            //Mapeo el historial con las canciones
            const historyTracks: Track[] = history.map(item => {
              const track = tracks.find(t => t.id.toString() === item.track_id.toString());
              if (track) {
                return {
                  ...track,
                  playedAt: new Date(item.played_at)
                };
              } else {
                console.warn(`Track con id ${item.track_id} no encontrado en el JSON`);
                return null;
              }
            }).filter(t => t !== null) as Track[];

            // Guardamos el historial procesado
            this.historyTracks = historyTracks;

            // Aplicamos los filtros y paginación
            this.filterTracks();
          },
          error: (error) => {
            console.error('Error al cargar el historial:', error);
          }
        });
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

    // Reiniciar paginación
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.filteredTracks.length / this.pageSize);
    this.updatePagination();
  }

  // Actualiza la paginación según la página actual y el tamaño de página
  updatePagination() {
    // Calcula los índices de inicio y fin para la paginación
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    // Actualiza la lista de canciones paginadas
    this.paginatedTracks = this.filteredTracks.slice(startIndex, endIndex);
  }

  // Método para obtener el índice global de la canción (considerando la paginación)
  getGlobalIndex(localIndex: number): number {
    return (this.currentPage - 1) * this.pageSize + localIndex;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
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
      this.trackPlayerService.toggleLike(track);
      track.isLiked = !track.isLiked; // Cambia el estado de like
    }
  }
}
