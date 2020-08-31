import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SigninComponent } from '../signin/signin.component';
import { SignupComponent } from '../signup/signup.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  entryComponents: [SigninComponent, SignupComponent]
})
export class SidebarComponent implements OnInit {

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

  ngOnInit(): void {
  }
}
