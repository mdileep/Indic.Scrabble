//---------------------------------------------------------------------------------------------
// <copyright file="RegexEngineV2.cs" company="Chandam-ఛందం">
//    Copyright © 2013 - 2018 'Chandam-ఛందం' : http://chandam.apphb.com
//    Original Author : Dileep Miriyala (m.dileep@gmail.com)
//    Last Updated    : 24-May-2018 13:24EST
//    Revisions:
//       Version    | Author                   | Email                     | Remarks
//       1.0        | Dileep Miriyala          | m.dileep@gmail.com        | Initial Commit
//       _._        | <TODO>                   |   <TODO>                  | <TODO>
// </copyright>
//---------------------------------------------------------------------------------------------

using Scrabble.Server;
using Shared;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading;

namespace Scrabble.Engines
{
	internal class RegexV2Engine : RegexEngine
	{
		public RegexV2Engine(ScrabbleBoard Board) : base(Board)
		{

		}

		public override List<ProbableMove> Probables()
		{
			var Moves = new List<ProbableMove>();
			if (!new FileInfo(file).Exists)
			{
				return Moves;
			}
			if (CharSet == null || cells == null || weights == null || string.IsNullOrEmpty(file) ||
				(string.IsNullOrEmpty(vowels) && string.IsNullOrEmpty(conso) && string.IsNullOrEmpty(special)))
			{
				return Moves;
			}
			if (cells.Length != size * size || weights.Length != size * size)
			{
				return Moves;
			}

			string[] All = new string[] { };


			string AllPattern = "";


			string Movables = (vowels + " " + conso + " " + special);
			var MovableList = Movables.Replace("(", " ").Replace(")", " ").Replace(",", "").Split(' ').ToList();
			MovableList.RemoveAll(x => x.Length == 0);

			var SpecialList = DistinctList(special.Replace("(", " ").Replace(")", " ").Replace(",", ""), ' ');
			var SpeicalDict = GetSpecialDict(SpecialList);

			List<string> EverySyllableOnBoard = GetSyllableList(cells, size, false, true);
			List<string> NonCornerSyllables = GetSyllableList(cells, size, true, false);

			//
			All = (GetFlatList(EverySyllableOnBoard, ',') + " " + Movables).Replace("(", " ").Replace(")", " ").Replace(",", " ").Replace("|", " ").Split(' ');
			AllPattern = string.Format("^(?<All>[{0},])*$", GetFlatList2(All));
			Dictionary<string, int> AllDict = GetCountDict(All);

			var WordsDictionary = WordLoader.Load(file); //Large Set of Words
			var ContextualList = ShortList(WordsDictionary, AllPattern, AllDict); // Probables 


			if (EverySyllableOnBoard.Count > 0)
			{
				var NonCornerPattern = "";
				string[] NonCornerTiles = new string[] { };
				//
				NonCornerTiles = (GetFlatList2(NonCornerSyllables.ToArray()) + " " + Movables).Replace("(", " ").Replace(")", " ").Replace(",", " ").Replace("|", " ").Split(' ');
				NonCornerPattern = string.Format("^(?<All>[{0},])*$", GetFlatList2(NonCornerTiles));
				//
				Dictionary<string, int> NonCornerDict = GetCountDict(NonCornerTiles);
				var NonCornerProbables = ShortList(WordsDictionary, ContextualList, NonCornerPattern, NonCornerDict);  //Non Corner Probables

				Moves.AddRange(SyllableExtensions(cells, size, CharSet, id, WordsDictionary, NonCornerProbables, MovableList, SpeicalDict));
				Moves.AddRange(WordExtensions(cells, size, CharSet, id, WordsDictionary, ContextualList, MovableList, SpeicalDict));
			}
			else
			{
				Moves.AddRange(EmptyExtensions(cells, size, CharSet, star, id, WordsDictionary, ContextualList, MovableList, SpeicalDict));
			}

			WordsDictionary = null; WordsDictionary = null;
			RefreshScores(Moves, weights, size);
			return Moves;
		}

