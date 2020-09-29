import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
    private hubConnection: signalR.HubConnection
    public chat: Array<any> = [];
  
    startConnection(username, roomId) {
	  this.chat = [];
		
      this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl('https://localhost:5431/chathub')
        .build();
      
      this.hubConnection
        .start()
        .then(async () => {
          console.log('Connection started');
  
          this.hubConnection.on('ReceiveMessage', (message) => {
            if (username !== message.user) {
              this.chat.push(message);
            }
          });
		  

          await this.hubConnection.send('Join', username, roomId.toString());
        })
        .catch(err => {
          console.log('Error while starting connection: ' + err);
        });
    }
  
    ngOnInit(): void {
    }
  
    async sendMessage(messageContent, username, roomId) {
      const message = {
        "user": username,
        "message": messageContent,
      };
  
      await this.hubConnection.send('SendMessage', message, roomId.toString());
  
      this.chat.push(message);
    }
}