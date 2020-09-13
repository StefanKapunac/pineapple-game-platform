import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Room } from './room.model';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private static readonly url = 'https://localhost:5432/api/RoomRequests';

  roomsWaiting: Observable<Room[]>;
  gameInProgress = false;

  constructor(private http: HttpClient) {
    this.roomsWaiting = this.http.get<Room[]>(RoomService.url);
  }
  

  joinRoom(room, username){
    let body = {participant: {name: username}, gameId: room.gameId, roomId: room.id};
    console.log('body to send', body);
    this.gameInProgress = true;
    return this.http.put(RoomService.url + '/' + room.id, body);
  }

  createRoom(gameName, loggedUser){
    let gameId = 1;
    if(gameName === "hm"){
      gameId = 2;
    }
    console.log({gameName:gameName, participant: loggedUser});
    let room = {
      participant: {
        name: loggedUser
      },
      gameId: gameId,
    }
    console.log(room);
    this.gameInProgress = true;
    return this.http.post(RoomService.url, room);
  }

  closeRoom(){
    this.gameInProgress = false;
  }

}
