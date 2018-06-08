//---------------------------------------------------------------------------------------------
// <copyright file="ReportWordsAction.cs" company="Chandam-ఛందం">
//    Copyright © 2013 - 2018 'Chandam-ఛందం' : http://chandam.apphb.com
//    Original Author : Dileep Miriyala (m.dileep@gmail.com)
//    Last Updated    : 07-Jun-2018 18:59EST
//    Revisions:
//       Version    | Author                   | Email                     | Remarks
//       1.0        | Dileep Miriyala          | m.dileep@gmail.com        | Initial Commit
//       _._        | <TODO>                   |   <TODO>                  | <TODO>
// </copyright>
//---------------------------------------------------------------------------------------------

using System.Collections.Generic;

namespace Scrabble.Server
{

	internal class ReportWordsAction : iAPIAction
	{
		public object Process(Dictionary<string, object> dict)
		{
			new Storage.StorageUtil().AddWords(dict["words"] as string[]);
			return true;
		}
	}
}