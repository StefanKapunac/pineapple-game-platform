import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TicTacToeComponent } from './tic-tac-toe/tic-tac-toe.component';
import { HangmanComponent } from './hangman/hangman.component';
import { GamesComponent } from './games/games.component';


const routes: Routes = [
  { path: '', component: GamesComponent },
  { path: 'tic-tac-toe/:roomId', component: TicTacToeComponent },
  { path: 'hangman/:roomId', component: HangmanComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
