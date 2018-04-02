//---------------------------------------------------------------------------------------------
// <copyright file="LoadWords.cs" company="Chandam-ఛందం">
//    Copyright © 2013 - 2018 'Chandam-ఛందం' : http://chandam.apphb.com
//    Original Author : Dileep Miriyala (m.dileep@gmail.com)
//    Last Updated    : 01-Apr-2018 20:00EST
//    Revisions:
//       Version    | Author                   | Email                     | Remarks
//       1.0        | Dileep Miriyala          | m.dileep@gmail.com        | Initial Commit
//       _._        | <TODO>                   |   <TODO>                  | <TODO>
// </copyright>
//---------------------------------------------------------------------------------------------


using Scrabble.Server;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace Scrabble
{
	class WordLoader
	{
		static List<Word> LoadWords(object file)
		{
			using (new Watcher("\tLoad Words"))
			{
				List<Word> List = new List<Word>();
				string[] lines = File.ReadAllLines(file.ToString());
				int cnt = 0;
				foreach (string line in lines)
				{
					List.Add(new Word
					{
						Tiles = line,
						Index = cnt++,
						Syllables = line.Count(x => x == ',') + 1,
					});
				}
				return List;
			}
		}

		internal static List<Word> Load(string file)
		{
			return CacheManager.GetApppObject<List<Word>>("Words:" + file, LoadWords, file);
		}
	}
}
