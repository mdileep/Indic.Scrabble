//---------------------------------------------------------------------------------------------
// <copyright file="ProbablesAction.cs" company="Chandam-ఛందం">
//    Copyright © 2013 - 2018 'Chandam-ఛందం' : http://chandam.apphb.com
//    Original Author : Dileep Miriyala (m.dileep@gmail.com)
//    Last Updated    : 21-Mar-2018 23:32EST
//    Revisions:
//       Version    | Author                   | Email                     | Remarks
//       1.0        | Dileep Miriyala          | m.dileep@gmail.com        | Initial Commit
//       _._        | <TODO>                   |   <TODO>                  | <TODO>
// </copyright>
//---------------------------------------------------------------------------------------------

using System.Collections.Generic;

namespace Scrabble.Server
{
	internal class ProbablesAction : iAPIAction
	{
		public object Process(Dictionary<string, object> dict)
		{
			var Board = ParseUtil.ConvertTo<ScrabbleBoard>(dict);
			var R = new Runner2(Board);
			return R.BestMove();
		}
	}
}