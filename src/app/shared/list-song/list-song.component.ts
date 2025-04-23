import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {DatePipe, NgClass} from '@angular/common';
import {Track} from '../../interfaces/track';
import {Subscription} from 'rxjs';
import {TrackPlayerService} from '../../../services/track-player.service';

@Component({
  selector: 'app-list-song',
  imports: [
    NgClass,
    DatePipe
  ],
  templateUrl: './list-song.component.html',
  styleUrl: './list-song.component.css'
})
export class ListSongComponent implements OnInit, OnDestroy {

  @Input() track!: Track;
  @Input() index!: number;
  @Input() isPlaying: boolean = false;

  @Output() play = new EventEmitter<Track>();
  @Output() like = new EventEmitter<Track>();
  isHovered: boolean = false;

  private subscriptions: Subscription[] = [];

  constructor(private trackPlayerService: TrackPlayerService) {
  }

  /**
   * Inicialización del componente:
   * - Establece las suscripciones a los observables del reproductor
   * - Actualiza el estado de reproducción cuando cambia la canción actual o el estado de play/pause
   */
  ngOnInit(): void {
    // Inicializa las propiedades opcionales si no están definidas
    if (this.track) {
      this.track.isLiked = this.track.isLiked !== undefined ? this.track.isLiked : false;
      this.track.playedAt = this.track.playedAt || new Date();
    }

    // Suscripción al track actual para verificar si esta pista es la que se está reproduciendo
    this.subscriptions.push(
      this.trackPlayerService.currentTrack$.subscribe(currentTrack => {
        // Compara el ID del track actual con el track de este componente
        if (currentTrack && this.track) {
          this.isPlaying = currentTrack.id === this.track.id && this.trackPlayerService.isPlayingSubject.value;
        } else {
          this.isPlaying = false;
        }
      }),
      // Suscripción al estado de reproducción para actualizar el UI
      this.trackPlayerService.isPlaying$.subscribe(isPlaying => {
        // Solo actualiza si este track es el que está sonando actualmente
        if (this.trackPlayerService.isCurrentTrack(this.track)) {
          this.isPlaying = isPlaying;
        }
      })
    );
  }

  /**
   * Limpieza antes de destruir el componente:
   * - Cancela todas las suscripciones para evitar memory leaks
   */
  ngOnDestroy(): void {
    // Desuscribe cada una de las suscripciones almacenadas
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  playTrack(): void {
    this.trackPlayerService.playTrack(this.track);
  }

  toggleLike(): void {
    this.track = this.trackPlayerService.toggleLike(this.track);
  }

  formatDuration(durationMs: number): string {
    const seconds = Math.floor(durationMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }
}
