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
		public List<ProbableWord> Words;
		public int Score;
		public List<Word> Moves;
		public string Direction;

		public override string ToString()
		{
			return Direction + " " + Score;
		}
	}
}
