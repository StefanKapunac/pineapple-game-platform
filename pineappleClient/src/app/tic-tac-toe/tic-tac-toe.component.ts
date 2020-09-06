import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tic-tac-toe',
  templateUrl: './tic-tac-toe.component.html',
  styleUrls: ['./tic-tac-toe.component.scss']
})
export class TicTacToeComponent implements OnInit {
  readonly WINNING_COMBINATIONS = {
    0: [[1, 2], [3, 6], [4, 8]],
    1: [[0, 2], [4, 7]],
    2: [[0, 1], [5, 8], [4, 6]],
    3: [[0, 6], [4, 5]],
    4: [[3, 5], [1, 7], [0, 8], [2, 6]],
    5: [[3, 4], [2, 8]],
    6: [[0, 3], [7, 8], [2, 4]],
    7: [[1, 4], [6, 8]],
    8: [[6, 7], [2, 5], [0, 4]],
  };

  public player: string;
  public currentPlayer: string;
  public gameOver: boolean;
  public wonPlayer: string;
  public board = ['X', 'X', '', 'O', 'O', 'X', '', '', ''];


  get result() {
    return this.wonPlayer === this.player
      ? 'You won!'
      : 'You lost!';
  }

  handleCellClick(clickedCell) {
    this.board[clickedCell] = this.currentPlayer;
    this.board = [...this.board];

    // PlayMove

    const combinations = this.WINNING_COMBINATIONS[clickedCell];

    combinations.forEach(([firstIndex, secondIndex]) => {
      if (this.board[firstIndex] === this.currentPlayer
          && this.board[secondIndex] === this.currentPlayer) {
        this.wonPlayer = 'X';
        this.gameOver = true;
      }
    });

    if (this.gameOver) {
      return;
    }

    // It's O's turn
    this.currentPlayer = 'O';

    // waiting for other player to play [MovePlayed]
  }

  isCellDisabled(cell) {
    return this.gameOver
      || this.player !== this.currentPlayer
      || this.board[cell] !== '';
  }

  handlePlayAgain() {
    this.board = ['', '', '', '', '', '', '', '', ''];
    this.gameOver = false;
  }

  constructor() {
    // get X or O from backend
    // for now is X
    this.player = 'X';
    this.currentPlayer = 'X';
    this.gameOver = false;
  }

  ngOnInit(): void {
  }
}
