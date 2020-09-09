using Game.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Game.Hubs.Clients
{
    public interface IGameClient
    {
        Task MovePlayed(Move move);

        Task RoleAssigned(string role);
    }
}
