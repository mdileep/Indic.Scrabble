//---------------------------------------------------------------------------------------------
// <copyright file="Runner.cs" company="Chandam-ఛందం">
//    Copyright © 2013 - 2018 'Chandam-ఛందం' : http://chandam.apphb.com
//    Original Author : Dileep Miriyala (m.dileep@gmail.com)
//    Last Updated    : 21-Mar-2018 23:35EST
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
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;

namespace Scrabble
{
	public class Runner
	{
		CharSet CharSet;
		private string file;
		private int size;
		private string[] cells;
		private int[] weights;
		private string vowels;
		private string conso;
		private string special;

		public Runner(ScrabbleBoard Board)
		{
			if (Board == null)
			{
				return;
			}
			var bot = Config.GetBot(Board.Bot);
			if (bot == null)
			{
				return;
			}

			var board = Config.GetBoard(Board.Name);
			if (board == null)
			{
				return;
			}
			
			//
			file = bot.Dictionary;
			CharSet = Config.GetCharSet(bot.Language);
			//
			size = board.Size;
			weights = board.Weights;
			//
			cells = Board.Cells;
			vowels = Board.Vowels;
			conso = Board.Conso;
			special = Board.Special;
		}

		public List<ProbableMove> Run()
		{
			var Moves = new List<ProbableMove>();
			if (!new FileInfo(ServerUtil.Path(file)).Exists)
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


			int maxIndex = MaxWeightIndex(weights);
			List<Word> WordsOnBoard = new List<Word>();
			string[] inputs = new string[] { };
			string EmptyBoardPattern = "";
			var SyllablePattern = "";
			var SunnaPattern = ""; var SunnaPattern2 = "";
			var WordPattern = "";
			string[] options = new string[] { };
			{
				List<string> NonCornerSyllables = GetSyllableList(cells, size, true, false);
				List<string> EverySyllableOnBoard = GetSyllableList(cells, size, false, true);
				WordsOnBoard = GetWordsOnBoard(cells, size, false);

				inputs = (GetFlatList(EverySyllableOnBoard, ',') + " " + vowels + " " + conso + " " + special).Replace("(", " ").Replace(")", " ").Replace(",", " ").Replace("|", " ").Split(' ');

				BuildPatterns(NonCornerSyllables, WordsOnBoard,
							vowels, conso, special,
							ref SunnaPattern, ref SunnaPattern2,
							ref EmptyBoardPattern, ref SyllablePattern, ref WordPattern);

				options = (vowels + " " + conso + " " + special.Replace("(", " ").Replace(")", " ").Replace(",", "")).Split(' ');
			}

			List<Word> WordsDictionary = LoadWords(file);

			if (!string.IsNullOrEmpty(EmptyBoardPattern))
			{
				List<Word> EmptyBoardProbables = ShortList(inputs, WordsDictionary, EmptyBoardPattern, options);
				Moves.AddRange(EmptyExtensions(cells, size, maxIndex, WordsDictionary, EmptyBoardProbables));
			}
			else
			{
				List<Word> SyllableProbables = ShortList(inputs, WordsDictionary, SyllablePattern, options);
				Moves.AddRange(SyllableExtensions(cells, size, WordsDictionary, SyllableProbables, SunnaPattern));

				List<Word> WordProbables = ShortList(inputs, WordsDictionary, WordPattern, options);
				Moves.AddRange(WordExtensions(cells, size, WordsDictionary, WordProbables, WordsOnBoard, SunnaPattern2));
			}
			WordsDictionary = null; //Kill it quickly ..!!

			RefreshScores(Moves, weights, size);

			return Moves;
		}

		void BuildPatterns(List<string> NonCornerSyllables,
								   List<Word> WordsOnBoard,
								   string Vowels,
								   string Conso,
								   string Special,
								   ref string SunnaPattern,
								   ref string SunnaPattern2,
								   ref string EmptyBoardPattern,
								   ref string SyllablePattern,
								   ref string WordPattern)

