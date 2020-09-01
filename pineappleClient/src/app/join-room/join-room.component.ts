import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-join-room',
  templateUrl: './join-room.component.html',
  styleUrls: ['./join-room.component.scss']
})
export class JoinRoomComponent implements OnInit {
  
  joinRoomData = {
    id: '',
  };
  constructor(
    public dialogRef: MatDialogRef<JoinRoomComponent>
  ) 
  { }

  ngOnInit(): void {
  }

}
