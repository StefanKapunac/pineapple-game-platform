using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using RoomService.Hubs.Clients;

namespace RoomService.Hubs
{
    public class RoomHub : Hub<IRoomHubClient>
    {
        public async Task JoinRoom(string roomName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, roomName);
        }

        public async Task LeaveRoom(string roomName)
        {
            await Clients.Group(roomName).RoomClosed();
        }
    }
}
