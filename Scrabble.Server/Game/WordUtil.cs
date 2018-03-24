//---------------------------------------------------------------------------------------------
// <copyright file="WordUtil.cs" company="Chandam-ఛందం">
//    Copyright © 2013 - 2018 'Chandam-ఛందం' : http://chandam.apphb.com
//    Original Author : Dileep Miriyala (m.dileep@gmail.com)
//    Last Updated    : 23-Mar-2018 19:36EST
//    Revisions:
//       Version    | Author                   | Email                     | Remarks
//       1.0        | Dileep Miriyala          | m.dileep@gmail.com        | Initial Commit
//       _._        | <TODO>                   |   <TODO>                  | <TODO>
// </copyright>
//---------------------------------------------------------------------------------------------

using Shared;

namespace Scrabble.Server
{
	class WordUtil
	{
		const char Seperator = ',';

		public string ToString(Word W, string lang)
		{
			CharSet charSet = Config.GetCharSet(lang);
			string ret = "";
			foreach (string s in W.Tiles.Split(Seperator))
			{
				for (int i = 0; i < s.Length; i++)
				{
					char c = s[i];
					if (i == 0)
					{
						ret = ret + c;
						continue;
					}

					switch ((int)c)
					{
						case 0xC01:
						case 0xC02:
						case 0xC03:
							ret = ret + c;
							continue;
					}

					if (!charSet.Synonyms.ContainsKey(c.ToString()))
					{
						ret = ret + charSet.Virama + c;
					}
					else
					{
						ret = ret + charSet.Synonyms[c.ToString()];
					}
				}
			}
			return ret;
		}
	}
}
