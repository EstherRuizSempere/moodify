import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Track } from '../app/interfaces/track';
import { TrackService } from './track.service';

@Injectable({
  providedIn: 'root'
})
export class TrackPlayerService {

  private audioElement: HTMLAudioElement;

  // Estado actual de la reproducción
  /**
   * Emite la canción actualmente en reproducción o null si no hay ninguna.
   * Valor inicial: null (ninguna canción seleccionada)
   */
  private currentTrackSubject = new BehaviorSubject<Track | null>(null);
  // indica si la reproducción está activa o no, de ahí el bolean, pausado por defecto
  isPlayingSubject = new BehaviorSubject<boolean>(false);
  // Emite el tiempo actual de reproducción en segundos. El valor inicial 0
  private currentTimeSubject = new BehaviorSubject<number>(0);
  // Emite la duración total de la canción actual en segundos. Valor inicial 0
  private durationSubject = new BehaviorSubject<number>(0);
  // Almaceno el volumen de la canción que se está reproduciendo con el valor inicial 0.7 que equivale al 70% que no es ni muy alto ni muy bajo
  private volumeSubject = new BehaviorSubject<number>(0.7);

  // -------------------------------------------------------------------------
  // Gestión de playlist
  // -------------------------------------------------------------------------

  // Emite la lista completa de canciones de la playlist actual. Valor inicial un array vacío
  private playlistSubject = new BehaviorSubject<Track[]>([]);
  // Emite el índice de la canción actual dentro de la playlist. Valor inicial -1 que indica que no hay ninguna canción reproduciéndose
  private currentIndexSubject = new BehaviorSubject<number>(-1);


  constructor(private trackService: TrackService) {
    // Inicializa el elemento de audio HTML5 que manejará la reproducción
    this.audioElement = new Audio();

    // Escucha eventos de actualización de tiempo para sincronizar el progreso
    this.audioElement.addEventListener('timeupdate', () => {
      this.currentTimeSubject.next(this.audioElement.currentTime);
    });

    // Escucha cambios en la duración del audio
    this.audioElement.addEventListener('durationchange', () => {
      this.durationSubject.next(this.audioElement.duration);
    });

    // Maneja el evento de finalización de canción para reproducir la siguiente
    this.audioElement.addEventListener('ended', () => {
      this.playNext();
    });

    // Sincroniza el estado de pausa con el subject correspondiente
    this.audioElement.addEventListener('pause', () => {
      this.isPlayingSubject.next(false);
    });

    // Sincroniza el estado de reproducción con el subject correspondiente
    this.audioElement.addEventListener('play', () => {
      this.isPlayingSubject.next(true);
    });

    // Establece el volumen inicial del elemento de audio
    this.audioElement.volume = this.volumeSubject.getValue();

    // Carga la lista de canciones al iniciar
    this.loadPlaylist();
  }

  // Método para cargar la playlist desde el servicio
  private loadPlaylist(): void {
    this.trackService.getData().subscribe({
      next: (tracks) => {
        this.playlistSubject.next(tracks);
      },
      error: (error) => {
        console.error('Error al cargar la playlist:', error);
      }
    });
  }

  // -------------------------------------------------------------------------
  // Getters para los Observables (para suscripción desde componentes)
  // -------------------------------------------------------------------------

  /** Observable que emite la canción actual en reproducción */
  get currentTrack$(): Observable<Track | null> {
    return this.currentTrackSubject.asObservable();
  }

  /** Observable que emite el estado de reproducción (true = reproduciendo) */
  get isPlaying$(): Observable<boolean> {
    return this.isPlayingSubject.asObservable();
  }

  /** Observable que emite el tiempo actual de reproducción en segundos */
  get currentTime$(): Observable<number> {
    return this.currentTimeSubject.asObservable();
  }

  /** Observable que emite la duración total de la canción actual en segundos */
  get duration$(): Observable<number> {
    return this.durationSubject.asObservable();
  }

  /** Observable que emite el nivel de volumen actual (0 a 1) */
  get volume$(): Observable<number> {
    return this.volumeSubject.asObservable();
  }

