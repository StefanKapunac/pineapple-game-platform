using Microsoft.EntityFrameworkCore.Internal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Threading.Tasks;

namespace RoomService.Models
{ 
    
    public class Room
    {
        public int Id { get; set; }

        public int GameId { get; set; }

        public HashSet<Participant> Participants { get; set; }

        public class Game
        {
            public int Id { get; set; }

            public string Name { get; set; }

            public int NumPlayers { get; set; }

            public Game(int id, string name, int numPlayers)
            {
                Id = id;
                Name = name;
                NumPlayers = numPlayers;
            }
        }

        public static readonly Game[] games = { new Game(1, "xo", 2), new Game(2, "chess", 2) };

    }
  
    
}
