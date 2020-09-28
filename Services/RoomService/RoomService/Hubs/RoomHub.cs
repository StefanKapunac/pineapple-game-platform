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
        // maps roomName to connection id
        private static readonly Dictionary<string, string> _ConnectionsMap = new Dictionary<string, string>();

        public async Task JoinRoom(string roomName)
        {
            _ConnectionsMap.Add(roomName, Context.ConnectionId);
            await Groups.AddToGroupAsync(Context.ConnectionId, roomName);
        }

        public async Task LeaveRoom(string roomName)
        {
            Console.WriteLine(_ConnectionsMap[roomName]);
            await Clients.Group(roomName).RoomClosed();
        }
    }
}
