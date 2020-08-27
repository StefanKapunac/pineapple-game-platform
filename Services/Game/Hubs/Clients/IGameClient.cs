using Game.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Game.Hubs.Clients
{
    interface IGameClient
    {
        Task MovePlayed(Move move);
    }
}
