using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Game.Models
{
    public class HangmanMove : Move
    {
        // one player chooses the word, the other two guess it
        public static readonly string[] Roles = { "Choose", "Guess1", "Guess2" };

        // word that is chosen
        public string Word { get; set; }

        // letter that one of the guessers chose
        public char Letter { get; set; }

        // name of the body part that is to be drawn
        public string BodyPart { get; set; }
    }
}
