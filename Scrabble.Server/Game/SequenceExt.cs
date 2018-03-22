//---------------------------------------------------------------------------------------------
// <copyright file="SequenceExt.cs" company="Chandam-ఛందం">
//    Copyright © 2013 - 2018 'Chandam-ఛందం' : http://chandam.apphb.com
//    Original Author : Dileep Miriyala (m.dileep@gmail.com)
//    Last Updated    : 21-Mar-2018 23:34EST
//    Revisions:
//       Version    | Author                   | Email                     | Remarks
//       1.0        | Dileep Miriyala          | m.dileep@gmail.com        | Initial Commit
//       _._        | <TODO>                   |   <TODO>                  | <TODO>
// </copyright>
//---------------------------------------------------------------------------------------------


using System;
using System.Collections.Generic;

namespace Scrabble
{
	public static class SequenceExt
	{
		public static IEnumerable<int> IndexOfAll<T>(this List<T> sequence, Predicate<T> match)
		{
			int index = 0;
			foreach (var item in sequence)
			{
				if (match(item))
					yield return index;

				++index;
			}
		}

	}
}
