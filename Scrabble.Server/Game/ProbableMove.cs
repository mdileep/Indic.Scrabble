//---------------------------------------------------------------------------------------------
// <copyright file="ProbableMove.cs" company="Chandam-ఛందం">
//    Copyright © 2013 - 2018 'Chandam-ఛందం' : http://chandam.apphb.com
//    Original Author : Dileep Miriyala (m.dileep@gmail.com)
//    Last Updated    : 21-Mar-2018 23:35EST
//    Revisions:
//       Version    | Author                   | Email                     | Remarks
//       1.0        | Dileep Miriyala          | m.dileep@gmail.com        | Initial Commit
//       _._        | <TODO>                   |   <TODO>                  | <TODO>
// </copyright>
//---------------------------------------------------------------------------------------------


using System.Collections.Generic;

namespace Scrabble
{
	public class ProbableMove
	{
		public string Direction;
		public int Mode;
		public int Score;
		public int WordsCount { get { return Words.Count; } }
		public List<Word> Moves;
		internal List<ProbableWord> Words;

		public override string ToString()
		{
			return Direction + " " + Moves.Count;
		}
	}
}
