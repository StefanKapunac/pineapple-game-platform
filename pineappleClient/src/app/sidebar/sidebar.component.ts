import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SigninComponent } from '../signin/signin.component';
import { SignupComponent } from '../signup/signup.component';
import { AuthService } from '../services/auth.service';
import { RoomService } from '../services/room.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  entryComponents: [SigninComponent, SignupComponent]
})
export class SidebarComponent implements OnInit {

  constructor(public dialog: MatDialog,
              public roomService: RoomService,
              public authService: AuthService,
              public router: Router) { }

  openSignInDialog(): void {
    const dialogRef = this.dialog.open(SigninComponent);

    dialogRef.afterClosed().subscribe(signInData => {
      if (signInData) {
        this.authService.signIn(signInData).subscribe((res) => {
          this.authService.isUserSignedIn = true;
          this.authService.username = res['userDetails'].username;
          localStorage.setItem('token', res['token']);
          this.roomService.getRooms();
          this.roomService.startConnection(this.authService.username);
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
          this.roomService.getRooms();
          this.roomService.startConnection(this.authService.username);
        })
      }
    });
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
