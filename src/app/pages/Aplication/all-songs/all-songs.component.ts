import {Component, OnInit} from '@angular/core';
import {TrackService} from '../../../../services/track.service';
import {TrackPlayerService} from '../../../../services/track-player.service';
import {Track} from '../../../interfaces/track';
import {ListSongComponent} from '../../../shared/list-song/list-song.component';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-all-songs',
  imports: [
    ListSongComponent,
    FormsModule
  ],
  templateUrl: './all-songs.component.html',
  styleUrl: './all-songs.component.css'
})
export class AllSongsComponent implements OnInit {
  allTracks: Track[] = [];
  filteredTracks: Track[] = [];
  paginatedTracks: Track[] = []; // Esta será la lista de canciones que se mostrarán según la paginación
  availableGenres: string[] = [];

  // Esta variable contendrá el ID de la canción que se está reproduciendo actualmente
  currentlyPlayingId: string | number | null = null;

  // Filtros
  searchTerm: string = '';
  genreFilter: string = 'all';
  sortOrder: string = 'default'; // default, a-z, z-a

  // Paginación
  currentPage: number = 1;
  pageSize: number = 7;
  totalPages: number = 1;

  constructor(
    private trackService: TrackService,
    private trackPlayerService: TrackPlayerService
  ) {
  }

  ngOnInit() {
    this.loadTracks();
    this.subscribeToPlayerChanges();
  }

  loadTracks() {
    // Carga todas las canciones desde el servicio
    this.trackService.getData().subscribe({
      next: (tracks) => {
        // Asigna las canciones a allTracks
        this.allTracks = tracks;

        this.availableGenres = [...new Set(tracks.map(track => track.album))].sort();

        // Aplicar filtros y paginación
        this.filterTracks();
      },
      error: (error) => {
        console.error('Error al cargar las canciones: ', error);
      }
    });
  }

  subscribeToPlayerChanges() {
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

  filterTracks(): void {
    let filtered = [...this.allTracks];

    // Filtrar por término de búsqueda
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(track =>
        track.name.toLowerCase().includes(term) ||
        track.artist.toLowerCase().includes(term) ||
        track.album.toLowerCase().includes(term)
      );
    }

    // Filtrar por género/álbum
    if (this.genreFilter !== 'all') {
      filtered = filtered.filter(track => track.album === this.genreFilter);
    }

    // Aplicar ordenamiento
    if (this.sortOrder === 'a-z') {
      filtered.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
    } else if (this.sortOrder === 'z-a') {
      filtered.sort((a, b) => b.name.toLowerCase().localeCompare(a.name.toLowerCase()));
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
    //Así me aseguro de que no se salga del rango de canciones
    const endIndex = startIndex + this.pageSize;
    // Actualiza la lista de canciones paginadas
    this.paginatedTracks = this.filteredTracks.slice(startIndex, endIndex);
  }

  // Métod para obtener el índice global de la canción (considerando la paginación)
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

  // Manejo la reproducción de canciones y el like
  onPlayTrack(event: any) {
    const track = this.allTracks.find(t => t.id === event.id);
    if (track) {
      this.trackPlayerService.playTrack(track);
    }
  }

  onLikeTrack(event: any) {
    console.log(`💕 Super like para: ` + event.name);

    const track = this.allTracks.find(t => t.id === event.id);
    if (track) {
      this.trackPlayerService.toggleLike(track);
    }
  }
}
