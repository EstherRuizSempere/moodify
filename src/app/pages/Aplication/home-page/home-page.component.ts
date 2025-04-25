import {Component} from '@angular/core';
import {AlbumSongSectionComponent} from './components/album-song-section/album-song-section.component';
import {TitleSectionComponent} from './components/title-section/title-section.component';
import {HistoryPageComponent} from "../history-page/history-page.component";


@Component({
  selector: 'app-home-page',
  imports: [
    AlbumSongSectionComponent,
    TitleSectionComponent,
    HistoryPageComponent
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {
  //
  // constructor(private spotify: SpotifyService) {
  // }
  //
  // songs: Song[] = []; // Inicializa la variable songs como un array vacío
  // ngOnInit() {
  //   this.spotify.getArtistAndAlbums().subscribe({
  //     next: (data) => {
  //       this.songs = data;
  //       console.log('Datos recibidos:', data); // ← Verifica en consola
  //     },
  //     error: (err) => console.error('Error:', err)
  //   });
  // }
}
