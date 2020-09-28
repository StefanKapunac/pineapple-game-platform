import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import * as signalR from '@aspnet/signalr';
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-hangman',
  templateUrl: './hangman.component.html',
  styleUrls: ['./hangman.component.scss']
})
export class HangmanComponent implements OnInit {
  
  private hubConnection: signalR.HubConnection;
  
  public player = '';
  public currentPlayer: string;
  public wonPlayer: string;
  public gameOver = false;
  private roomId = 0;

  public keyboard = [];
  public guessedIncorrectLetters = [];

  public pickedWord = '';
  public wordIsPicked = false;
  public guessedWord: string[];

  public numOfGuessedLetters = 0;

  startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:5433/gamehub')
      .build();
    
    this.hubConnection
      .start()
      .then(async () => {
        console.log('Game connection started');
	this.currentPlayer = 'Choose';

        this.hubConnection.on('MovePlayed', (move) => {
          console.log('move played signal cought');
          console.log(move);

          if(this.wordIsPicked){
            this.checkMove(move);
	    this.currentPlayer = (this.currentPlayer === 'Guess1') ? 'Guess2' : 'Guess1';
          }
          else{
            console.log('word still not picked');
            this.pickedWord = move.word;
            console.log(move.word);
            this.wordIsPicked = true; 
            this.guessedWord = '_'.repeat(this.pickedWord.length).split('');
            console.log('word is choosen');
	    this.currentPlayer = 'Guess1';
          }
        });

        this.hubConnection.on('RoleAssigned', (role) => {
          this.player = role;
          console.log('role assigned');
          console.log(role);
        });

        this.roomId = this.route.snapshot.params.roomId;
        var rand = (Math.random()*2.5);
        setTimeout(async () => {await this.hubConnection.send('Join', this.authService.username, this.roomId, 'Hangman')}, rand);
      })
      .catch(err => {
        console.log('Error while starting game connection: ' + err);
      });
  }

  constructor(public authService: AuthService,
              public route: ActivatedRoute) {
    const firstKeyboardRow = [];
    'QWERTYUIOP'.split('').forEach(letter => {
      firstKeyboardRow.push({letter, pressed: false});
    });

    const secondKeyboardRow = [];
    'ASDFGHJKL'.split('').forEach(letter => {
      secondKeyboardRow.push({letter, pressed: false});
    });

    const thirdKeyboardRow = [];
    'ZXCVBNM'.split('').forEach(letter => {
      thirdKeyboardRow.push({letter, pressed: false});
    });

    this.keyboard.push(firstKeyboardRow);
    this.keyboard.push(secondKeyboardRow);
    this.keyboard.push(thirdKeyboardRow);
    
    this.startConnection();
    
  }

  get result() {
    return this.wonPlayer === this.player
      ? 'You won!'
      : 'You lost!';
  }

  get turn() {
    if (this.player === 'Choose' && this.currentPlayer != 'Choose'){
      return this.currentPlayer === 'Guess1'
      ? 'Player 1 is playing!'
      : 'Player 2 is playing!';
    }
    return this.currentPlayer === this.player
      ? 'Your turn!'
      : 'Please wait for your turn.';
  }
  
  findRow (letter) {
    if ('QWERTYUIOP'.indexOf(letter.toUpperCase()) > -1) {
      return 0;
    } 
    else if ('ASDFGHJKL'.indexOf(letter.toUpperCase()) > -1){
      return 1;
    }
    else {
      return 2;
    }
  };

  checkMove (move) {
    let letter = move.letter;
    let rowIndex = this.findRow(letter);
    const foundKey = this.keyboard[rowIndex].find(key => key.letter === letter);
    foundKey.pressed = true;
    
    if (this.pickedWord.indexOf(letter) > -1 ||
        this.pickedWord.indexOf(letter.toLowerCase()) > -1) {
      for (let i = 0; i < this.pickedWord.length; i++) {
        if (this.pickedWord[i] === letter.toLowerCase() ||
            this.pickedWord[i] === letter) {
          this.guessedWord[i] = letter;
          this.numOfGuessedLetters++;
        }
      }

      if (this.pickedWord.length === this.numOfGuessedLetters){
        this.wonPlayer = move.role;
        this.gameOver = true;
      }
    } else {
      this.guessedIncorrectLetters.push(letter);

      if (this.guessedIncorrectLetters.length === 7) {
        this.wonPlayer = 'Choose';
        this.gameOver = true;
      }
    }

    if (this.gameOver) {
      this.keyboard = [...this.keyboard.map((row) => {
        return row.map((key) => {
          return {
            letter: key.letter,
            pressed: true,
          };
        });
      })];
    }
  }


  onChooseWord() {
    console.log('choose word function...');
    if (this.pickedWord){
      const move = {
        PlayerName: this.authService.username,
        Role: this.player,
        Word: this.pickedWord,
        Letter: "_",
        BodyPart: ''
      }
      this.playMove(move);
    }
  }


  onClickLetter(letter: string, rowIndex: number) {
    if(this.currentPlayer == this.player){
      const move = {
        PlayerName: this.authService.username,
        Role: this.player,
        Word: "pineapple",
        Letter: letter,
        BodyPart: ''
      }
      this.playMove(move);
    }
  }

  ngOnInit(): void {
  }

  async playMove(move) {
    console.log('inside this.playMove');
    await this.hubConnection.send('PlayHangmanMove', move, this.roomId);
  }
}