		List<int> ShortList(List<Word> Words, List<int> Probables, string NonCornerPattern, Dictionary<string, int> Dict)
		{
			if (string.IsNullOrEmpty(NonCornerPattern))
			{
				return new List<int>();
			}

			using (new Watcher("\tShortList "))
			{
				Regex R = new Regex(NonCornerPattern, RegexOptions.Compiled);

				List<int> Shortlisted = new List<int>();

				using (new Watcher("\t\tShortList2 "))
				{
					foreach (int indx in Probables)
					{
						var word = Words[indx];

						if (word.Syllables == 1)
						{
							continue;
						}
						var isMatch = R.IsMatch(word.Tiles);
						if (!isMatch)
						{
							continue;
						}

						Dictionary<string, int> CharCount = GetCountDict(word.Tiles);

						bool isValid = Validate(Dict, CharCount);
						if (!isValid)
						{
							continue;
						}

						Shortlisted.Add(word.Index);
					}
					Printer.PrintLine("\t\t\t Shortlisted: " + Shortlisted.Count + "  of " + Probables.Count);
				}
				return Shortlisted;
			}
		}
		List<int> ShortList(List<Word> Words, string NonCornerPattern, Dictionary<string, int> Dict)
		{
			if (string.IsNullOrEmpty(NonCornerPattern))
			{
				return new List<int>();
			}

			using (new Watcher("\tShortList "))
			{
				Regex R = new Regex(NonCornerPattern, RegexOptions.Compiled);

				List<Word> Matches = MatchedWords(Words, NonCornerPattern);
				List<int> Shortlisted = new List<int>();

				using (new Watcher("\t\tShortList2 "))
				{
					foreach (Word word in Matches)
					{
						if (word.Syllables == 1)
						{
							continue;
						}

						Dictionary<string, int> CharCount = GetCountDict(word.Tiles);

						bool isValid = Validate(Dict, CharCount);
						if (!isValid)
						{
							continue;
						}

						Shortlisted.Add(word.Index);
					}
					Printer.PrintLine("\t\t\t Shortlisted: " + Shortlisted.Count + "  of " + Matches.Count);
				}
				return Shortlisted;
			}
		}
		static List<int> ShortList(string block, string key, Regex R, List<Word> AllWords, List<int> Probables)
		{
			//Cache Mechanism:
			//	Word Extension: WW1
			//		CachedList: Cache all Possible Extesnsion Indexes
			//	ShortListed: Intersection of Probables and CachedList
			//
			List<int> CachedList = CacheManager.GetSession<List<int>, Regex, List<Word>>(block, key, R, AllWords, ShortList);
			List<int> ShortListed = new List<int>();
			foreach (var probable in Probables)
			{
				if (!CachedList.Contains(probable))
				{
					continue;
				}
				ShortListed.Add(probable);
			}
			//Simply use Linq..:)
			//ShortListed = CachedList.Intersect(Probables).ToList<int>();
			return ShortListed;
		}
		static List<int> ShortList(Regex R, List<Word> AllWords)
		{
			List<int> Probables = new List<int>();
			foreach (var word in AllWords)
			{
				Match M = R.Match(word.Tiles);
				if (!M.Success)
				{
					continue;
				}
				Probables.Add(word.Index);
			}
			return Probables;
		}

		static void RefreshCache(string block, List<Word> Items)
		{
			var Dict = CacheManager.GetSession<Dictionary<string, List<int>>>(block);
			if (Dict == null) { return; }
			var RemoveList = new List<string>();
			//Remove all Words that are part of the WordsOnBoard
			//Those are nolonger needed
			foreach (var KVP in Dict)
			{
				bool found = false;
				foreach (var word in Items)
				{
					if (word.Tiles == KVP.Key)
					{
						found = true;
						break;
					}
				}
				if (!found)
				{
					RemoveList.Add(KVP.Key);
				}
			}
			foreach (var item in RemoveList)
			{
				Dict.Remove(item);
			}
		}

