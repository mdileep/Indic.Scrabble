//---------------------------------------------------------------------------------------------
// <copyright file="Printer.cs" company="Chandam-ఛందం">
//    Copyright © 2013 - 2018 'Chandam-ఛందం' : http://chandam.apphb.com
//    Original Author : Dileep Miriyala (m.dileep@gmail.com)
//    Last Updated    : 21-Mar-2018 23:34EST
//    Revisions:
//       Version    | Author                   | Email                     | Remarks
//       1.0        | Dileep Miriyala          | m.dileep@gmail.com        | Initial Commit
//       _._        | <TODO>                   |   <TODO>                  | <TODO>
// </copyright>
//---------------------------------------------------------------------------------------------


using Scrabble.Server;
using System.IO;

namespace Scrabble
{
	internal class Printer
	{
		internal static void PrintLine(string content)
		{
#if DEBUG
				Debug.WriteLine(content);
#else
			try
			{
				using (StreamWriter SW = new StreamWriter(ServerUtil.Path("log.txt"), true))
				{
					SW.WriteLine(content);
				}
			}
			catch
			{
				//Ignore..
			}
#endif
	}
}
}
