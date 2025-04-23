import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {CommonModule, NgClass} from '@angular/common';
import {Track} from '../../interfaces/track';
import {Subscription} from 'rxjs';
import {TrackPlayerService} from '../../../services/track-player.service';

@Component({
  selector: 'app-card-song',
  imports: [NgClass, CommonModule],
  templateUrl: './card-song.component.html',
  styleUrl: './card-song.component.css'
})
export class CardSongComponent implements OnInit, OnDestroy{

  @Input() track!: Track;

  isHovered: boolean = false;
  isPlaying: boolean = false;
  private subscriptions: Subscription[] = [];

  constructor(private trackPlayerService: TrackPlayerService) {}

  ngOnInit(): void {
    // Inicializar las propiedades opcionales si no están definidas
    if (this.track) {
      this.track.isLiked = this.track.isLiked !== undefined ? this.track.isLiked : false;
      this.track.playedAt = this.track.playedAt || new Date();
    }

    // Suscribirse para saber si esta pista se está reproduciendo
    this.subscriptions.push(
      this.trackPlayerService.currentTrack$.subscribe(currentTrack => {
        if (currentTrack && this.track) {
          this.isPlaying = currentTrack.id === this.track.id && this.trackPlayerService.isPlayingSubject.value;
        } else {
          this.isPlaying = false;
        }
      }),

      this.trackPlayerService.isPlaying$.subscribe(isPlaying => {
        if (this.trackPlayerService.isCurrentTrack(this.track)) {
          this.isPlaying = isPlaying;
        }
      })
    );
  }

  ngOnDestroy(): void {
    // Limpiar suscripciones
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  playAlbum(): void {
    this.trackPlayerService.playTrack(this.track);
  }
}