  /** Observable que emite la lista completa de canciones de la playlist actual */
  get playlist$(): Observable<Track[]> {
    return this.playlistSubject.asObservable();
  }

  /** Observable que emite el índice de la canción actual dentro de la playlist */
  get currentIndex$(): Observable<number> {
    return this.currentIndexSubject.asObservable();
  }

  // -------------------------------------------------------------------------
  // Métodos públicos para controlar la reproducción
  // -------------------------------------------------------------------------

  /**
   * Reproduce una canción específica. Si ya está reproduciendo la misma canción,
   * alterna entre pausa y reproducción.
   * @param track - La canción a reproducir
   */
  playTrack(track: Track) {
    const currentTrack = this.currentTrackSubject.value;
    console.log('Intentando reproducir:', track);

    // Si ya está reproduciendo esta canción, alterna play/pause
    if (currentTrack && currentTrack.id === track.id) {
      this.togglePlayPause();
      return;
    }

    // Asegúrate de que isLiked esté definido
    if (track.isLiked === undefined) {
      track.isLiked = false;
    }

    // Configura y reproduce la nueva canción
    if (track.songUrl) {
      this.audioElement.src = track.songUrl;
      this.currentTrackSubject.next(track);

      // Actualiza el índice si la canción está en la playlist
      const playlist = this.playlistSubject.value;
      const trackIndex = playlist.findIndex(t => t.id === track.id);
      if (trackIndex !== -1) {
        this.currentIndexSubject.next(trackIndex);
      }

      // Registra que esta canción ha sido reproducida
      this.trackService.updateTrackPlayed(track.id);

      this.audioElement.load();
      this.audioElement.play()
        .then(() => {
          this.isPlayingSubject.next(true);
        })
        .catch(error => {
          console.error('Error al reproducir la canción:', error);
        });
    } else {
      console.error('No se puede reproducir: URL de canción no válida');
    }
  }

  /**
   * Establece una nueva playlist y comienza a reproducir desde el índice especificado
   * @param tracks - Array de canciones que componen la playlist
   * @param startIndex - Índice de la canción por la que comenzar (0 por defecto)
   */
  playPlaylist(tracks: Track[], startIndex: number = 0) {
    if (tracks.length === 0) return;

    // Inicializar isLiked para cada track si no está definido
    const tracksWithLike = tracks.map(track => ({
      ...track,
      isLiked: track.isLiked !== undefined ? track.isLiked : false,
      playedAt: track.playedAt || new Date()
    }));

    // Actualiza el estado de la playlist con el nuevo array de canciones
    this.playlistSubject.next(tracksWithLike);
    // Establece el índice de la canción actual dentro de la playlist
    this.currentIndexSubject.next(startIndex);
    // Inicia la reproducción de la canción en la posición startIndex
    this.playTrack(tracksWithLike[startIndex]);
  }

  // Función para alternar entre los estados de reproducción y pause de la canción actual
  togglePlayPause() {
    // Verifica si hay una canción seleccionada para reproducir
    if (!this.currentTrackSubject.value) {
      // Si no hay canción seleccionada, intentamos reproducir la primera de la playlist
      const playlist = this.playlistSubject.value;
      if (playlist.length > 0) {
        this.playTrack(playlist[0]);
        return;
      }
      return; // No hay canción actual ni playlist, salir sin hacer nada
    }

    // Gestiona el cambio de estado basado en el estado actual
    if (this.isPlayingSubject.value) {
      // Si está reproduciendo, pausa la canción
      this.audioElement.pause();
    } else {
      // Si está pausado, intenta reanudar la reproducción
      this.audioElement.play()
        .catch(error => console.error('Error al reproducir la canción:', error));
    }
  }

