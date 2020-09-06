import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { AuthService } from '../services/auth.service';
import { RoomService } from '../services/room.service';
import { NotSignedinComponent } from '../not-signedin/not-signedin.component';

@Component({
  selector: 'app-join-room',
  templateUrl: './join-room.component.html',
  styleUrls: ['./join-room.component.scss']
})
export class JoinRoomComponent implements OnInit {

  joinRoomData = {
    id: '',
  };

  constructor(public authService: AuthService,
              public roomService: RoomService,
              public dialog: MatDialog) {}

  ngOnInit(): void {
  }

  onJoinRoom(room){
    if(this.authService.isUserSignedIn){
      this.roomService.joinRoom(room);
    }
    else{
      this.dialog.open(NotSignedinComponent);
    }
  }
}
