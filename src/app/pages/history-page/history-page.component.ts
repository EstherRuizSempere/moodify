import {Component, OnInit} from '@angular/core';
import {ListSongComponent, Track} from '../../shared/list-song/list-song.component';
import {FormsModule} from '@angular/forms';

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

  constructor() {
  }

  ngOnInit() {
    //Tengo que implementar para obtener los datos del historial desde el servicio
    this.loadTrackData();
    this.filterTracks();
  }

  loadTrackData() {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(now);
    lastWeek.setDate(lastWeek.getDate() - 7);

    this.historyTracks = [
      {
        id: '1',
        title: 'Canción romántica con un título muy largo que podría truncarse',
        artist: 'Artista Famoso',
        album: 'Álbum Increíble',
        imageUrl: 'assets/album-placeholder.jpg',
        duration: 187,
        playedAt: now,
        isLiked: true
      },
      {
        id: '2',
        title: 'Título más corto',
        artist: 'Otro Artista',
        album: 'Otro Álbum',
        imageUrl: 'assets/album-placeholder.jpg',
        duration: 225,
        playedAt: yesterday,
        isLiked: false
      },
      {
        id: '3',
        title: 'Canción Alegre',
        artist: 'Grupo Musical',
        album: 'Álbum de Verano',
        imageUrl: 'assets/album-placeholder.jpg',
        duration: 176,
        playedAt: lastWeek,
        isLiked: true
      },
      {
        id: '4',
        title: 'Melodía Instrumental',
        artist: 'Pianista Famoso',
        album: 'Colección de Piano',
        imageUrl: 'assets/album-placeholder.jpg',
        duration: 304,
        playedAt: yesterday,
        isLiked: false
      },
      {
        id: '5',
        title: 'Canción Nostálgica',
        artist: 'Cantante Vintage',
        album: 'Éxitos del Pasado',
        imageUrl: 'assets/album-placeholder.jpg',
        duration: 254,
        playedAt: now,
        isLiked: true
      }
    ];
  }

  //Filtros->
  filterTracks(): void {
    let filtered = [...this.historyTracks];

    // Filtrar por término de búsqueda
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(track =>
        track.title.toLowerCase().includes(term) ||
        track.artist.toLowerCase().includes(term) ||
        track.album.toLowerCase().includes(term)
      );
    }

    // Filtrar por tiempo
    const now = new Date();
    if (this.timeFilter === 'today') {
      filtered = filtered.filter(track => {
        const trackDate = new Date(track.playedAt);
        return trackDate.getDate() === now.getDate() &&
          trackDate.getMonth() === now.getMonth() &&
          trackDate.getFullYear() === now.getFullYear();
      });
    } else if (this.timeFilter === 'week') {
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);
      filtered = filtered.filter(track => new Date(track.playedAt) >= weekAgo);
    } else if (this.timeFilter === 'month') {
      const monthAgo = new Date(now);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      filtered = filtered.filter(track => new Date(track.playedAt) >= monthAgo);
    }

    this.filteredTracks = filtered;
  }

  onPlayTrack(track: Track) {
// Si la canción clickeada es la misma que está sonando actualmente, la pausamos
    if (this.currentlyPlayingId === track.id) {
      this.currentlyPlayingId = null; // Establecer a null indica que no hay canción reproduciéndose
      console.log(`⏸️ Pausando: ${track.title}`);
    } else {
      // Si es una canción diferente o la misma que estaba pausada, la reproducimos
      this.currentlyPlayingId = track.id;
      console.log(`▶️ Reproduciendo: ${track.title}`);
    }
  }

  onLikeTrack(track: Track) {
    //Tengo que actualizar el estado liked en mi back
    console.log(`💕Super like para: ` + track.title);

    //Actualizar localmente para la demostración
    const index = this.historyTracks.findIndex(track => track.id === track.id);
    if (index !== -1) {
      this.historyTracks[index].isLiked = !this.historyTracks[index].isLiked;
      //refresco la lista filtrada:
      this.filterTracks();
    }
  }

  protected readonly indexedDB = indexedDB;
}
