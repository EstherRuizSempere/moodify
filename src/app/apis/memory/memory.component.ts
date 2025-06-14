import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {Card} from '../../interfaces/cards';


@Component({
  selector: 'app-memory',
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './memory.component.html',
  styleUrl: './memory.component.css',
  standalone: true
})
export class MemoryComponent implements OnInit {
  cards: Card[] = [];
  flippedIndexes: number[] = [];
  moves = 0;
  matches = 0;
  gameStatus: 'playing' | 'won' = 'playing';
  gameStarted = false;
  isChecking = false;

  images = [
    'assets/images/emotions/Agradecido.png',
    'assets/songs-image/beller-english.png',
    'assets/images/emotions/Fuerte.png',
    'assets/songs-image/ilike-the-way-you-kiss-me.png',
    'assets/images/emotions/Ansioso.png',
    'assets/images/emotions/Vacaciones.png',
  ];

  ngOnInit() {
    this.startGame();
  }

  startGame() {
    this.gameStatus = 'playing';
    this.moves = 0;
    this.matches = 0;
    this.gameStarted = false;
    this.isChecking = false;
    this.flippedIndexes = [];

    const duplicatedImages = [...this.images, ...this.images];
    this.cards = duplicatedImages
      .sort(() => Math.random() - 0.5)
      .map(img => ({
        image: img,
        flipped: false,
        matched: false
      }));
  }

  flipCard(index: number) {
    if (this.gameStatus !== 'playing' || this.isChecking) return;

    const card = this.cards[index];
    if (card.flipped || card.matched || this.flippedIndexes.length === 2) return;

    if (!this.gameStarted) {
      this.gameStarted = true;
    }

    card.flipped = true;
    this.flippedIndexes.push(index);

    if (this.flippedIndexes.length === 2) {
      this.moves++;
      this.isChecking = true;

      const [firstIdx, secondIdx] = this.flippedIndexes;
      const firstCard = this.cards[firstIdx];
      const secondCard = this.cards[secondIdx];

      if (firstCard.image === secondCard.image) {
        // Coinciden
        setTimeout(() => {
          firstCard.matched = true;
          secondCard.matched = true;
          this.matches++;
          this.flippedIndexes = [];
          this.isChecking = false;
          this.checkWinCondition();
        }, 600);
      } else {
        // No coinciden
        setTimeout(() => {
          firstCard.flipped = false;
          secondCard.flipped = false;
          this.flippedIndexes = [];
          this.isChecking = false;
        }, 1200);
      }
    }
  }

  checkWinCondition() {
    if (this.matches === this.images.length) {
      this.gameStatus = 'won';
    }
  }

  resetGame() {
    this.startGame();
  }

  getPerformanceMessage(): string {
    const efficiency = (this.images.length / this.moves) * 100;
    if (efficiency >= 90) return '🌟 ¡Perfecto! Memoria excepcional';
    if (efficiency >= 70) return '🎯 ¡Excelente! Gran memoria';
    if (efficiency >= 50) return '👍 ¡Bien hecho! Buena memoria';
    return '💪 ¡Completado! Sigue practicando';
  }
}
