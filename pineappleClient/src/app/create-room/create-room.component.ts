import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.scss']
})
export class CreateRoomComponent implements OnInit {

  createRoomData = {
    game: '',
  };
  constructor(
    public dialogRef: MatDialogRef<CreateRoomComponent>
  ) 
  { }

  ngOnInit(): void {
  }

}
