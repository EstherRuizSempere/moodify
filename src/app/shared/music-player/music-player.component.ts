import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Track} from '../../interfaces/track';
import {Subscription} from 'rxjs';
import {TrackPlayerService} from '../../../services/track-player.service';

@Component({
  selector: 'app-music-player',
  imports: [CommonModule],
  templateUrl: './music-player.component.html',
  styleUrl: './music-player.component.css'
})
export class MusicPlayerComponent implements OnInit, OnDestroy {

  currentTrack: Track | null = null;
  isPlaying: boolean = false;
  currentTime: number = 0;
  duration: number = 0;
  volume: number = 0.7;

  private subscriptions: Subscription [] = [];

  constructor(private trackPlayerService: TrackPlayerService) {
  }

  ngOnInit() {
    //Me suscribo a los cambios en el servicio
    this.subscriptions.push(
      this.trackPlayerService.currentTrack$.subscribe(track => {
        this.currentTrack = track;
      }),

      this.trackPlayerService.isPlaying$.subscribe(isPlaying => {
        this.isPlaying = isPlaying;
      }),

      this.trackPlayerService.currentTime$.subscribe(time => {
        this.currentTime = time;
      }),

      this.trackPlayerService.duration$.subscribe(duration => {
          this.duration = duration;
        }
      ),
      this.trackPlayerService.volume$.subscribe(volume => {
        this.volume = volume;
      })
    );
  }

  ngOnDestroy() {
    //Limpiar las suscripciones
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }

  //Métod para controlar la reproducción
  togglePlayPause() {
    this.trackPlayerService.togglePlayPause();
  }

  playNext() {
    this.trackPlayerService.playNext();
  }

  playPrevious() {
    this.trackPlayerService.playPrevious();
  }

  //Controlar el progreso de la canción
  seek(event: MouseEvent) {
    // Obtiene las dimensiones y posición de la barra de progreso
    const progressBar = event.currentTarget as HTMLElement;
    // Obtiene las dimensiones y posición de la barra de progreso
    const rect = progressBar.getBoundingClientRect();
    // Calcula la posición relativa del clic (valor entre 0 y 1):
    // 1. (event.clientX - rect.left) = posición horizontal dentro del elemento
    // 2. Dividido por el ancho total = porcentaje de progreso (0 a 1)
    const clickPosition = (event.clientX - rect.left) / rect.width;

    // Calcular la nueva posición en segundos
    const newTime = this.duration * clickPosition;
    this.trackPlayerService.seekTo(newTime)
  }

  //Controlar el volumen
  setVolume(event: MouseEvent) {
    const volumeBar = event.currentTarget as HTMLElement;
    const rect = volumeBar.getBoundingClientRect();
    const clickPosition = (event.clientX - rect.left) / rect.width;

    //Establecer el volumen entre 0 y 1
    this.trackPlayerService.setVolume(clickPosition);
  }

  toggleLike() {
    if (this.currentTrack) {
      this.currentTrack = this.trackPlayerService.toggleLike(this.currentTrack);
    }
  }

  //Metodo para formatear el tiempo, aseguro que los segundos siempre tengan dos digitos
  formatTime(time: number): string {
    const minutes = Math.floor(time / 60); //Obtengo los minutos completos
    const seconds = Math.floor(time % 60); //Obtengo los segundos restantes
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`; // Formato de dos dígitos
  }

  //Calculo el procentaje de progrso de la reproducción acrtual
  getProgressPercentage(): string {
    if (this.duration <= 0) return '0%'; // Si la duración es 0, no se puede calcular el porcentaje
    return `${(this.currentTime / this.duration) * 100}%`; //Calculo un porcentaje de duración de canción normal
  }

  //Calculo el porcentaje de volumen y lo devuelvo como algo legible
  getVolumePercentage(): string {
    return `${this.volume * 100}%`;// Convierte fracción a porcentaje
  }
}
