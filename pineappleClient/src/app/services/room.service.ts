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

  hubConnection: signalR.HubConnection;    

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

          const indexOfRoom = this.rooms.findIndex(room => room.id === fullRoom.id);
          indexOfRoom !== -1 && this.rooms.splice(indexOfRoom, 1);

          const indexOfTicTacToeRoom = this.tictactoeRooms.findIndex(room => room.id === fullRoom.id);
          indexOfTicTacToeRoom !== -1 && this.tictactoeRooms.splice(indexOfTicTacToeRoom, 1);
          
          const indexOfHangmanRoom = this.hangmanRooms.findIndex(room => room.id === fullRoom.id);
          indexOfHangmanRoom !== -1 && this.hangmanRooms.splice(indexOfHangmanRoom, 1);
          
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

        this.hubConnection.on('RoomClosed', () => {
          console.log("room closed");
		  console.log('aaa');
		  console.log(RoomService.url + '/' + parseInt(this.activeRoomId));
		  let x = this.http.delete(RoomService.url + '/' + parseInt(this.activeRoomId)).subscribe(() => this.getRooms());
		  console.log(x);
          // this.rooms[this.rooms.findIndex(r => r.id == Number(this.activeRoomId))].participants = [];
          this.activeRoomId = '';
		  this.gameInProgress = false;
		  this.waitingFullRoom = false;
          this.router.navigate(['/']);
		  console.log("should be on start page...");
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
  

  async joinRoom (room, username ){
    let body = {participant: {name: username}, gameId: room.gameId, roomId: room.id};
    console.log('body to send', body);
    this.gameInProgress = true;

    await this.hubConnection.send('JoinRoom', room.id.toString());

    return this.http.put(RoomService.url + '/' + room.id, body);
  }

  async createRoom(gameName, username){
    let gameId = 1;
    if(gameName === "hangman"){
      gameId = 2;
    }
    let room = {
      participant: {
        name: username
      },
      gameId: gameId,
    }
    console.log(room);
    this.gameInProgress = true;

    await this.hubConnection.send('JoinRoom', this.activeRoomId.toString());
	console.log(this.activeRoomId.toString());
	
    let result = this.http.post(RoomService.url, room);
	console.log(result);
	console.log(this.activeRoomId);
	
	//await this.hubConnection.send('JoinRoom', result.id.toString());
	//console.log('id sobe: ' + result.id.toString());
	return result;
  }

  async closeRoom(){
    this.gameInProgress = false;
    console.log("closed room: ", this.activeRoomId);
    console.log("Leaving...");
    await this.hubConnection.send('LeaveRoom', this.activeRoomId.toString());
  }
}
