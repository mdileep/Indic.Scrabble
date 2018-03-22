//---------------------------------------------------------------------------------------------
// <copyright file="Word.cs" company="Chandam-ఛందం">
//    Copyright © 2013 - 2018 'Chandam-ఛందం' : http://chandam.apphb.com
//    Original Author : Dileep Miriyala (m.dileep@gmail.com)
//    Last Updated    : 21-Mar-2018 23:34EST
//    Revisions:
//       Version    | Author                   | Email                     | Remarks
//       1.0        | Dileep Miriyala          | m.dileep@gmail.com        | Initial Commit
//       _._        | <TODO>                   |   <TODO>                  | <TODO>
// </copyright>
//---------------------------------------------------------------------------------------------


using System.Collections.Generic;

namespace Scrabble
{
	public class Word
	{
		public string String;
		public int Index;
		public int Syllables;
		public string Position;
		public char Seperator = ',';

		static Dictionary<char, char> Synonyms2 = new Dictionary<char, char>{
			{'ఆ','ా'},
			{'ఇ','ి'},{'ఈ','ీ' },
			{'ఉ','ు'},{ 'ఊ','ూ'},
			{'ఋ','ృ'},{ 'ౠ','ౄ'},
			{'ఎ','ె'},{ 'ఏ','ే'},
			{'ఐ','ై'},
			{ 'ఒ','ొ'},{ 'ఓ','ో'},{ 'ఔ','ౌ'},
		};
		static string Virama = "్";

		public override string ToString()
		{
			string ret = "";
			foreach (string s in this.String.Split(Seperator))
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

					if (!Synonyms2.ContainsKey(c))
					{
						ret = ret + Virama + c;
					}
					else
					{
						ret = ret + Synonyms2[c].ToString();
					}
				}
			}
			return ret;
		}
	}
}
