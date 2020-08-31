import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  signInData = {
    username: '',
    password: '',
  };

  constructor(
    public dialogRef: MatDialogRef<SigninComponent>) {}

  ngOnInit(): void {
  }

}
