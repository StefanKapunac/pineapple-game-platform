using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Game.Models
{
    public class XOMove : Move
    {
        //true if X, false if O played the move
        public bool X { get; set; }

        //one of nine fields
        public int Field { get; set; }
    }
}
