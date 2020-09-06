import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SigninComponent } from '../signin/signin.component';
import { SignupComponent } from '../signup/signup.component';
import { JoinRoomComponent } from '../join-room/join-room.component';
import { CreateRoomComponent } from '../create-room/create-room.component';
import { AuthService } from '../services/auth.service';
import { RoomService } from '../services/room.service';
import { NotSignedinComponent } from '../not-signedin/not-signedin.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  entryComponents: [SigninComponent, SignupComponent, JoinRoomComponent, CreateRoomComponent]
})
export class SidebarComponent implements OnInit {

  constructor(public dialog: MatDialog,
              public authService: AuthService,
              public roomService: RoomService) { }

  openSignInDialog(): void {
    const dialogRef = this.dialog.open(SigninComponent);

    dialogRef.afterClosed().subscribe(signInData => {
      if (signInData) {
        this.authService.signIn(signInData).subscribe((res) => {
          this.authService.isUserSignedIn = true;
          this.authService.username = res['userDetails'].username;
          localStorage.setItem('token', res['token']);
        })
      }
    });
  }

  openSignUpDialog(): void {
    const dialogRef = this.dialog.open(SignupComponent);

    dialogRef.afterClosed().subscribe(signUpData => {
      if (signUpData) {
        this.authService.signUp(signUpData).subscribe((res) => {
          this.authService.isUserSignedIn = true;
          this.authService.username = res['userDetails'].username;
          localStorage.setItem('token', res['token']);
        })
      }
    });
  }

  openCreateRoomDialog(): void {
    if (this.authService.isUserSignedIn){

      const dialogRef = this.dialog.open(CreateRoomComponent);

      dialogRef.afterClosed().subscribe(gameName => {
        if (gameName) {
          this.roomService.createRoom(gameName, this.authService.username)
        }
      });

    }
    else {
      this.dialog.open(NotSignedinComponent);
    }
  }

  signOut() {
    localStorage.removeItem('token');
    this.authService.username = '';
    this.authService.isUserSignedIn = false;
  }

  closeRoom() {
    this.roomService.closeRoom();
  }

  ngOnInit(): void {
  }
}
