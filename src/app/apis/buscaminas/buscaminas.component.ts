import {Component, OnInit} from '@angular/core';
import {Cell} from '../../interfaces/cell';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-buscaminas',
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './buscaminas.component.html',
  styleUrl: './buscaminas.component.css',
  standalone: true
})
export class BuscaminasComponent implements OnInit {
  grid: Cell[] = [];
  lives = 3;
  gameStatus: 'playing' | 'won' | 'lost' = 'playing';
  revealedCells = 0;
  totalSafeCells = 54; // 64 - 10 minas
  gameStarted = false;

  ngOnInit() {
    this.generateGrid();
  }

  generateGrid() {
    const totalCells = 64;
    const mineCount = 10;
    this.lives = 3;
    this.gameStatus = 'playing';
    this.revealedCells = 0;
    this.gameStarted = false;

    this.grid = Array.from({length: totalCells}, () => ({
      isMine: false,
      revealed: false,
      adjacentMines: 0,
      flagged: false
    }));

    // Colocar minas aleatoriamente
    let minesPlaced = 0;
    while (minesPlaced < mineCount) {
      const i = Math.floor(Math.random() * totalCells);
      if (!this.grid[i].isMine) {
        this.grid[i].isMine = true;
        minesPlaced++;
      }
    }

    // Calcular números adyacentes
    for (let i = 0; i < totalCells; i++) {
      if (!this.grid[i].isMine) {
        this.grid[i].adjacentMines = this.countAdjacentMines(i);
      }
    }
  }

  countAdjacentMines(index: number): number {
    const cols = 8;
    const row = Math.floor(index / cols);
    const col = index % cols;

    let count = 0;
    for (let r = row - 1; r <= row + 1; r++) {
      for (let c = col - 1; c <= col + 1; c++) {
        if (r >= 0 && c >= 0 && r < 8 && c < cols) {
          const i = r * cols + c;
          if (i !== index && this.grid[i]?.isMine) {
            count++;
          }
        }
      }
    }
    return count;
  }

  revealCell(index: number) {
    if (this.gameStatus !== 'playing') return;

    const cell = this.grid[index];
    if (cell.revealed || cell.flagged) return;

    this.gameStarted = true;
    cell.revealed = true;
    this.revealedCells++;

    if (cell.isMine) {
      this.lives--;
      if (this.lives === 0) {
        this.gameStatus = 'lost';
        this.revealAllMines();
      }
    } else {
      if (cell.adjacentMines === 0) {
        this.revealAdjacent(index);
      }
      this.checkWinCondition();
    }
  }

  revealAdjacent(index: number) {
    const cols = 8;
    const row = Math.floor(index / cols);
    const col = index % cols;

    for (let r = row - 1; r <= row + 1; r++) {
      for (let c = col - 1; c <= col + 1; c++) {
        if (r >= 0 && c >= 0 && r < 8 && c < cols) {
          const i = r * cols + c;
          if (i !== index && !this.grid[i]?.revealed && !this.grid[i]?.flagged) {
            this.revealCell(i);
          }
        }
      }
    }
  }

  flagCell(event: MouseEvent, index: number) {
    event.preventDefault();
    if (this.gameStatus !== 'playing') return;

    const cell = this.grid[index];
    if (cell.revealed) return;

    cell.flagged = !cell.flagged;
  }

  revealAllMines() {
    this.grid.forEach(cell => {
      if (cell.isMine) {
        cell.revealed = true;
      }
    });
  }

  checkWinCondition() {
    const safeCellsRevealed = this.grid.filter(cell => !cell.isMine && cell.revealed).length;
    if (safeCellsRevealed === this.totalSafeCells) {
      this.gameStatus = 'won';
    }
  }

  resetGame() {
    this.generateGrid();
  }

  getCellDisplay(cell: Cell): string {
    if (!cell.revealed) {
      return cell.flagged ? '🚩' : '';
    }
    if (cell.isMine) {
      return '💣';
    }
    return cell.adjacentMines > 0 ? cell.adjacentMines.toString() : '';
  }

  getCellClass(cell: Cell): string {
    let classes = '';
    if (cell.revealed) {
      classes += 'revealed ';
      if (cell.isMine) {
        classes += 'mine ';
      } else if (cell.adjacentMines > 0) {
        classes += `number-${cell.adjacentMines} `;
      }
    }
    if (cell.flagged) {
      classes += 'flagged ';
    }
    return classes.trim();
  }
}
