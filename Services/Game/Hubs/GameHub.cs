using Game.Hubs.Clients;
using Game.Models;
using Microsoft.AspNetCore.Routing.Constraints;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Game.Hubs
{
    public class GameHub : Hub<IGameClient>
    {
        // maps playerName to connection id
        private static readonly Dictionary<string, string> _ConnectionsMap = new Dictionary<string, string>();

        // maps connection id to group
        private static readonly Dictionary<string, string> _ConnectionToGroup = new Dictionary<string, string>();

        // maps groupName to gameName
        //private readonly static Dictionary<string, string> _GamesMap = new Dictionary<string, string>();

        // first method that client should invoke
        public async Task Join(string playerName, string groupName, string gameName)
        {
            Console.WriteLine("Join " + playerName);

            //add playername and connection to map
            _ConnectionsMap.Add(playerName, Context.ConnectionId);

            //add connection and group to map
            _ConnectionToGroup.Add(Context.ConnectionId, groupName);



            //which game is played in this group
            //_GamesMap.Add(groupName, gameName);

            //add user to group
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

            //send player assigned role
            int numPlayersInGroup = _ConnectionToGroup.Where(t => t.Value == groupName).Count();

            if (gameName == "XO")
            {
                if (numPlayersInGroup > XOMove.Roles.Length)
                {
                    // this should not happen
                    throw new Exception();
                }
                await Clients.Caller.RoleAssigned(XOMove.Roles[numPlayersInGroup - 1]);
            }
            else if (gameName == "Hangman")
            {
                Console.WriteLine("hangman......");
                if (numPlayersInGroup > HangmanMove.Roles.Length)
                {
                    Console.WriteLine("hangman......");
                    throw new Exception();
                }
                await Clients.Caller.RoleAssigned(HangmanMove.Roles[numPlayersInGroup - 1]);
            }
            else
            {
                throw new ArgumentException();
            }
        }

        public async Task PlayMove(Move move, string groupName)
        {
            //sends the move from move.playerName to other players in the group
            await Clients.Group(groupName).MovePlayed(move);
        }


        public async Task PlayXOMove(XOMove move, string groupName)
        {
            //sends the move from move.playerName to other players in the group
            await Clients.Group(groupName).MovePlayed(move);
        }


        public async Task PlayHangmanMove(HangmanMove move, string groupName)
        {
            Console.WriteLine(move);
            await Clients.Group(groupName).MovePlayed(move);
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