using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RoomService.Models;

namespace RoomService.Hubs.Clients
{
    public interface IRoomHubClient
    {
        Task FullRoom(Room room);

        Task RoomMade(Room room);

        Task RoomUpdated(Room room);
    }
}
