using Game.Models;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Game.Hubs
{
    public class GameHub : Hub
    {
        // maps playerName to connection id
        private readonly static Dictionary<string, string> _ConnectionsMap = new Dictionary<string, string>();

        // maps groupName to gameName
        //private readonly static Dictionary<string, string> _GamesMap = new Dictionary<string, string>();

        // first method that client should invoke
        public async Task Join(string playerName, string groupName, string gameName)
        {
            //add user to map
            AddPlayer(playerName);

            //which game is played in this group
            //_GamesMap.Add(groupName, gameName);
            
            //add user to group
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
        }

        public async Task PlayMove(Move move, string groupName)
        {
            //sends the move from move.playerName to other players in the group
            await Clients.Group(groupName).SendAsync("MovePlayed", move);
        }

        private void AddPlayer(string playerName)
        {
            _ConnectionsMap.Add(playerName, Context.ConnectionId);
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            //remove player from map
            var a = _ConnectionsMap.Where(p => p.Value == Context.ConnectionId).Select(p => p.Key).ToList();
            foreach (var s in a)
            {
                _ConnectionsMap.Remove(s);
            }
            return base.OnDisconnectedAsync(exception);
        }
    }
}
