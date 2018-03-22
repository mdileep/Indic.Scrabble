//---------------------------------------------------------------------------------------------
// <copyright file="HelpAction.cs" company="Chandam-ఛందం">
//    Copyright © 2013 - 2018 'Chandam-ఛందం' : http://chandam.apphb.com
//    Original Author : Dileep Miriyala (m.dileep@gmail.com)
//    Last Updated    : 19-Mar-2018 19:11EST
//    Revisions:
//       Version    | Author                   | Email                     | Remarks
//       1.0        | Dileep Miriyala          | m.dileep@gmail.com        | Initial Commit
//       _._        | <TODO>                   |   <TODO>                  | <TODO>
// </copyright>
//---------------------------------------------------------------------------------------------

using System.Collections.Generic;

namespace Scrabble.Server
{
	internal class HelpAction : iAPIAction
	{
		public object Process(Dictionary<string, object> dict)
		{
			return new Dictionary<string, object>
			{
				{ "Copyright", "Copyright © 2013 - 2018 'Chandam-ఛందం'" },
				{ "Author", "Dileep Miriyala (m.dileep@gmail.com)"},
				{ "Version","0.2"},
				{ "Usage","/help.html"}
			};
		}
	}
}