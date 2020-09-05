import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  mockChat = [
    {
      username: "marija",
      content: "Hello hello hello"
    },
    {
      username: "stefan",
      content: "Hello hello hello hello hello hello hello hello hello"
    },
    {
      username: "natalija",
      content: "Hello hello"
    },
    {
      username: "tijana",
      content: "Hello"
    },
    {
      username: "marija",
      content: "Hello hello"
    },
    {
      username: "natalija",
      content: "Hello"
    },
  ];

  messageSendContent = '';

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
  }

  sendMessage() {
    const message = {
      "username": this.authService.username,
      "content": this.messageSendContent
    };

    this.mockChat = [ ...this.mockChat, message ];
    this.messageSendContent = '';
  }

}
