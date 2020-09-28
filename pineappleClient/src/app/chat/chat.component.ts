import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { RoomService } from '../services/room.service';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  public messageSendContent = '';

  constructor(public authService: AuthService,
              public roomService: RoomService,
              public chatService: ChatService) {}

  async sendMessage() {
    this.chatService.sendMessage(this.messageSendContent, this.authService.username, this.roomService.activeRoomId);
    this.messageSendContent = '';
  }

  ngOnInit(): void {
  }
}
