import {Component, OnInit} from '@angular/core';
import {NgForOf} from '@angular/common';
import {Card} from '../../interfaces/cards';


@Component({
  selector: 'app-memory',
  imports: [
    NgForOf
  ],
  templateUrl: './memory.component.html',
  styleUrl: './memory.component.css',
  standalone: true
})
export class MemoryComponent implements OnInit {
  cards: Card[] = [];
  flippedIndexes: number[] = [];

  images = [
    'assets/memory/img1.jpg',
    'assets/memory/img2.jpg',
    'assets/memory/img3.jpg',
    'assets/memory/img4.jpg',
    'assets/memory/img5.jpg',
    'assets/memory/img6.jpg',
  ];

  ngOnInit() {
    this.startGame();
  }

  startGame() {
    const duplicatedImages = [...this.images, ...this.images];
    this.cards = duplicatedImages
      .sort(() => Math.random() - 0.5)
      .map(img => ({ image: img, flipped: false, matched: false }));
  }

  flipCard(index: number) {
    const card = this.cards[index];
    if (card.flipped || card.matched || this.flippedIndexes.length === 2) return;

    card.flipped = true;
    this.flippedIndexes.push(index);

    if (this.flippedIndexes.length === 2) {
      const [firstIdx, secondIdx] = this.flippedIndexes;
      if (this.cards[firstIdx].image === this.cards[secondIdx].image) {
        this.cards[firstIdx].matched = true;
        this.cards[secondIdx].matched = true;
        this.flippedIndexes = [];
      } else {
        setTimeout(() => {
          this.cards[firstIdx].flipped = false;
          this.cards[secondIdx].flipped = false;
          this.flippedIndexes = [];
        }, 1000);
      }
    }
  }
}
