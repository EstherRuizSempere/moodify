import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { Playlists } from '../../interfaces/playlists';
import { Subscription } from 'rxjs';
import { TrackPlayerService } from '../../../services/track-player.service';
import { TrackService } from '../../../services/track.service';
import { Track } from '../../interfaces/track';

@Component({
  selector: 'app-card-playlist',
  imports: [NgClass],
  templateUrl: './card-playlist.component.html',
  styleUrl: './card-playlist.component.css'
})
export class CardPlaylistComponent implements OnInit, OnDestroy {

  @Input() playlist!: Playlists;

  isHovered: boolean = false;
  isPlaying: boolean = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private trackPlayerService: TrackPlayerService,
    private trackService: TrackService
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.trackPlayerService.currentTrack$.subscribe(currentTrack => {
        if (currentTrack && this.playlist) {
          // Verificar si la canción actual pertenece a esta playlist
          this.isPlaying = this.playlist.trackIds.includes(currentTrack.id.toString()) &&
            this.trackPlayerService.isPlayingSubject.value;
        } else {
          this.isPlaying = false;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  playPlaylist(): void {
    if (this.playlist.trackIds.length > 0) {
      this.trackService.getData().subscribe(tracks => {
        const playlistTracks = this.playlist.trackIds
          .map(id => tracks.find(t => t.id.toString() === id.toString()))
          .filter(t => !!t) as Track[];

        this.trackPlayerService.playPlaylist(playlistTracks);
        console.log('Reproduciendo playlist:', this.playlist.name);
      });
    }
  }

  get hasImage(): boolean {
    return !!this.playlist.image;
  }
}
