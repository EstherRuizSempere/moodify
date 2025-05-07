import {Component, OnInit} from '@angular/core';
import {Track} from '../../../interfaces/track';
import {TrackService} from '../../../../services/track.service';
import {TrackPlayerService} from '../../../../services/track-player.service';
import {ListSongComponent} from '../../../shared/list-song/list-song.component';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-favorites-page',
  imports: [
    ListSongComponent,
    FormsModule
  ],
  templateUrl: './favorites-page.component.html',
  styleUrl: './favorites-page.component.css'
})
export class FavoritesPageComponent implements OnInit {
  favoriteTracks: Track[] = [];
  filteredTracks: Track[] = [];
  currentPlayingId: string | number | null = null;


  searchTerm: string = '';
  sortFilter: string = 'recent';

  constructor(private trackService: TrackService, private trackPlayerService: TrackPlayerService) {
  }

  ngOnInit() {
    this.loadFavoriteTracks();

    //Me suscribo al track actual y el estado de reproducción
    this.trackPlayerService.currentTrack$.subscribe(track => {
      if(track){
        this.currentPlayingId = track.id;
      }else {
        this.currentPlayingId = null;
      }
    });
    // // Suscribirse a cambios en el estado de reproducción
    // this.trackPlayerService.isPlaying$.subscribe(isPlaying => {
    //
    // });
  }

  loadFavoriteTracks() {
    this.trackService.getFavorites().subscribe({
      next: (tracks) => {
        //   Aseguro que todas las canciones tengan la poropiedad addedToFavoritesAt
        this.favoriteTracks = tracks.map(track => ({
          ...track,
          addedToFavoritesAt: track.addedToFavoritesAt || new Date()
        }));
        this.filterAndSortTracks();
      },
      error: (error) => {
        console.error('Error al cargar las canciones favoritas: ', error)
      }
    });
  }

  filterAndSortTracks() {
    //Filtrar por terminos de búsqueda
    let filtered = [...this.favoriteTracks];
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(track =>
        track.name.toLowerCase().includes(term) ||
        track.artist.toLowerCase().includes(term) ||
        track.album.toLowerCase().includes(term)
      );
    }

    //Ordenar dependiendo el filtro
    switch (this.sortFilter) {
      case 'recent':
        //Añadido a favoritos más recientemente
        filtered.sort((a, b) => {
          const dateA = a.addedToFavoritesAt ? new Date(a.addedToFavoritesAt) : new Date(0);
          const dateB = b.addedToFavoritesAt ? new Date(b.addedToFavoritesAt) : new Date(0);
          return dateB.getTime() - dateA.getTime();
        });
        break;
      //Alfabeticamente
      case 'az':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'za':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'artist':
        filtered.sort((a, b) => a.artist.localeCompare(b.artist));
        break;
    }
    this.filteredTracks = filtered;
  }

  onPlayTrack(event: any){
    //Uso el servicio para enlazar la reproducción
    const track = this.favoriteTracks.find(t=> t.id ===event.id);
    if(track){
      this.trackPlayerService.playTrack(track);
    }
  }

  removeFromFavorites(event:any){
    console.log('Adiós canción de mis favoritos D: 😔' + event.name);

    //Uso el servicio para quitar el like
    const track = this.favoriteTracks.find(t => t.id === event.id);
    if(track){
      this.trackPlayerService.toggleLike(track);
      //Update de la lista
      this.loadFavoriteTracks();
    }
  }
}

