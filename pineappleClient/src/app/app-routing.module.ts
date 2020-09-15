import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TicTacToeComponent } from './tic-tac-toe/tic-tac-toe.component';
import { HangmanComponent } from './hangman/hangman.component';


const routes: Routes = [
  { path: 'tic-tac-toe/:roomId', component: TicTacToeComponent },
  { path: 'hangman', component: HangmanComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
