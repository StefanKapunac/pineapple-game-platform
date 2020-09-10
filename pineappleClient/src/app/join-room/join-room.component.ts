import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { AuthService } from '../services/auth.service';
import { RoomService } from '../services/room.service';
import { NotSignedinComponent } from '../not-signedin/not-signedin.component';
import { Room } from './../services/room.model';
@Component({
  selector: 'app-join-room',
  templateUrl: './join-room.component.html',
  styleUrls: ['./join-room.component.scss']
})
export class JoinRoomComponent implements OnInit {

  
  rooms: Room[] = [];

  constructor(public authService: AuthService,
              public roomService: RoomService,
              public dialog: MatDialog) {}

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
    console.log(this.rooms.filter(room => room.gameId == 1));
    return this.rooms.filter(room => room.gameId == 1);
  }

  getHangmanRooms() {
    console.log(this.rooms.filter(room => room.gameId == 2));
    return this.rooms.filter(room => room.gameId == 2);
  }
}
