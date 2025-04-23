import {Component, OnDestroy, OnInit} from '@angular/core';
import {CardSongComponent} from '../../../../shared/card-song/card-song.component';
import {Track} from '../../../../interfaces/track';
import {Subscription} from 'rxjs';
import {TrackService} from '../../../../../services/track.service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-album-song-section',
  imports: [
    CardSongComponent, CommonModule
  ],
  templateUrl: './album-song-section.component.html',
  styleUrl: './album-song-section.component.css'
})
export class AlbumSongSectionComponent implements OnInit, OnDestroy {

  tracksRandom: Array<Track> = [];
  listObservers$: Array<Subscription> = [];

  constructor(private trackService: TrackService) {
  }

  ngOnInit() {
    const observer1$ = this.trackService
      .getData()
      .subscribe((respuesta: Track[]) => {
        this.tracksRandom = respuesta;
        console.log('Respuesta de la API:', respuesta);
      });

    this.listObservers$.push(observer1$);
  }

  ngOnDestroy() {
    this.listObservers$.forEach(subscription => subscription.unsubscribe());
  }
}
