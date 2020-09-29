using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using RoomService.Hubs.Clients;

namespace RoomService.Hubs
{
    public class RoomHub : Hub<IRoomHubClient>
    {
        // maps connection id to room name
        private static readonly ConcurrentDictionary<string, string> _ConnectionsMap = new ConcurrentDictionary<string, string>();

        public async Task JoinRoom(string roomName)
        {
            _ConnectionsMap.TryAdd(Context.ConnectionId, roomName);
            await Groups.AddToGroupAsync(Context.ConnectionId, roomName);
        }

        public async Task LeaveRoom(string roomName)
        {
            Console.WriteLine(_ConnectionsMap.Where(t => t.Value == roomName));
            await Clients.Group(roomName).RoomClosed();
        }
    }
}
