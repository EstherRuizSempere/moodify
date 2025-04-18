import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DatePipe, NgClass} from '@angular/common';


export interface Track {
  id: string | number;
  title: string;
  artist: string;
  album: string;
  imageUrl: string;
  duration: number;
  playedAt: Date;
  isLiked: boolean;
}

@Component({
  selector: 'app-list-song',
  imports: [
    NgClass,
    DatePipe
  ],
  templateUrl: './list-song.component.html',
  styleUrl: './list-song.component.css'
})
export class ListSongComponent {

  @Input() track!: Track;
  @Input() index: number = 0;
  @Input() isPlaying: boolean = false;

  @Output() play = new EventEmitter<Track>();
  @Output() like = new EventEmitter<Track>();

  isHovered: boolean = false;

  constructor() { }

  playTrack(): void {
    this.play.emit(this.track);
  }

  toggleLike(): void {
    this.like.emit(this.track);
  }

  formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }

}
