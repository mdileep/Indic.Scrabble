//---------------------------------------------------------------------------------------------
// <copyright file="ProbableWordComparer.cs" company="Chandam-ఛందం">
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
	class ProbableWordComparer : IEqualityComparer<ProbableWord>
	{
		public bool Equals(ProbableWord x, ProbableWord y)
		{
			if (x.Cells.Count != y.Cells.Count) { return false; }
			for (int i = 0; i < x.Cells.Count; i++)
			{
				if (x.Cells[i].Index != y.Cells[i].Index)
				{
					return false;
				}
				if (x.Cells[i].Target != y.Cells[i].Target)
				{
					return false;
				}
			}
			return true;
		}

		public int GetHashCode(ProbableWord obj)
		{
			var x = obj.Cells.Count;
			foreach (var cell in obj.Cells)
			{
				x = x ^ cell.Index.GetHashCode() ^ cell.Target.GetHashCode();
			}
			return x;
		}
	}
}
