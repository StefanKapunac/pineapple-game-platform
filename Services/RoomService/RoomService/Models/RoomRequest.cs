using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RoomService.Models
{
    public class RoomRequest
    {
        public int Id { get; set; }

        public Participant Participant { get; set; }

        public int GameId { get; set; }

        public int RoomId { get; set; }
    }
}