		{
			string SyllableSeq = GetFlatList(NonCornerSyllables, '|');
			string WordSeq = GetFlatList(WordsOnBoard, ':');

			Vowels = Distinct(Vowels, ' ');
			Conso = Distinct(Conso, ' ');
			Special = Distinct(Special, ' ');
			WordSeq = Distinct(WordSeq, ':');

			// ConsoOptions:
			//            C-Options
			// AllOptions:
			//            C-Options+V-Options
			// SpecialPattern:
			//            (మ[ConsoOptions]ఉ)|(కష)
			// ConsoPattern:
			//           ([ConsoOptions + Comma] | SpecialPattern)*
			// ConsoPatternNoComma:
			//           ([ConsoOptions] | SpecialPattern)*
			// AllPattern:
			//           ([AllOptions + Comma] | SpecialPattern)*

			string consoOptions = Conso.Replace(" ", "");
			string specialOptions = Special.Replace("(", "").Replace(")", "");
			string specialPattern = GetSpecialSyllablePattern(specialOptions, consoOptions);
			string consoPatternNoComma = Special == "" ?
										string.Format("(?<Conso>[{0}])*", consoOptions) :
										string.Format("(?<Conso>[{0}]|{1})*", consoOptions, specialPattern);
			string allOptions = (Conso + Vowels).Replace(" ", "");
			string allPattern = Special == "" ?
										string.Format("(?<All>[{0},]*)", allOptions) :
										string.Format("(?<All>[{0},]|{1})*", allOptions, specialPattern);
			string allPatternNoComma = Special == "" ?
										string.Format("(?<All>[{0}]*)", allOptions) :
										string.Format("(?<All>[{0}]|{1})*", allOptions, specialPattern);
			string sunnaOptions = GetSunnaOptions(Vowels);
			SunnaPattern = sunnaOptions == "" ? "" : string.Format("(?<Sunna>[{0}]*)", sunnaOptions);
			SunnaPattern2 = sunnaOptions == "" ? "" : string.Format("(?<Center{{0}}>[{0}]*)", sunnaOptions);

			if (SyllableSeq == "")
			{
				EmptyBoardPattern = string.Format("^{0}$", allPattern);
			}
			else
			{
				if (SyllableSeq != "")
				{
					// Accu or Hallu:
					//      AllPattern Accu AllPattern
					// H-V:
					//       AllPattern H1 ConsoPatternNoComma V1 AllPattern
					SyllablePattern = GetSyllablePattern(SyllableSeq.Replace("(", "").Replace(")", "").Split('|'), consoPatternNoComma, allPattern);
					SyllablePattern = string.Format("^({0})*?$", SyllablePattern);
				}
				if (WordSeq != "")
				{
					WordPattern = GenWordsPattern(WordSeq, consoPatternNoComma, SunnaPattern, allPatternNoComma, allPattern, allPattern, false);
					WordPattern = string.Format("^{0}$", WordPattern);
				}
			}
		}

		string GetPattern(string pos)
		{
			string x = GenSyllableFilter(pos, false);
			x = x.TrimEnd(',');
			x = "^(.*?)" + x.Replace("{0}", "").Replace("{1}", "(.*?)") + "(.*?)$";
			return x;
		}

		string GetSunnaOptions(string Vowels)
		{
			string ret = "";
			foreach (string vowel in Vowels.Split(' '))
			{
				if (CharSet.SunnaSet.Contains(vowel))
				{
					ret = ret + vowel;
				}
			}
			return ret;
		}

		int MaxWeightIndex(int[] Weights)
		{
			int maxIndex = 0;
			int maxVal = 0;
			int index = 0;
			foreach (int weight in Weights)
			{
				if (weight > maxVal)
				{
					maxVal = weight;
					maxIndex = index;
				}
				index++;
			}
			return maxIndex;
		}

		void RefreshScores(List<ProbableMove> Moves, int[] Weights, int size)
		{
			foreach (var Move in Moves)
			{
				int score = 0;
				foreach (var w in Move.Words)
				{
					var wordScore = 0;
					foreach (var cell in w.Cells)
					{
						var weight = Weights[cell.Index];
						wordScore = wordScore + weight;
						cell.Score = weight;
					}
					w.Score = wordScore;
					score = score + wordScore;
				}
				Move.Score = score;
			}
			Moves.Sort(delegate (ProbableMove x, ProbableMove y)
			{
				return x.Score.CompareTo(y.Score);
			});
			Moves.Reverse();
		}

