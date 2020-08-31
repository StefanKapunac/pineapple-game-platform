import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signUpData = {
    username: '',
    password: '',
  };

  constructor() { }

  ngOnInit(): void {
  }

}
