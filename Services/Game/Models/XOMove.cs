using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Game.Models
{
    public class XOMove : Move
    {
        public static readonly string[] Roles = { "X", "O" };

        //one of nine fields
        public int Field { get; set; }
    }
}
