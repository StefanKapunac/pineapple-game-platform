import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import * as signalR from "@aspnet/signalr";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  private hubConnection: signalR.HubConnection
  public chat: Array<any> = [];
  public messageSendContent = '';

  startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:5431/chathub')
      .build();
    
    this.hubConnection
      .start()
      .then(async () => {
        console.log('Connection started');

        this.hubConnection.on('ReceiveMessage', (message) => {
          if (this.authService.username !== message.user) {
            this.chat.push(message);
          }
        });

        await this.hubConnection.send('Join', this.authService.username, 'group1');
      })
      .catch(err => {
        console.log('Error while starting connection: ' + err);
      });
  }

  constructor(public authService: AuthService) {
    this.startConnection();
  }

  ngOnInit(): void {
  }

  async sendMessage() {
    const message = {
      "user": this.authService.username,
      "message": this.messageSendContent
    };

    await this.hubConnection.send('SendMessage', message, 'group1');

    this.chat.push(message);
    this.messageSendContent = '';
  }

}
