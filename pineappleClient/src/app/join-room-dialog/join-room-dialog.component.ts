import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RoomService } from '../services/room.service';
import { Room } from '../services/room.model';
import { CreateRoomComponent } from '../create-room/create-room.component';
import { AuthService } from '../services/auth.service';

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
                public dialog: MatDialog) {
        if (data.game === 'hangman') {
            this.rooms = this.roomService.hangmanRooms;
        } else {
            this.rooms = this.roomService.tictactoeRooms;
        }

        console.log(this.rooms);
    }

    ngOnInit(): void {
    }

    onJoinRoom(room){
        this.roomService.joinRoom(room, this.authService.username).subscribe((res) => {
            console.log(res);
          });
        this.dialogRef.close();
    }

    onCreateRoom(): void {    
        const dialogRef = this.dialog.open(CreateRoomComponent);
    
        dialogRef.afterClosed().subscribe(gameName => {
            if (gameName) {
                this.roomService.createRoom(gameName, this.authService.username).subscribe((res) => {
                    console.log(res);
                    //res['gameId'] === 1 ? this.router.navigate(['tic-tac-toe']) : this.router.navigate(['hangman']);
                });
            }
        });

        this.dialogRef.close();
    }
}
