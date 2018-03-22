//---------------------------------------------------------------------------------------------
// <copyright file="LangSet.cs" company="Chandam-ఛందం">
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

namespace Shared
{
	public class CharSet
	{
		public string Name = "";
		public string[] SunnaSet = new string[] { };
		public string[] Vowels = new string[] { };
		public string[] Consonents = new string[] { };
		public Dictionary<string, string> Synonyms = new Dictionary<string, string>();
		public string Virama = "";
		public const char ZWNJ = (char)0x200C;
	}
}
