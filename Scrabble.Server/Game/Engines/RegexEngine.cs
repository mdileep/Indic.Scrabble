//---------------------------------------------------------------------------------------------
// <copyright file="RegexEngine.cs" company="Chandam-ఛందం">
//    Copyright © 2013 - 2018 'Chandam-ఛందం' : http://chandam.apphb.com
//    Original Author : Dileep Miriyala (m.dileep@gmail.com)
//    Last Updated    : 29-Mar-2018 20:23EST
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
	internal class RegexEngine : RegexEngineBase
	{
		public RegexEngine(ScrabbleBoard Board)
		{
			if (Board == null)
			{
				return;
			}
			var bot = Config.GetBot(Board.Bot);

			//
			var board = Config.GetBoard(Board.Name);
			if (board == null)
			{
				return;
			}
			//
			CharSet = Config.GetCharSet(board.Language);
			var voc = (bot == null) ? CharSet.Dictionary : bot.Dictionary;
			file = ServerUtil.Path("bots\\" + voc);
			id = bot.Id + Board.Id;
			//
			size = board.Size;
			weights = board.Weights;
			star = board.Star;
			//
			cells = Board.Cells;
			vowels = Board.Vowels;
			conso = Board.Conso;
			special = Board.Special;
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
			var MovableTiles = Movables.Replace("(", " ").Replace(")", " ").Replace(",", "").Split(' ').ToList();
			MovableTiles.RemoveAll(x => x.Length == 0);

			var SpecialList = DistinctList(special.Replace("(", " ").Replace(")", " ").Replace(",", ""), ' ');
			var SpeicalDict = GetSpecialDict(SpecialList);

			List<string> EverySyllableOnBoard = GetSyllableList(cells, size, true, false, true);
			List<string> NonCornerSyllables = GetSyllableList(cells, size, false, true, false);

			//
			All = (GetFlatList(EverySyllableOnBoard, ',') + " " + Movables).Replace("(", " ").Replace(")", " ").Replace(",", " ").Replace("|", " ").Split(' ');
			AllPattern = string.Format("^(?<All>[{0},])*$", GetFlatList2(All));
			Dictionary<string, int> AllDict = GetCountDict(All);

			List<Word> WordsDictionary = WordLoader.Load(file); //Large Set of Words
			WordsDictionary = ShortList(WordsDictionary, AllPattern, AllDict); // Probables 

			if (EverySyllableOnBoard.Count > 0)
			{
				var NonCornerPattern = "";
				string[] NonCornerTiles = new string[] { };
				//
				NonCornerTiles = (GetFlatList2(NonCornerSyllables.ToArray()) + " " + Movables).Replace("(", " ").Replace(")", " ").Replace(",", " ").Replace("|", " ").Split(' ');
				NonCornerPattern = string.Format("^(?<All>[{0},])*$", GetFlatList2(NonCornerTiles));
				Dictionary<string, int> NonCornerDict = GetCountDict(NonCornerTiles);
				var NonCornerProbables = ShortList(WordsDictionary, NonCornerPattern, NonCornerDict);  //Non Corner Probables

				Thread t1 = new Thread(() =>
				{
					Moves.AddRange(SyllableExtensions(cells, size, CharSet, WordsDictionary, NonCornerProbables, MovableTiles, SpeicalDict));
				});

				Thread t2 = new Thread(() =>
				{
					Moves.AddRange(WordExtensions(cells, size, CharSet, WordsDictionary, MovableTiles, SpeicalDict));
				});

				t1.Start(); t2.Start();
				t1.Join(); t2.Join();
			}
			else
			{
				Moves.AddRange(EmptyExtensions(cells, size, CharSet, star, WordsDictionary, MovableTiles, SpeicalDict));
			}

			WordsDictionary = null; WordsDictionary = null;
			RefreshScores(Moves, weights, size);
			return Moves;
		}

		protected static List<ProbableMove> EmptyExtensions(string[] Cells, int size, CharSet CharSet, int star, List<Word> AllWords, List<string> Movables, Dictionary<string, Regex> SpeicalDict)
		{
			using (new Watcher("\tEmpty Extesnsions"))
			{
				List<ProbableMove> Moves = new List<ProbableMove>();
				{
					foreach (Word word in AllWords)
					{
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

						ProbableMove WH = TryHarizontal(0, Cells, size, star - centroid, 0, Pres, Centers, Posts);
						ProbableMove WV = TryVertical(0, Cells, size, star - centroid, 0, Pres, Centers, Posts);

						bool WHValid = Validate(WH, AllWords);
						bool WVValid = Validate(WV, AllWords);

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
		protected static List<ProbableMove> SyllableExtensions(string[] Cells, int size, CharSet CharSet, List<Word> AllWords, List<Word> Probables, List<string> Movables, Dictionary<string, Regex> SpeicalDict)
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
							foreach (Word probable in Probables)
							{
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

								ProbableMove WH = TryHarizontal(1, Cells, size, syllable.Index, 0, Pres, Centers, Posts);
								ProbableMove WV = TryVertical(1, Cells, size, syllable.Index, 0, Pres, Centers, Posts);

								bool WHValid = Validate(WH, AllWords);
								bool WVValid = Validate(WV, AllWords);

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
		protected static List<ProbableMove> WordExtensions(string[] Cells, int size, CharSet CharSet, List<Word> AllWords, List<string> Movables, Dictionary<string, Regex> SpeicalDict)
		{
			using (new Watcher("\tWord Extensions"))
			{
				List<ProbableMove> Moves = new List<ProbableMove>();
				{
					var WordsOnBoard = GetWordsOnBoard(Cells, size, false);
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
							foreach (Word word in AllWords)
							{
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
									ProbableMove WH = TryHarizontal(2, Cells, size, wordOnBoard.Index, wordOnBoard.Syllables - 1, Pres, Centers, Posts);
									bool WHValid = Validate(WH, AllWords);
									if (WHValid)
									{
										Moves.Add(WH);
									}
								}
								if (wordOnBoard.Position == "C")
								{
									ProbableMove WH = TryVertical(2, Cells, size, wordOnBoard.Index, wordOnBoard.Syllables - 1, Pres, Centers, Posts);
									bool WHValid = Validate(WH, AllWords);
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

		protected string file;
		protected int size;
		protected string[] cells;
		protected int[] weights;
		protected string vowels;
		protected string conso;
		protected string special;
		protected int star;
		protected string id;
	}
}
