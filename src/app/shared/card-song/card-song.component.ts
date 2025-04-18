import {Component, Input} from '@angular/core';
import {NgClass} from '@angular/common';

interface Album {
  id: string | number;
  title: string;
  artist: string;
  coverUrl: string;
}

@Component({
  selector: 'app-card-song',
  imports: [NgClass],
  templateUrl: './card-song.component.html',
  styleUrl: './card-song.component.css'
})
export class CardSongComponent {

  @Input() album: Album = {
    id: '',
    title: 'Título del Álbum',
    artist: 'Nombre del Artista',
    coverUrl: 'assets/images/holiday-brain.png',
  };
  isHovered: boolean = false;

  playAlbum():void{
    console.log(`Aquí se tendría que reproducir la canción ${this.album.title} de ${this.album.artist}`)
  }
}
