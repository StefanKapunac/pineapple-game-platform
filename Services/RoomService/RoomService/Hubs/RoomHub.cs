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
    }
}
