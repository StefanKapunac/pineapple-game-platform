import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as signalR from '@aspnet/signalr';
import { AuthService } from '../services/auth.service';

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
  public board = ['', '', '', '', '', '', '', '', ''];
  public numberOfMoves = 0;

  private hubConnection: signalR.HubConnection;

  startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:5433/gamehub')
      .build();
    
    this.hubConnection
      .start()
      .then(async () => {
        console.log('Connection with gamehub started');

        this.hubConnection.on('MovePlayed', (move) => {
          if(move.role !== this.player) {
            this.numberOfMoves++;
            this.board[move.field] = move.role;
            const combinations = this.WINNING_COMBINATIONS[move.field];

            combinations.forEach(([firstIndex, secondIndex]) => {
              if (this.board[firstIndex] === this.currentPlayer
                  && this.board[secondIndex] === this.currentPlayer) {
                this.wonPlayer = this.currentPlayer;
                this.gameOver = true;
              }

              if (this.numberOfMoves === 9) {
                this.gameOver = true;
              }
            }); 
  
            this.currentPlayer = this.player;
          }
        });

        this.hubConnection.on('RoleAssigned', (role) => {
          console.log("User: ", this.authService.username,", role: ", role);
          this.player = role;
        })

        const roomId = this.route.snapshot.params.roomId;
        console.log("Join: ", this.authService.username);
        var rand = (Math.random()*2.5);
        setTimeout(async () => {await this.hubConnection.send('Join', this.authService.username, roomId, 'XO')}, rand);
      })
      .catch(err => {
        console.log('Error while starting connection with gamehub: ' + err);
      });
  }

  get result() {
    if (this.wonPlayer === this.player) {
      return 'You won!';
    } else if (this.wonPlayer == this.currentPlayer) {
      return 'You lost!';
    } else {
      return 'It\'s a draw!';
    }
  }

  async handleCellClick(clickedCell) {
    this.numberOfMoves++;
    this.board[clickedCell] = this.currentPlayer;
    this.board = [...this.board];

    const roomId = this.route.snapshot.params.roomId;
    const move = {
      playerName: this.authService.username,
      role: this.player,
      field: clickedCell,
    }
    await this.hubConnection.send('PlayXOMove', move, roomId);

    const combinations = this.WINNING_COMBINATIONS[clickedCell];

    combinations.forEach(([firstIndex, secondIndex]) => {
      if (this.board[firstIndex] === this.currentPlayer
          && this.board[secondIndex] === this.currentPlayer) {
        this.wonPlayer = this.currentPlayer;
        this.gameOver = true;
      }
    });

    if (this.numberOfMoves === 9) {
      this.gameOver = true;
    }

    if (this.gameOver) {
      return;
    }

    this.currentPlayer = (this.player === 'O' ? 'X' : 'O');
  }

  isCellDisabled() {
    return this.gameOver
      || this.player !== this.currentPlayer;
  }

  isCellPressed(cell) {
    return this.board[cell] !== '';
  }

  constructor(public authService: AuthService,
              public route: ActivatedRoute) {
    this.startConnection();
    this.player = 'X';
    this.currentPlayer = 'X';
    this.gameOver = false;
  }

  ngOnInit(): void {
  }
}