		protected static List<ProbableMove> EmptyExtensions(string[] Cells, int size, CharSet CharSet, int star, string botId, List<Word> AllWords, List<int> Probables, List<string> Movables, Dictionary<string, Regex> SpeicalDict)
		{
			using (new Watcher("\tEmpty Extesnsions"))
			{
				List<ProbableMove> Moves = new List<ProbableMove>();
				{
					foreach (var indx in Probables)
					{
						Word word = AllWords[indx];
						string Pre = "";
						string Center = "";
						string Post = "";

						int f = word.Tiles.IndexOf(',');

						Center = word.Tiles.Substring(0, f);
						Post = word.Tiles.Substring(f + 1);

						string[] Pres = Pre == "" ? new string[] { } : Pre.TrimEnd(',').Split(',');
						string[] Centers = Center.Split(',');
						string[] Posts = Post == "" ? new string[] { } : Post.TrimStart(',').Split(',');

						var Tiles = Movables.GetRange(0, Movables.Count);
						bool res = Resolve(Pres, Centers, Posts, Tiles, SpeicalDict);
						if (!res)
						{
							continue;
						}
						int totalCells = Pres.Length + Centers.Length + Posts.Length;
						int centroid = totalCells % 2 == 0 ? (totalCells / 2 - 1) : totalCells / 2;

						ProbableMove WH = TryHarizontal(Cells, size, star - centroid, 0, Pres, Centers, Posts);
						ProbableMove WV = TryVertical(Cells, size, star - centroid, 0, Pres, Centers, Posts);

						bool WHValid = Validate(WH, AllWords, Probables);
						bool WVValid = Validate(WV, AllWords, Probables);

						if (WHValid)
						{
							Moves.Add(WH);
						}
						if (WVValid)
						{
							Moves.Add(WV);
						}
					}
				}
				return Moves;
			}
		}
		protected static List<ProbableMove> SyllableExtensions(string[] Cells, int size, CharSet CharSet, string botId, List<Word> AllWords, List<int> Probables, List<string> Movables, Dictionary<string, Regex> SpeicalDict)
		{
			using (new Watcher("\tSyllable Extensions"))
			{
				List<ProbableMove> Moves = new List<ProbableMove>();
				{
					List<Word> All = GetSyllableList2(Cells, size, false, true);
					foreach (var syllable in All)
					{
						string pattern = GetSyllablePattern2(CharSet, syllable.Tiles.Replace("(", "").Replace(")", ""), "(?<Center>.*?)", "(?<Pre>.*?)", "(?<Post>.*?)");
						pattern = string.Format("^{0}$", pattern);
						Regex R = new Regex(pattern, RegexOptions.Compiled);

						//Printer.PrintLine("\t\t Syllable Pattern: " + pattern);
						//using (new Watcher("\t\t Match Syllable: ", true))
						{
							foreach (var indx in Probables)
							{
								Word probable = AllWords[indx];
								Match M = R.Match(probable.Tiles);
								if (!M.Success)
								{
									continue;
								}

								string Pre = MatchedString(M.Groups["Pre"], "");
								string Center = MatchedString(M.Groups["Conso"], "");
								string Post = MatchedString(M.Groups["Post"], "");

								string[] Pres = Pre == "" ? new string[] { } : Pre.TrimEnd(',').Split(',');
								string[] Centers = Center == "" ? new string[] { } : Center.Split(',');
								string[] Posts = Post == "" ? new string[] { } : Post.TrimStart(',').Split(',');

								if (!Post.StartsWith(",") && Posts.Length > 0)
								{
									Centers = (Center + Posts[0]).Split(',');
									Posts = Posts.Skip(1).ToArray();
								}

								var Tiles = Movables.GetRange(0, Movables.Count);
								bool res = Resolve(Pres, Centers, Posts, Tiles, SpeicalDict);
								if (!res)
								{
									continue;
								}

								ProbableMove WH = TryHarizontal(Cells, size, syllable.Index, 0, Pres, Centers, Posts);
								ProbableMove WV = TryVertical(Cells, size, syllable.Index, 0, Pres, Centers, Posts);

								bool WHValid = Validate(WH, AllWords, Probables);
								bool WVValid = Validate(WV, AllWords, Probables);

								if (WHValid)
								{
									Moves.Add(WH);
								}
								if (WVValid)
								{
									Moves.Add(WV);
								}
							}
						}
					}
				}
				Printer.PrintLine("\t\t Moves found: " + Moves.Count);
				return Moves;
			}
		}

