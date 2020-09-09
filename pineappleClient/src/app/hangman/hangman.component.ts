import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hangman',
  templateUrl: './hangman.component.html',
  styleUrls: ['./hangman.component.scss']
})
export class HangmanComponent implements OnInit {
  
  public player: string = 'B';
  public currentPlayer: string;
  public gameOver: boolean = false;
  public wonPlayer: string;
  public pickerPlayer: string = 'A';

  public keyboard = [];
  public guessedCorrectLetters = [];
  public guessedIncorrectLetters = [];
  private pickedWord = 'pineapple';
  public guessedWord: string[];
  public guessed = 0;
  
  
  constructor() { 
    let firstRow = []; 
    'QWERTYUIOP'.split('').forEach(letter => {
      firstRow.push({letter: letter, value: 0});
    });

    let secondRow = []; 
    'ASDFGHJKL'.split('').forEach(letter => {
      secondRow.push({letter: letter, value: 0});
    });

    let thirdRow = []; 
    'ZXCVBNM'.split('').forEach(letter => {
      thirdRow.push({letter: letter, value: 0});
    });

    this.keyboard.push(firstRow);
    this.keyboard.push(secondRow);
    this.keyboard.push(thirdRow);

    this.guessedWord = '_'.repeat(this.pickedWord.length).split('');

  }

  get result() {
    return this.wonPlayer === this.player
      ? 'You won!'
      : 'You lost!';
  }

  onClickLetter(letter, rowIndex: number){

    if (this.pickedWord.indexOf(letter) > -1 || this.pickedWord.indexOf(letter.toLowerCase()) > -1){
      
      this.keyboard[rowIndex].find(o => o.letter === letter).value=1;
      this.guessedCorrectLetters.push(letter);

      for (let i = 0; i < this.pickedWord.length; i++) {
        
        if(this.pickedWord[i] == letter.toLowerCase() || this.pickedWord[i] == letter){
          this.guessedWord[i] = letter;
          this.guessed++;
        }

      }

      if (this.pickedWord.length == this.guessed ){
        this.wonPlayer = this.player;
        this.gameOver = true;
      }

    }
    else{
      
      this.keyboard[rowIndex].find(o => o.letter === letter).value=2;
      this.guessedIncorrectLetters.push(letter);

      if(this.guessedIncorrectLetters.length == 7){
        this.gameOver = true;
        this.wonPlayer = this.pickerPlayer;
      }
    }
  }


  ngOnInit(): void {
  }

}
