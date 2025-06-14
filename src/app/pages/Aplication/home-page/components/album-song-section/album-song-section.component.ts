import {Component, OnDestroy, OnInit} from '@angular/core';
import {Track} from '../../../../../interfaces/track';
import {Subscription} from 'rxjs';
import {TrackService} from '../../../../../../services/track.service';
import {CommonModule} from '@angular/common';
import {CardPlaylistComponent} from '../../../../../shared/card-playlist/card-playlist.component';
import {PlayListService} from '../../../../../../services/play-list.service';
import {Playlists} from '../../../../../interfaces/playlists';

@Component({
  selector: 'app-album-song-section',
  imports: [
    CommonModule, CardPlaylistComponent
  ],
  templateUrl: './album-song-section.component.html',
  styleUrl: './album-song-section.component.css'
})
export class AlbumSongSectionComponent implements OnInit, OnDestroy {

  tracksRandom: Array<Track> = [];
  playlists: Array<Playlists> = [];

  listObservers$: Array<Subscription> = [];

  constructor(
    private trackService: TrackService,
    private playlistService: PlayListService
  ) {
  }

  ngOnInit() {
    const observer1$ = this.trackService
      .getData()
      .subscribe((respuesta: Track[]) => {
        this.tracksRandom = respuesta;
        console.log('Respuesta de la API:', respuesta);
      });

    const observer2$ = this.playlistService
      .getPlaylists()
      .subscribe((respuesta: Playlists[]) => {
        this.playlists = respuesta;
        console.log('Playlists cargadas:', respuesta);
      });

    this.listObservers$.push(observer1$, observer2$);
  }

  ngOnDestroy() {
    this.listObservers$.forEach(subscription => subscription.unsubscribe());
  }
}
