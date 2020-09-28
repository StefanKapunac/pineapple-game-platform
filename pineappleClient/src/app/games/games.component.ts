import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { JoinRoomDialog } from '../join-room-dialog/join-room-dialog.component';
import { AuthService } from '../services/auth.service';
import{ NotSignedinComponent } from '../not-signedin/not-signedin.component';
import { RoomService } from '../services/room.service';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss']
})
export class GamesComponent implements OnInit {  
  constructor(public dialog: MatDialog,
              public authService: AuthService,
              public roomService: RoomService) {}

  ngOnInit(): void {}

  openJoinRoomDialog(game: string) {
    if (this.authService.username) {
      this.dialog.open(JoinRoomDialog, { data: {game} });
    } else {
      this.dialog.open(NotSignedinComponent, { data: {game} });
    }
  }
}
