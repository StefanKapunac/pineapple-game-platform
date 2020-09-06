import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  roomsWaiting = [
    {gameName:"xo", roomId:1, participants:['natalija']},
    {gameName:"xo", roomId:2, participants:['tijana', 'marija']},
    {gameName:"hm", roomId:3, participants:['natalija']},
    {gameName:"xo", roomId:4, participants:['stefan']},
    {gameName:"xo", roomId:5, participants:['stefan', 'marija']}
  ];
  gameInProgress = false;
  constructor() { }

  getTicTacToeRooms() {
    return this.roomsWaiting.filter(room => room.gameName === "xo");
  }

  getHangmanRooms() {
    return this.roomsWaiting.filter(room => room.gameName === "hm");
  }

  joinRoom(room){
    console.log(room);
    this.gameInProgress = true;
  }

  createRoom(gameName, loggedUser){

    console.log({gameName:gameName, participants:[loggedUser]});
    this.gameInProgress = true;
  }

  closeRoom(){
    this.gameInProgress = false;
  }

}