		protected static List<ProbableMove> WordExtensions(string[] Cells, int size, CharSet CharSet, string botId, List<Word> AllWords, List<int> Probables, List<string> Movables, Dictionary<string, Regex> SpeicalDict)
		{
			using (new Watcher("\tWord Extensions"))
			{
				List<ProbableMove> Moves = new List<ProbableMove>();
				{
					var WordsOnBoard = GetWordsOnBoard(Cells, size, false);
					RefreshCache(botId + ":W", WordsOnBoard);
					foreach (Word wordOnBoard in WordsOnBoard)
					{
						string raw = wordOnBoard.Tiles.Replace("(", "").Replace(")", "").Replace(",", "").Replace("|", ",");
						int len = raw.Split(',').Length;

						string pattern = GenWordPattern(CharSet, wordOnBoard.Tiles, "(?<Center{0}>.*?)", "", "(?<Center{0}>.*?)", "(?<Pre>.*?)", "(?<Post>.*?)", true);
						pattern = string.Format("^{0}$", pattern.TrimEnd('|'));
						Regex R = new Regex(pattern, RegexOptions.Compiled);

						//Printer.PrintLine("\t\t Word Pattern: " + pattern);
						//using (new Watcher("\t\t Match Word: ", true))
						{
							List<int> Probables2 = ShortList(botId + ":W", wordOnBoard.Tiles, R, AllWords, Probables);
							foreach (int indx in Probables2)
							{
								var word = AllWords[indx];
								if (raw == word.Tiles)
								{
									continue;
								}
								Match M = R.Match(word.Tiles);
								if (!M.Success)
								{
									continue;
								}

								string Pre = "";
								string Post = "";
								string Center = "";

								Pre = MatchedString(M.Groups["Pre"], "");
								for (int i = 0; i < word.Syllables; i++)
								{
									Center = Center + MatchedString(M.Groups["Center" + (i + 1)], ",") + ":";
								}
								Center = Center.TrimEnd(':');
								Post = MatchedString(M.Groups["Post"], "");

								string[] Pres = Pre == "" ? new string[] { } : Pre.TrimEnd(',').Split(',');
								string[] Centers = Center.Split(':');
								string[] Posts = Post == "" ? new string[] { } : Post.TrimStart(',').Split(',');

								if (Centers.Length != len)
								{
									Array.Resize(ref Centers, len);
									if (!Post.StartsWith(",") && Posts.Length > 0)
									{
										Centers[len - 1] = Posts[0];
										Posts = Posts.Skip(1).ToArray();
									}
								}

								var Tiles = Movables.GetRange(0, Movables.Count);

								bool res = Resolve(Pres, Centers, Posts, Tiles, SpeicalDict);
								if (!res)
								{
									continue;
								}

								if (wordOnBoard.Position == "R")
								{
									ProbableMove WH = TryHarizontal(Cells, size, wordOnBoard.Index, wordOnBoard.Syllables - 1, Pres, Centers, Posts);
									bool WHValid = Validate(WH, AllWords, Probables);
									if (WHValid)
									{
										Moves.Add(WH);
									}
								}
								if (wordOnBoard.Position == "C")
								{
									ProbableMove WH = TryVertical(Cells, size, wordOnBoard.Index, wordOnBoard.Syllables - 1, Pres, Centers, Posts);
									bool WHValid = Validate(WH, AllWords, Probables);
									if (WHValid)
									{
										Moves.Add(WH);
									}
								}
							}
						}
					}
				}
				Printer.PrintLine("\t\t Moves found: " + Moves.Count);
				return Moves;
			}
		}

		static bool Validate(ProbableMove Move, List<Word> AllWords, List<int> Probables)
		{
			Move.Words = Move.Words.Distinct(new ProbableWordComparer()).ToList();
			if (Move.Words.Count == 0 || Move.Moves.Count == 0)
			{
				return false;
			}
			return Validate(Move.Words, AllWords, Probables);
		}

		static bool Validate(List<ProbableWord> Words, List<Word> AllWords, List<int> Probables)
		{
			foreach (var w in Words)
			{
				var v = Probables.FindIndex(x => AllWords[x].Tiles == w.String);
				if (v == -1)
				{
					return false;
				}
			}
			return true;
		}
	}
}
