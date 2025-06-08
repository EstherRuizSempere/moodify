import {Component, OnInit} from '@angular/core';
import {Cell} from '../../interfaces/cell';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-buscaminas',
  imports: [
    NgForOf
  ],
  templateUrl: './buscaminas.component.html',
  styleUrl: './buscaminas.component.css',
  standalone: true
})
export class BuscaminasComponent implements OnInit {
  grid: Cell[] = [];
  lives = 2;

  ngOnInit() {
    this.generateGrid();
  }

  generateGrid() {
    const totalCells = 64;
    const mineCount = 10;
    this.lives = 2;
    this.grid = Array.from({ length: totalCells }, () => ({
      isMine: false,
      revealed: false,
      adjacentMines: 0
    }));

    let minesPlaced = 0;
    while (minesPlaced < mineCount) {
      const i = Math.floor(Math.random() * totalCells);
      if (!this.grid[i].isMine) {
        this.grid[i].isMine = true;
        minesPlaced++;
      }
    }

    for (let i = 0; i < totalCells; i++) {
      this.grid[i].adjacentMines = this.countAdjacentMines(i);
    }
  }

  countAdjacentMines(index: number): number {
    const cols = 8;
    const row = Math.floor(index / cols);
    const col = index % cols;

    let count = 0;
    for (let r = row - 1; r <= row + 1; r++) {
      for (let c = col - 1; c <= col + 1; c++) {
        const i = r * cols + c;
        if (r >= 0 && c >= 0 && r < cols && c < cols && i !== index && this.grid[i]?.isMine) {
          count++;
        }
      }
    }
    return count;
  }

  revealCell(index: number) {
    const cell = this.grid[index];
    if (cell.revealed) return;

    cell.revealed = true;

    if (cell.isMine) {
      this.lives--;
      if (this.lives === 0) {
        alert('💥 ¡Has perdido! Reiniciando...');
        this.generateGrid();
      } else {
        alert(`⚠️ ¡Has pisado una mina! Te quedan ${this.lives} vida(s).`);
      }
    } else if (cell.adjacentMines === 0) {
      this.revealAdjacent(index);
    }
  }

  revealAdjacent(index: number) {
    const cols = 8;
    const row = Math.floor(index / cols);
    const col = index % cols;

    for (let r = row - 1; r <= row + 1; r++) {
      for (let c = col - 1; c <= col + 1; c++) {
        const i = r * cols + c;
        if (r >= 0 && c >= 0 && r < cols && c < cols && !this.grid[i]?.revealed) {
          this.revealCell(i);
        }
      }
    }
  }
}
