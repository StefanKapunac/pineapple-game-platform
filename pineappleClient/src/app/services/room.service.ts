import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Room } from './room.model';
import * as signalR from '@aspnet/signalr';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private static readonly url = 'https://localhost:5432/api/RoomRequests';

  rooms: Room[] = [];
  hangmanRooms: Room[] = [];
  tictactoeRooms: Room[] = []
  gameInProgress = false;
  activeRoomId = '';
  waitingFullRoom = false;

  private hubConnection: signalR.HubConnection;    

  constructor(private http: HttpClient,
              private router: Router) {}

  getRooms() {
    this.http.get<Room[]>(RoomService.url)
      .subscribe((rooms) => {
        this.rooms = rooms;
        this.tictactoeRooms = this.getTicTacToeRooms();
        this.hangmanRooms = this.getHangmanRooms();
      });
  }

  startConnection(username) {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:5432/roomhub')
      .build();
    this.hubConnection
      .start()
      .then(async () => {
        console.log('connection with room service');
        
        this.hubConnection.on('FullRoom', (fullRoom) => {
          console.log('full room');
          this.rooms = this.rooms.filter(room => room.id !== fullRoom.id);
          if (fullRoom.participants.findIndex(participant => participant.name === username) !== -1) {
            fullRoom.gameId === 1 ? this.router.navigate(['tic-tac-toe', fullRoom.id]) : this.router.navigate(['hangman', fullRoom.id]);
            this.waitingFullRoom = false;
          } 
        });

        this.hubConnection.on('RoomMade', (room) => {
          this.rooms.push(room);
          if (room.gameId === 1) {
            this.tictactoeRooms.push(room);
          } else {
            this.hangmanRooms.push(room);
          }
        });

        this.hubConnection.on('RoomUpdated', (room) => {
          console.log('room updated');
          this.rooms[this.rooms.findIndex(r => r.id == room.id)] = room;
          if (room.gameId === 1) {
            this.tictactoeRooms[this.tictactoeRooms.findIndex(r => r.id == room.id)] = room;
          } else {
            this.hangmanRooms[this.hangmanRooms.findIndex(r => r.id == room.id)] = room;
          }
        });

      })
      .catch(err => {
        console.log('Error while starting room service connection: ' + err);
      });
  }
  
  getTicTacToeRooms() {
    return this.rooms.filter(room => room.gameId == 1);
  }

  getHangmanRooms() {
    return this.rooms.filter(room => room.gameId == 2);
  }
  

  joinRoom (room, username ){
    let body = {participant: {name: username}, gameId: room.gameId, roomId: room.id};
    console.log('body to send', body);
    this.gameInProgress = true;
    return this.http.put(RoomService.url + '/' + room.id, body);
  }

  createRoom(gameName, username){
    let gameId = 1;
    if(gameName === "hm"){
      gameId = 2;
    }
    console.log({gameName:gameName, participant: username});
    let room = {
      participant: {
        name: username
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
