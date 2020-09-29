import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RoomService } from '../services/room.service';
import { Room } from '../services/room.model';
import { AuthService } from '../services/auth.service';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-join-room-dialog',
  templateUrl: './join-room-dialog.component.html',
  styleUrls: ['./join-room-dialog.component.scss']
})
export class JoinRoomDialog implements OnInit {
    rooms: Room[];

    constructor(public roomService: RoomService,
                public authService: AuthService,
                public dialogRef: MatDialogRef<JoinRoomDialog>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                public dialog: MatDialog,
                public chatService: ChatService) {
        if (data.game === 'hangman') {
            this.rooms = this.roomService.hangmanRooms;
        } else {
            this.rooms = this.roomService.tictactoeRooms;
        }

        console.log(this.rooms);
    }

    ngOnInit(): void {
    }

    async onJoinRoom(room){
        (await this.roomService.joinRoom(room, this.authService.username)).subscribe(() => {
            this.roomService.activeRoomId = room.id;
            this.chatService.startConnection(this.authService.username, this.roomService.activeRoomId);
			console.log('onJoinRoom: ' + this.roomService.activeRoomId);
            this.roomService.waitingFullRoom = true;
        });
        this.dialogRef.close();
    }

    async onCreateRoom(): Promise<void> {    
        (await this.roomService.createRoom(this.data.game, this.authService.username)).subscribe(async (res) => {
            this.roomService.activeRoomId = res['id'];
			console.log(res['id']);
			await this.roomService.hubConnection.send('JoinRoom', this.roomService.activeRoomId.toString());
            this.chatService.startConnection(this.authService.username, this.roomService.activeRoomId);
			console.log('onCreateRoom: ' + this.roomService.activeRoomId);
            this.roomService.waitingFullRoom = true;

        });
        this.dialogRef.close();
    }
}