		List<ProbableMove> EmptyExtensions(string[] Cells, int size, int maxIndex, List<Word> AllWords, List<Word> List)
		{
			List<ProbableMove> Moves = new List<ProbableMove>();
			{
				foreach (Word word in List)
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

					ProbableMove WH = TryHarizontal(Cells, size, maxIndex, 0, Pres, Centers, Posts);
					ProbableMove WV = TryVertical(Cells, size, maxIndex, 0, Pres, Centers, Posts);

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

		List<ProbableMove> WordExtensions(string[] Cells, int size, List<Word> AllWords, List<Word> WordExtensions, List<Word> WordsOnBoard, string SunnaPattern)
		{
			List<ProbableMove> Moves = new List<ProbableMove>();
			{
				foreach (Word wordOnBoard in WordsOnBoard)
				{
					string raw = wordOnBoard.Tiles.Replace("(", "").Replace(")", "").Replace(",", "").Replace("|", ",");

					string pattern = GenWordPattern(wordOnBoard.Tiles, "(?<Center{0}>.*?)", SunnaPattern, "(?<Center{0}>.*?)", "(?<Pre>.*?)", "(?<Post>.*?)", true);
					pattern = string.Format("^{0}$", pattern.TrimEnd('|'));
					Regex R = new Regex(pattern);

					foreach (Word word in WordExtensions)
					{
						if (raw == word.Tiles)
						{
							continue;
						}

						Match M = R.Match(word.Tiles);
						if (M.Success)
						{
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


							if (wordOnBoard.Position == "R")
							{
								ProbableMove WH = TryHarizontal(Cells, size, wordOnBoard.Index, wordOnBoard.Syllables - 1, Pres, Centers, Posts);
								bool WHValid = Validate(WH, AllWords);
								if (WHValid)
								{
									Moves.Add(WH);
								}
							}
							if (wordOnBoard.Position == "C")
							{
								ProbableMove WH = TryVertical(Cells, size, wordOnBoard.Index, wordOnBoard.Syllables - 1, Pres, Centers, Posts);
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
			return Moves;
		}

		string MatchedString(Group group, string seperator)
		{
			string ret = "";
			foreach (Capture capture in group.Captures)
			{
				ret = ret + capture.Value + seperator;
			}
			if (!string.IsNullOrEmpty(seperator))
			{
				ret = ret.TrimEnd(seperator.ToCharArray());
			}
			return ret;
		}

		List<ProbableMove> SyllableExtensions(string[] Cells, int size, List<Word> AllWords, List<Word> List, string SunnaPattern)
		{
			List<ProbableMove> Moves = new List<ProbableMove>();
			{
				List<Word> All = GetSyllableList2(Cells, size, false, true);

				foreach (Word pos in All)
				{
					string pattern = GetSyllablePattern2(pos.Tiles, "(?<Conso>.*?)", "(?<Pre>.*?)", SunnaPattern + "(?<Post>.*?)");
					pattern = string.Format("^{0}$", pattern);
					Regex R = new Regex(pattern);

					foreach (Word word in List)
					{
						string Pre = "";
						string Center = "";
						string Post = "";

						Match M = R.Match(word.Tiles);
						if (!M.Success)
						{
							continue;
						}

						Pre = MatchedString(M.Groups["Pre"], "");
						Center = MatchedString(M.Groups["Sunna"], "");
						Post = MatchedString(M.Groups["Post"], "");


						string[] Pres = Pre == "" ? new string[] { } : Pre.TrimEnd(',').Split(',');
						string[] Centers = Center.Split(',');
						string[] Posts = Post == "" ? new string[] { } : Post.TrimStart(',').Split(',');


						ProbableMove WH = TryHarizontal(Cells, size, pos.Index, 0, Pres, Centers, Posts);
						ProbableMove WV = TryVertical(Cells, size, pos.Index, 0, Pres, Centers, Posts);

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
			return Moves;
		}

		ProbableMove TryHarizontal(string[] Cells, int size, int Index, int offset, string[] Pre, string[] Centers, string[] Post)
		{
			List<Word> Moves = new List<Word>();
			int PreCount = Pre.Length;
			int PostCount = Post.Length;
			char Seperator = ',';


			string[] NewCells = (string[])Cells.Clone();
			List<int> Impacted = new List<int>();


			if (Pre.Length != 0)
			{
				for (int x = Pre.Length - 1; x >= 0; x--)
				{
					Neighbor n = BoardUtil.FindNeighbors(Index - x, size);
					if (n.Left != -1)
					{
						string temp = Join(Pre[x], Seperator);
						NewCells[n.Left] += temp;
						Impacted.Add(n.Left);
						Moves.Add(new Word { Tiles = temp, Index = n.Left });
					}
				}
			}
			if (Centers.Length != 0)
			{
				for (int c = 0; c < Centers.Length; c++)
				{
					int cellIndex = Index + c;
					if (cellIndex == -1 || Centers[c] == "")
					{
						continue;
					}

					string temp = Join(Centers[c], Seperator);
					NewCells[cellIndex] += temp;
					Impacted.Add(cellIndex);
					Moves.Add(new Word { Tiles = temp, Index = cellIndex });
				}
			}

			if (Post.Length != 0)
			{
				for (int x = 0; x < Post.Length; x++)
				{
					Neighbor n = BoardUtil.FindNeighbors(Index + offset + x, size);
					if (n.Right != -1)
					{
						string temp = Join(Post[x], Seperator);
						NewCells[n.Right] += temp;
						Impacted.Add(n.Right);
						Moves.Add(new Word { Tiles = temp, Index = n.Right });
					}
				}
			}

			List<ProbableWord> W = new List<ProbableWord>();
			foreach (int index in Impacted)
			{
				W.AddRange(WordsAt(NewCells, size, index));
			}
			return new ProbableMove { Words = W, Moves = Moves, Direction = "H" };
		}

		ProbableMove TryVertical(string[] Cells, int size, int Index, int offset, string[] Pre, string[] Centers, string[] Post)
		{
			List<Word> Moves = new List<Word>();

			int PreCount = Pre.Length;
			int PostCount = Post.Length;
			char Seperator = ',';

			Point Pos = BoardUtil.Position(Index, size);

			string[] NewCells = (string[])Cells.Clone();
			List<int> Impacted = new List<int>();

			if (Pre.Length != 0)
			{

				for (int x = Pre.Length - 1; x >= 0; x--)
				{
					int cellIndex = BoardUtil.Abs(Pos.X - x, Pos.Y, size);
					Neighbor n = BoardUtil.FindNeighbors(cellIndex, size);
					if (n.Top != -1)
					{
						string temp = Join(Pre[x], Seperator);
						NewCells[n.Top] += temp;
						Impacted.Add(n.Top);
						Moves.Add(new Word { Tiles = temp, Index = n.Top });
					}
				}
			}

			if (Centers.Length != 0)
			{

				for (int c = 0; c < Centers.Length; c++)
				{
					int cellIndex = BoardUtil.Abs(Pos.X + c, Pos.Y, size);
					if (cellIndex == -1 || Centers[c] == "")
					{
						continue;
					}
					string temp = Join(Centers[c], Seperator);
					NewCells[cellIndex] += temp;
					Impacted.Add(cellIndex);
					Moves.Add(new Word { Tiles = temp, Index = cellIndex });
				}
			}

			if (Post.Length != 0)
			{

				for (int x = 0; x < Post.Length; x++)
				{
					int cellIndex = BoardUtil.Abs(Pos.X + offset + x, Pos.Y, size);
					Neighbor n = BoardUtil.FindNeighbors(cellIndex, size);
					if (n.Bottom != -1)
					{
						string temp = Join(Post[x], Seperator);
						NewCells[n.Bottom] += temp;
						Impacted.Add(n.Bottom);
						Moves.Add(new Word { Tiles = temp, Index = n.Bottom });
					}
				}
			}

			List<ProbableWord> W = new List<ProbableWord>();
			foreach (int index in Impacted)
			{
				W.AddRange(WordsAt(NewCells, size, index));
			}
			return new ProbableMove { Words = W, Moves = Moves, Direction = "V" };
		}

		List<ProbableWord> WordsAt(string[] Cells, int size, int index)
		{
			List<ProbableWord> List = new List<ProbableWord>();
			Neighbor Neighbor = BoardUtil.FindNeighbors(index, size);

			string r = Neighbor.Right != -1 ? Cells[Neighbor.Right] : "";
			string l = Neighbor.Left != -1 ? Cells[Neighbor.Left] : "";
			string t = Neighbor.Top != -1 ? Cells[Neighbor.Top] : "";
			string b = Neighbor.Bottom != -1 ? Cells[Neighbor.Bottom] : "";

			List<Word> Lefties = new List<Word>();
			List<Word> Righties = new List<Word>();

			if (r != "")
			{
				//Move Right..
				Righties.Add(new Word { Tiles = r, Index = Neighbor.Right });
				int index_ = Neighbor.Right;
				bool flg = true;
				while (flg)
				{
					Neighbor n = BoardUtil.FindNeighbors(index_, size);
					string r_ = n.Right != -1 ? Cells[n.Right] : "";
					if (r_ == "")
					{
						flg = false;
						break;
					}
					Righties.Add(new Word { Tiles = r_, Index = n.Right });
					index_ = n.Right;
				}
			}
			if (l != "")
			{
				//Move Left..
				Lefties.Add(new Word { Tiles = l, Index = Neighbor.Left });

				int index_ = Neighbor.Left;
				bool flg = true;
				while (flg)
				{
					Neighbor n = BoardUtil.FindNeighbors(index_, size);
					string l_ = n.Left != -1 ? Cells[n.Left] : "";
					if (l_ == "")
					{
						flg = false;
						break;
					}
					Lefties.Add(new Word { Tiles = l_, Index = n.Left });
					index_ = n.Left;
				}
			}

			List<Word> Topies = new List<Word>();
			List<Word> Downies = new List<Word>();

			if (t != "")
			{
				//Move Top..
				Topies.Add(new Word { Tiles = t, Index = Neighbor.Top });
				int index_ = Neighbor.Top;
				bool flg = true;
				while (flg)
				{
					Neighbor n = BoardUtil.FindNeighbors(index_, size);
					string t_ = n.Top != -1 ? Cells[n.Top] : "";
					if (t_ == "")
					{
						flg = false;
						break;
					}
					Topies.Add(new Word { Tiles = t_, Index = n.Top });
					index_ = n.Top;
				}
			}

			if (b != "")
			{
				//Move Bottom..
				Downies.Add(new Word { Tiles = b, Index = Neighbor.Bottom });
				int index_ = Neighbor.Bottom;
				bool flg = true;
				while (flg)
				{
					Neighbor n = BoardUtil.FindNeighbors(index_, size);
					string d_ = n.Bottom != -1 ? Cells[n.Bottom] : "";
					if (d_ == "")
					{
						flg = false;
						break;
					}
					Downies.Add(new Word { Tiles = d_, Index = n.Bottom });
					index_ = n.Bottom;
				}
			}

			Topies.Reverse();
			Lefties.Reverse();

			if (Topies.Count + Downies.Count > 0)
			{
				ProbableWord Vertical = MakeAWord(Topies, new Word { Tiles = Cells[index], Index = index }, Downies);
				List.Add(Vertical);
			}
			if (Lefties.Count + Righties.Count > 0)
			{
				ProbableWord Harizontal = MakeAWord(Lefties, new Word { Tiles = Cells[index], Index = index }, Righties);
				List.Add(Harizontal);
			}
			return List;
		}

		ProbableWord MakeAWord(List<Word> F1, Word C, List<Word> F2)
		{
			ProbableWord W = new ProbableWord();
			List<TargetCell> List = new List<TargetCell>();
			string ret = "";
			foreach (Word s in F1)
			{
				ret = ret + s.Tiles.Replace(",", "") + ",";
				TargetCell Cell = new TargetCell { Target = s.Tiles, Index = s.Index };
				List.Add(Cell);
			}
			{
				ret = ret + C.Tiles.Replace(",", "") + ",";
				TargetCell Cell = new TargetCell { Target = C.Tiles, Index = C.Index };
				List.Add(Cell);
			}
			foreach (Word s in F2)
			{
				ret = ret + s.Tiles.Replace(",", "") + ",";
				TargetCell Cell = new TargetCell { Target = s.Tiles, Index = s.Index };
				List.Add(Cell);
			}
			ret = ret.Trim(',');
			W.String = ret;
			W.Cells = List;
			return W;
		}

		List<Word> LoadWords(string file)
		{
			List<Word> List = new List<Word>();
			string[] lines = System.IO.File.ReadAllLines(ServerUtil.Path(file));
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

		List<Word> ShortList(string[] inputs, List<Word> words, string pattern, string[] options)
		{
			if (string.IsNullOrEmpty(pattern))
			{
				return new List<Word>();
			}

			Dictionary<string, int> InputDict = GetCountDict(inputs);
			Dictionary<string, int> InputDict2 = GetCountDict(options);

			List<Word> Matches = MatchedWords2(words, pattern);
			List<Word> Shortlisted = new List<Word>();
			{
				foreach (Word word in Matches)
				{
					if (word.Syllables == 1)
					{
						continue;
					}

					Dictionary<string, int> CharCount = GetCountDict(word.Tiles);

					bool isValid = Validate(InputDict, CharCount);
					if (!isValid)
					{
						continue;
					}

					Dictionary<string, int> CharCount2 = GetCountDict2(word.Tiles, pattern);
					isValid = Validate(InputDict2, CharCount2);
					if (!isValid)
					{
						continue;
					}

					Shortlisted.Add(word);
				}
			}

			return Shortlisted;
		}

		Dictionary<string, int> GetCountDict2(string input, string pattern)
		{
			Dictionary<string, int> Extra = new Dictionary<string, int>();

			Regex R = new Regex(pattern);
			var M = R.Match(input);

			Group Conso = M.Groups["Conso"];
			Group Special = M.Groups["Special"];
			Group All = M.Groups["All"];

			UpdateDict(Conso, Extra, 1);
			UpdateDict(Special, Extra, 2);
			UpdateDict(All, Extra, 1);

			return Extra;
		}

		void UpdateDict(Group Conso, Dictionary<string, int> Extra, int threshold)
		{
			foreach (Capture capture in Conso.Captures)
			{
				if (capture.Value == "," || (capture.Value.Length > threshold))
				{
					continue;
				}
				if (Extra.ContainsKey(capture.Value))
				{
					Extra[capture.Value]++;
				}
				else
				{
					Extra[capture.Value] = 1;
				}
			}
		}

		bool Validate(ProbableMove WV, List<Word> AllWords)
		{
			WV.Words = WV.Words.Distinct(new ProbableWordComparer()).ToList();
			if (WV.Words.Count == 0 || WV.Moves.Count == 0)
			{
				return false;
			}
			return Validate(WV.Words, AllWords);
		}

		bool Validate(List<ProbableWord> WV, List<Word> AllWords)
		{
			foreach (var w in WV)
			{
				var v = AllWords.Find(x => x.Tiles == w.String);
				if (v == null)
				{
					return false;
				}
			}
			return true;
		}

		string Insert(string original, string val)
		{
			List<string> Consos = new List<string>();
			List<string> Vowels = new List<string>();
			Classify(original == "" ? val : (original + "," + val), Consos, Vowels);
			string ret = "";
			foreach (string a in Consos)
			{
				ret = ret + a;
			}
			foreach (string a in Vowels)
			{
				ret = ret + a;
			}
			return ret;
		}

		string Join(string str, char join)
		{
			string ret = "";
			foreach (char ch in str)
			{
				ret = ret + ch + join;
			}
			ret = ret.TrimEnd(join);
			return ret;
		}

		string GenWordsPattern(string Set, string consoPatternNoComma, string sunnaPattern, string allPatternNoComma,
		   string prePattern, string postPattern, bool useSyllableIndex)
		{
			if (Set == "")
			{
				return "";
			}
			string ret = "";
			foreach (string word in Set.Split(':'))
			{
				ret = ret + GenWordPattern(word, consoPatternNoComma, sunnaPattern, allPatternNoComma, prePattern, postPattern, useSyllableIndex);
			}
			ret = ret.TrimEnd('|');
			return ret;
		}

		string GenWordPattern(string word, string consoPatternNoComma, string sunnaPattern, string allPatternNoComma,
		   string prePattern, string postPattern,
		   bool useSyllableIndex)
		{
			string temp = "";
			var arr = word.Split('|');
			for (int i = 0; i < arr.Length; i++)
			{
				string syllable = arr[i];

				string pattern = "";
				if (useSyllableIndex)
				{
					pattern = GetSyllablePattern(
							syllable.Replace("(", "").Replace(")", ""),
							string.Format(consoPatternNoComma, i + 1),
							string.Format(sunnaPattern, i + 1),
							i == arr.Length - 1 ? "" : string.Format(allPatternNoComma, i + 1));
				}
				else
				{
					pattern = GetSyllablePattern(
						syllable.Replace("(", "").Replace(")", ""),
						consoPatternNoComma,
						sunnaPattern,
						i == arr.Length - 1 ? "" : allPatternNoComma);
				}
				temp = temp + pattern + ",";
			}
			temp = temp.TrimEnd(',');
			temp = prePattern + temp + postPattern;
			temp = string.Format("({0})|", temp);
			return temp;
		}

		string GetSyllablePattern(string[] syllables, string consoPatternNoComma, string allPattern)
		{
			string ret = "";
			foreach (string syllable in syllables)
			{
				string temp = GetSyllablePattern(syllable, consoPatternNoComma, allPattern);
				ret = ret + temp + "|";
			}
			ret = ret.TrimEnd('|');
			return ret;
		}

		string GetSyllablePattern(string syllable, string consoPatternNoComma, string sunnaPattern, string allPatternNoComma)
		{
			string temp = "";
			List<string> Consos = new List<string>();
			List<string> Vowels = new List<string>();
			Classify(syllable, Consos, Vowels);

			if (Vowels.Count > 0 && Consos.Count > 0)
			{
				// H-V:
				//       H1 ConsoPatternNoComma V1 AllPattern
				string tempC = "";
				foreach (var a in Consos)
				{
					tempC = tempC + a;
				}

				string tempA = "";
				foreach (var a in Vowels)
				{
					tempA = tempA + a;
				}
				////కష(ConsoNoComma)ఇ(Sunna)
				temp = string.Format("{0}{1}{2}{3}", tempC, consoPatternNoComma, tempA, sunnaPattern);
			}
			else
			{
				foreach (var a in Consos)
				{
					temp = temp + a;
				}
				if (Vowels.Count == 0)
				{
					//కష(AllNoComma)
					temp = string.Format("{0}{1}", temp, allPatternNoComma == "" ? "" : (allPatternNoComma));
				}

				foreach (var a in Vowels)
				{
					temp = temp + a;
				}

				if (Consos.Count == 0)
				{
					//అ(Sunna)
					temp = string.Format("{0}{1}", temp, sunnaPattern);
				}

				if (Vowels.Count == 0 && Consos.Count == 0)
				{
					Debugger.Break();
				}

			}
			return temp;
		}

		string GetSyllablePattern(string syllable, string consoPatternNoComma, string allPattern)
		{
			return GetSyllablePattern2(syllable, consoPatternNoComma, allPattern, allPattern);
		}

		string GetSyllablePattern2(string syllable, string consoPatternNoComma, string prePattern, string PostPattern)
		{
			string temp = "";
			List<string> Consos = new List<string>();
			List<string> Vowels = new List<string>();
			Classify(syllable, Consos, Vowels);
			if (Vowels.Count > 0 && Consos.Count > 0)
			{
				// H-V:
				//       AllPattern H1 ConsoPatternNoComma V1 AllPattern
				string tempC = "";
				foreach (var a in Consos)
				{
					tempC = tempC + a;
				}

				string tempA = "";
				foreach (var a in Vowels)
				{
					tempA = tempA + a;
				}
				temp = string.Format("({3}({0}{1}{2}){4})", tempC, consoPatternNoComma, tempA, prePattern, PostPattern);
			}
			else
			{
				// Accu or Hallu:
				//      AllPattern Accu AllPattern
				foreach (var a in Consos)
				{
					temp = temp + a;
				}
				foreach (var a in Vowels)
				{
					temp = temp + a;
				}
				temp = string.Format("({1}{0}{2})", temp, prePattern, PostPattern);
			}
			return temp;
		}

		void Classify(string syllable, List<string> Consos, List<string> Vowels)
		{
			List<string> Sunna = new List<string>();
			foreach (string c in syllable.Split(','))
			{
				if (CharSet.SunnaSet.Contains(c))
				{
					Sunna.Add(c);
				}
				else
				{
					if (CharSet.Vowels.Contains(c))
					{
						Vowels.Add(c);
					}
					else if (CharSet.Consonents.Contains(c))
					{
						Consos.Add(c);
					}
					else
					{
						Debugger.Break();
					}
				}
			}
			Vowels.AddRange(Sunna);
		}

		string GetSpecialSyllablePattern(string specialOptions, string consoOptions)
		{
			if (string.IsNullOrEmpty(specialOptions))
			{
				return "";
			}
			string[] syllables = specialOptions.Split(' ');
			string ret = ""; int Special = 1;
			foreach (string syllable in syllables)
			{
				string temp = "";

				List<string> Consos = new List<string>();
				List<string> Vowels = new List<string>();
				Classify(syllable, Consos, Vowels);

				if (Vowels.Count > 0 && Consos.Count > 0)
				{
					//Both Exists
					//(మ[ConsoOptions]ఉ)
					foreach (var a in Consos)
					{
						temp = temp + a;
					}
					temp = temp + string.Format("[{0}]*", consoOptions);
					foreach (var a in Vowels)
					{
						temp = temp + a;
					}
					temp = string.Format("(?<Special>{0})", temp);
				}
				else
				{
					//Both Exists
					//(కష)
					foreach (var a in Consos)
					{
						temp = temp + a;
					}
					foreach (var a in Vowels)
					{
						temp = temp + a;
					}
					temp = string.Format("(?<Special>{0})", temp, Special);
				}
				Special++;
				ret = ret + temp + "|";
			}
			ret = ret.TrimEnd('|');
			return ret;
		}

		string GenSyllableFilter(string syllable, bool useStandard)
		{
			string ret = "";
			string standard = "";
			List<string> Consos = new List<string>();
			List<string> Vowels = new List<string>();
			List<string> Sunna = new List<string>();
			foreach (string c in syllable.Split(','))
			{
				if (CharSet.Vowels.Contains(c))
				{
					Vowels.Add(c);
				}
				else if (CharSet.Consonents.Contains(c))
				{
					Consos.Add(c);
				}
				else if (CharSet.SunnaSet.Contains(c))
				{
					Sunna.Add(c);
				}
				else
				{
					Debugger.Break();
				}
			}
			foreach (string a in Consos)
			{
				ret = ret + a;
				standard = standard + a;
			}
			if (Consos.Count > 0)
			{
				if (Vowels.Count == 0)
				{
					ret = ret + "{0}";
				}
				else
				{
					ret = ret + "{1}";
				}
			}
			foreach (string a in Vowels)
			{
				ret = ret + a;
				standard = standard + a;
			}
			foreach (string a in Sunna)
			{
				standard = standard + a;
			}
			if (Consos.Count == 0)
			{
				if (useStandard)
				{
					ret = ret + "{0}";
				}
			}

			//Not Handling Sunna Set for now
			if (useStandard)
			{
				ret = "(" + ret + ")" + "|";
			}
			else
			{
				ret = "(" + ret + ")" + ",";
			}

			if (useStandard)
			{
				standard = "(" + standard + "{0})|({0}" + standard + ")|";
				ret = ret + standard;
			}
			return ret;
		}

		string GenSyllablesFilter2(string Set)
		{
			string ret = "";
			foreach (string s in Set.Split('|'))
			{
				string x = s.Replace("(", "").Replace(")", "");
				ret = ret + GenSyllableFilter2(x);
			}
			ret = ret.TrimEnd('|');
			return ret;
		}

		string GenSyllableFilter2(string syllable)
		{
			string ret = "";
			List<string> Consos = new List<string>();
			List<string> Vowels = new List<string>();
			List<string> Sunna = new List<string>();
			foreach (string c in syllable.Split(','))
			{
				if (CharSet.Vowels.Contains(c))
				{
					Vowels.Add(c);
				}
				else if (CharSet.Consonents.Contains(c))
				{
					Consos.Add(c);
				}
				else if (CharSet.SunnaSet.Contains(c))
				{
					Sunna.Add(c);
				}
				else
				{
					Debugger.Break();
				}
			}
			foreach (string a in Consos)
			{
				ret = ret + a;
			}
			if (Consos.Count > 0)
			{
				if (Vowels.Count == 0)
				{
					ret = ret + "{0}";
				}
				else
				{
					ret = ret + "{1}";
				}
			}
			foreach (string a in Vowels)
			{
				ret = ret + a;
			}

			if (Consos.Count == 0)
			{
				ret = ret + "{0}";
			}

			//Not Handling Sunna Set for now

			if (Vowels.Count == 0 || Consos.Count == 0)
			{
				ret = "({0}" + ret + ")" + "|";
			}
			else
			{
				ret = "({0}(" + ret + "){0})" + "|";
			}
			return ret;
		}

		string GenSyllablesFilter(string Set)
		{
			string ret = "";
			foreach (string s in Set.Split('|'))
			{
				string x = s.Replace("(", "").Replace(")", "");
				ret = ret + GenSyllableFilter(x, true);
			}
			ret = ret.TrimEnd('|');
			return ret;
		}

		string GetFlatList(List<string> List, char Seperator)
		{
			string ret = "";
			foreach (string s in List)
			{
				ret = ret + s + Seperator;
			}
			ret = ret.TrimEnd(Seperator);
			return ret;
		}

		string GetFlatList(List<Word> List, char Seperator)
		{
			string ret = "";
			foreach (Word s in List)
			{
				ret = ret + s.Tiles + Seperator;
			}
			ret = ret.TrimEnd(Seperator);
			return ret;
		}

		List<Word> GetWordsOnBoard(string[] Cells, int size, bool includeDuplicates)
		{
			List<Word> Words = new List<Word>();
			for (var i = 0; i < size; i++)
			{
				var R = GetWords(Cells, "R", i, size, includeDuplicates);
				var C = GetWords(Cells, "C", i, size, includeDuplicates);
				Words.AddRange(R);
				Words.AddRange(C);
			}
			return Words;
		}

		List<Word> GetWords(string[] Cells, string option, int r, int size, bool includeDuplicates)
		{
			List<Word> Words = new List<Word>();
			var pending = "";
			var cnt = 0;
			for (var i = 0; i < size; i++)
			{
				var index = -1;
				switch (option)
				{
					case "R":
						index = BoardUtil.Abs(r, i, size);
						break;
					case "C":
						index = BoardUtil.Abs(i, r, size);
						break;
				}
				var cell = Cells[index];
				if (cell != "")
				{
					pending += "(" + cell + ")|";
					cnt++;
					continue;
				}
				if (pending != "" && cell == "")
				{
					if (cnt > 1)
					{
						var word = pending.TrimEnd('|');
						if (includeDuplicates)
						{
							int startIndex = GetStartIndex(option, r, i, size, cnt);
							Words.Add(new Word { Tiles = word, Syllables = cnt, Position = option, Index = startIndex });
						}
						else
						{
							Word X = Words.Find(x => x.Tiles == word);
							if (X == null)
							{
								int startIndex = GetStartIndex(option, r, i, size, cnt);
								Words.Add(new Word { Tiles = word, Syllables = cnt, Position = option, Index = startIndex });
							}
						}
					}
					pending = "";
					cnt = 0;
					continue;
				}
			}
			if (cnt > 1)
			{
				var word = pending.TrimEnd('|');
				if (includeDuplicates)
				{
					int startIndex = GetStartIndex(option, r, size, size, cnt);
					Words.Add(new Word { Tiles = word, Syllables = cnt, Position = option, Index = startIndex });
				}
				else
				{
					Word X = Words.Find(x => x.Tiles == word);
					if (X == null)
					{
						int startIndex = GetStartIndex(option, r, size, size, cnt);
						Words.Add(new Word { Tiles = word, Syllables = cnt, Position = option, Index = startIndex });
					}
				}
			}
			return Words;
		}

		List<string> GetSyllableList(string[] Cells, int size, bool filterEdges, bool asGroups)
		{
			List<string> List = new List<string>();
			for (int index = 0; index < Cells.Length; index++)
			{
				string cell = Cells[index];
				if (cell == "")
				{
					continue;
				}
				Neighbor Neighbor = BoardUtil.FindNeighbors(index, size);

				string r = Neighbor.Right != -1 ? Cells[Neighbor.Right] : "";
				string l = Neighbor.Left != -1 ? Cells[Neighbor.Left] : "";
				string t = Neighbor.Top != -1 ? Cells[Neighbor.Top] : "";
				string b = Neighbor.Bottom != -1 ? Cells[Neighbor.Bottom] : "";

				if (filterEdges)
				{
					if ((r != "" || l != "") && (t != "" || b != ""))
					{

					}
					else
					{
						string x = asGroups ? cell : "(" + cell + ")";
						if (!List.Contains(x))
						{
							List.Add(x);
						}
					}
				}
				else
				{
					string x = asGroups ? cell : "(" + cell + ")";
					if (!List.Contains(x))
					{
						List.Add(x);
					}
				}
			}
			return List;
		}

		List<Word> GetSyllableList2(string[] Cells, int size, bool filter, bool free)
		{
			List<Word> List = new List<Word>();
			for (int index = 0; index < Cells.Length; index++)
			{
				string cell = Cells[index];
				if (cell == "")
				{
					continue;
				}
				var Neighbor = BoardUtil.FindNeighbors(index, size);

				string r = Neighbor.Right != -1 ? Cells[Neighbor.Right] : "";
				string l = Neighbor.Left != -1 ? Cells[Neighbor.Left] : "";
				string t = Neighbor.Top != -1 ? Cells[Neighbor.Top] : "";
				string b = Neighbor.Bottom != -1 ? Cells[Neighbor.Bottom] : "";

				if (filter)
				{
					if ((r != "" || l != "") && (t != "" || b != ""))
					{

					}
					else
					{
						string x = free ? cell : "(" + cell + ")";

						List.Add(new Word { Tiles = x, Index = index });

					}
				}
				else
				{
					string x = free ? cell : "(" + cell + ")";
					List.Add(new Word { Tiles = x, Index = index });
				}
			}
			return List;
		}
		Dictionary<string, int> GetCountDict(string input)
		{
			Dictionary<string, int> Dict = new Dictionary<string, int>();

			foreach (string s in input.Split(','))
			{
				foreach (char c in s)
				{
					if (Dict.ContainsKey(c.ToString()))
					{
						Dict[c.ToString()]++;
					}
					else
					{
						Dict[c.ToString()] = 1;
					}
				}
			}
			return Dict;
		}

		Dictionary<string, int> GetCountDict(string[] inputs)
		{
			if (inputs == null)
			{
				return null;
			}
			Dictionary<string, int> Dict = new Dictionary<string, int>();
			foreach (string input in inputs)
			{
				if (string.IsNullOrEmpty(input))
				{
					continue;
				}
				if (Dict.ContainsKey(input))
				{
					Dict[input]++;
				}
				else
				{
					Dict[input] = 1;
				}
			}
			return Dict;
		}

		bool Validate(Dictionary<string, int> InputDict, Dictionary<string, int> CharCount)
		{
			if (InputDict == null)
			{
				return true;
			}
			bool isValid = true;
			foreach (var item in CharCount)
			{
				if (!InputDict.ContainsKey(item.Key))
				{
					isValid = false;
					break;
				}
				if (InputDict[item.Key] < item.Value)
				{
					isValid = false;
					break;
				}
			}
			return isValid;
		}

		string Distinct(string Set, char Seperator)
		{
			List<string> List = new List<string>();

			foreach (string s in Set.Split(Seperator))
			{
				if (!List.Contains(s))
				{
					List.Add(s);
				}
			}

			return GetFlatList(List, Seperator);

		}

		int GetStartIndex(string option, int r, int pos, int size, int move)
		{
			switch (option)
			{
				case "R":
					return BoardUtil.Abs(r, pos - move, size);

				case "C":
					return BoardUtil.Abs(pos - move, r, size);

			}
			return -1;
		}

		List<Word> MatchedWords2(List<Word> words, string Pattern)
		{
			Regex r = new Regex(Pattern, RegexOptions.IgnoreCase);
			List<Word> List = words.FindAll(delegate (Word s) { return r.IsMatch(s.Tiles); });
			return List;
		}
	}
}
