import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule} from '@angular/forms';
import { MaterialModule } from './material/material.module';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { JoinRoomDialog } from './join-room-dialog/join-room-dialog.component';
import { ChatComponent } from './chat/chat.component';
import { NotSignedinComponent } from './not-signedin/not-signedin.component';
import { TicTacToeComponent } from './tic-tac-toe/tic-tac-toe.component';
import { HangmanComponent } from './hangman/hangman.component';
import { GamesComponent } from './games/games.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    SigninComponent,
    SignupComponent,
    JoinRoomDialog,
    ChatComponent,
    NotSignedinComponent,
    TicTacToeComponent,
    HangmanComponent,
    GamesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MaterialModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
