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

}