  // función para avanzar la siguiente canción de la playlist
  playNext() {
    // Obtiene la playlist actual y el índice de la canción en reproducción
    const playlist = this.playlistSubject.value;
    let currentIndex = this.currentIndexSubject.value;

    // Si no hay canciones en la playlist, termina la ejecución
    if (playlist.length === 0) return;

    // Calcula el nuevo índice con comportamiento circular (% playlist.length)
    currentIndex = (currentIndex + 1) % playlist.length;
    // Actualiza el índice de la canción actual en el estado
    this.currentIndexSubject.next(currentIndex);
    // Reproduce la nueva canción seleccionada
    this.playTrack(playlist[currentIndex]);
  }

  // función para reproducir la canción anterior de la playlist
  playPrevious() {
    const playlist = this.playlistSubject.value;
    let currentIndex = this.currentIndexSubject.value;

    // Si no hay canciones en la playlist, termina la ejecución
    if (playlist.length === 0) return;

    // Si llevamos más de tres segundos reproduciendo, vuelvo al inicio de la canción
    if (this.audioElement.currentTime > 3) {
      // Reinicia la canción actual en lugar de cambiar de canción
      this.seekTo(0);
      return;
    }

    // Calcula el nuevo índice con comportamiento circular:
    // (currentIndex - 1 + length) % length evita índices negativos
    currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    // Actualiza el estado con el nuevo índice
    this.currentIndexSubject.next(currentIndex);
    // Comienza la reproducción de la nueva canción
    this.playTrack(playlist[currentIndex]);
  }

  // Mueve el punto de reproducción actual a una posición específica en segundos.
  seekTo(time: number): void {
    // Verifica si hay una fuente de audio cargada (canción seleccionada)
    if (this.audioElement.src) {
      // Establece el tiempo de reproducción al valor especificado
      this.audioElement.currentTime = time;
    }
  }

  setVolume(level: number): void {
    // Aseguro que el volumen esté entre 0 y 1
    const newVolume = Math.max(0, Math.min(1, level));
    // Establezco el volumen del elemento de audio
    this.audioElement.volume = newVolume;
    // Actualizo el volumen en el BehaviorSubject para notificar a los suscriptores
    this.volumeSubject.next(newVolume);
  }

  /**
   * Alterna el estado "me gusta" de una canción y actualiza todos los estados relacionados.
   * @param track - La canción cuyo "like" se va a alternar
   * @returns La canción actualizada con el nuevo estado "isLiked"
   */
  toggleLike(track: Track): Track {
    console.log('Cambiando like:', track);

    // Asegúrate de que isLiked esté definido antes de invertirlo
    const isLiked = track.isLiked !== undefined ? track.isLiked : false;

    // Crea una nueva instancia de la canción con el estado "isLiked" invertido
    const updatedTrack = { ...track, isLiked: !isLiked };

    // Actualiza el estado del like en el servicio central
    this.trackService.updateTrackLiked(track.id, !isLiked);

    // Crea una nueva playlist con la canción actualizada (o las originales si no coinciden)
    const playlist = this.playlistSubject.value;
    const updatedPlaylist = playlist.map(t =>
      t.id === track.id ? updatedTrack : t
    );
    // Emite la nueva versión de la playlist a todos los suscriptores
    this.playlistSubject.next(updatedPlaylist);

    // Actualizar la pista actual si es la misma que estamos modificando
    const currentTrack = this.currentTrackSubject.value;
    if (currentTrack && currentTrack.id === track.id) {
      // Si la canción actual es la que se está modificando, actualiza su estado
      this.currentTrackSubject.next(updatedTrack);
    }

    return updatedTrack;
  }

  /**
   * Verifica si una canción dada es la que se está reproduciendo actualmente
   * @param track - La canción a verificar
   * @returns true si la canción es la actualmente en reproducción, false en caso contrario
   */
  isCurrentTrack(track: Track): boolean {
    const currentTrack = this.currentTrackSubject.value;
    // Compara los IDs teniendo en cuenta que currentTrack podría ser null
    return currentTrack !== null && currentTrack.id === track.id;
  }

  /**
   * Limpia los recursos del reproductor cuando el servicio se destruye.
   */
  dispose(): void {
    this.audioElement.pause();
    this.audioElement.src = '';
  }
}
