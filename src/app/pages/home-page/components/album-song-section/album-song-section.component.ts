import { Component } from '@angular/core';
import {CardSongComponent} from '../../../../shared/card-song/card-song.component';
import {HistoryPageComponent} from '../../../history-page/history-page.component';

@Component({
  selector: 'app-album-song-section',
  imports: [
    CardSongComponent,
    HistoryPageComponent
  ],
  templateUrl: './album-song-section.component.html',
  styleUrl: './album-song-section.component.css'
})
export class AlbumSongSectionComponent {

}
