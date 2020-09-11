import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hangman',
  templateUrl: './hangman.component.html',
  styleUrls: ['./hangman.component.scss']
})
export class HangmanComponent implements OnInit {

  public player = 'B';
  public pickerPlayer = 'A';
  public currentPlayer: string;
  public wonPlayer: string;
  public gameOver = false;

  public keyboard = [];
  public guessedIncorrectLetters = [];

  private pickedWord = 'pineapple';
  public guessedWord: string[];

  public numOfGuessedLetters = 0;


  constructor() {
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

    this.guessedWord = '_'.repeat(this.pickedWord.length).split('');
  }

  get result() {
    return this.wonPlayer === this.player
      ? 'You won!'
      : 'You lost!';
  }

  onClickLetter(letter: string, rowIndex: number){
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
        this.wonPlayer = this.player;
        this.gameOver = true;
      }
    } else {
      this.guessedIncorrectLetters.push(letter);

      if (this.guessedIncorrectLetters.length === 7){
        this.gameOver = true;
        this.wonPlayer = this.pickerPlayer;
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

  ngOnInit(): void {
  }
}
