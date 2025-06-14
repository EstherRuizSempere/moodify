export interface Cell {
  isMine: boolean;
  revealed: boolean;
  adjacentMines: number;
  flagged: boolean;
}
