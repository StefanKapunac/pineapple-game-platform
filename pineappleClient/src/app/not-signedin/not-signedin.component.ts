import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-not-signedin',
  templateUrl: './not-signedin.component.html',
  styleUrls: ['./not-signedin.component.scss']
})
export class NotSignedinComponent implements OnInit {

  constructor( 
    public dialogRef: MatDialogRef<NotSignedinComponent>
  ) { }

  ngOnInit(): void {
  }

}
