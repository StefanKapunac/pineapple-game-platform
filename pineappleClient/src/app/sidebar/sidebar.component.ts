import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SigninComponent } from '../signin/signin.component';
import { SignupComponent } from '../signup/signup.component';
import { JoinRoomComponent } from '../join-room/join-room.component';
import { CreateRoomComponent } from '../create-room/create-room.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  entryComponents: [SigninComponent, SignupComponent, JoinRoomComponent, CreateRoomComponent]
})
export class SidebarComponent implements OnInit {
  @ViewChild('notSignedInDialog') notSignedInDialog: TemplateRef<any>;
  
  constructor(public dialog: MatDialog) { }

  openSignInDialog(): void {
    const dialogRef = this.dialog.open(SigninComponent);

    dialogRef.afterClosed().subscribe(signInData => {
      if (signInData) {
        console.log(signInData);
      }
    });
  }

  openSignUpDialog(): void {
    const dialogRef = this.dialog.open(SignupComponent);

    dialogRef.afterClosed().subscribe(signUpData => {
      if (signUpData) {
        console.log(signUpData);
      }
    });
  }

  userSignedIn(){
    return true;
  }

  openJoinRoomDialog(): void {
    if (this.userSignedIn() ){
      
      const dialogRef = this.dialog.open(JoinRoomComponent);

      dialogRef.afterClosed().subscribe(joinRoomData => {
        if (joinRoomData) {
          console.log(joinRoomData);
        }
      });

    }
    else {
      this.dialog.open(this.notSignedInDialog);
    }
  }

  openCreateRoomDialog(): void {
    if (this.userSignedIn() ){

      const dialogRef = this.dialog.open(CreateRoomComponent);

      dialogRef.afterClosed().subscribe(createRoomData => {
        if (createRoomData) {
          console.log(createRoomData);
        }
      });

    }
    else {
      this.dialog.open(this.notSignedInDialog);
    }
  }

  ngOnInit(): void {
  }
}
