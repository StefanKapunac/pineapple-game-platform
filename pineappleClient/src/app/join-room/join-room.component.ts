import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { AuthService } from '../services/auth.service';
import { RoomService } from '../services/room.service';
import { NotSignedinComponent } from '../not-signedin/not-signedin.component';
import { Room } from './../services/room.model';
import * as signalR from "@aspnet/signalr";

@Component({
  selector: 'app-join-room',
  templateUrl: './join-room.component.html',
  styleUrls: ['./join-room.component.scss']
})
export class JoinRoomComponent implements OnInit {

  private hubConnection: signalR.HubConnection;  
  rooms: Room[] = [];
  
  startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:5432/roomhub')
      .build();
    this.hubConnection
      .start()
      .then(async () => {
        console.log('connection with room service');
        
        this.hubConnection.on('FullRoom', () => {
          console.log('full room');
        });

        this.hubConnection.on('RoomMade', (room) => {
          console.log('room made');
          this.rooms.push(room);
        });

        this.hubConnection.on('RoomUpdated', (room) => {
          console.log('room updated');
          this.rooms[this.rooms.findIndex(r => r.id == room.id)] = room;
        });

      })
      .catch(err => {
        console.log('Error while starting room service connection: ' + err);
      });
  }
  
  constructor(public authService: AuthService,
              public roomService: RoomService,
              public dialog: MatDialog) {
    this.startConnection();
  }

  ngOnInit(): void {
    this.roomService.roomsWaiting.subscribe((rooms) => {
      this.rooms = rooms;
    });
    console.log(this.rooms);
  }

  onJoinRoom(room){
    if(this.authService.isUserSignedIn){
      this.roomService.joinRoom(room, this.authService.username).subscribe((res) => {
        console.log(res);
      });
    }
    else{
      this.dialog.open(NotSignedinComponent);
    }
  }
  
  getTicTacToeRooms() {
    return this.rooms.filter(room => room.gameId == 1);
  }

  getHangmanRooms() {
    return this.rooms.filter(room => room.gameId == 2);
  }
  
}
