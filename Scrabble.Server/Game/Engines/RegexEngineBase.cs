//---------------------------------------------------------------------------------------------
// <copyright file="RegexEngineBase.cs" company="Chandam-ఛందం">
//    Copyright © 2013 - 2018 'Chandam-ఛందం' : http://chandam.apphb.com
//    Original Author : Dileep Miriyala (m.dileep@gmail.com)
//    Last Updated    : 31-May-2018 19:23EST
//    Revisions:
//       Version    | Author                   | Email                     | Remarks
//       1.0        | Dileep Miriyala          | m.dileep@gmail.com        | Initial Commit
//       _._        | <TODO>                   |   <TODO>                  | <TODO>
// </copyright>
//---------------------------------------------------------------------------------------------

using Shared;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text.RegularExpressions;

namespace Scrabble.Engines
{
	abstract class EngineBase : iGameEngine
	{
		public abstract ProbableMove BestMove();
		public abstract List<ProbableMove> Probables();

		protected static ProbableMove TryHarizontal(int Mode, string[] Cells, int size, int Index, int offset, string[] Pre, string[] Centers, string[] Post)
		{
			List<Word> Moves = new List<Word>();
			int PreCount = Pre.Length;
			int PostCount = Post.Length;

			string[] NewCells = (string[])Cells.Clone();
			List<int> Impacted = new List<int>();

			if (Pre.Length != 0)
			{
				for (int x = Pre.Length - 1; x >= 0; x--)
				{
					Neighbor n = BoardUtil.FindNeighbors(Index - x, size);
					if (n.Left != -1)
					{
						NewCells[n.Left] += Pre[x];
						Impacted.Add(n.Left);
						if (Pre[x] == null)
						{
							continue;
						}
						Moves.Add(new Word { Tiles = Pre[x], Index = n.Left });
					}
					else
					{
						return new ProbableMove { Words = new List<ProbableWord>(), Direction = "H", Moves = new List<Word>() };
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

					NewCells[cellIndex] += Centers[c];
					Impacted.Add(cellIndex);
					if (Centers[c] == null)
					{
						continue;
					}
					Moves.Add(new Word { Tiles = Centers[c], Index = cellIndex });
				}
			}

			if (Post.Length != 0)
			{
				for (int x = 0; x < Post.Length; x++)
				{
					Neighbor n = BoardUtil.FindNeighbors(Index + offset + x, size);
					if (n.Right != -1)
					{
						NewCells[n.Right] += Post[x];
						Impacted.Add(n.Right);
						if (Post[x] == null)
						{
							continue;
						}
						Moves.Add(new Word { Tiles = Post[x], Index = n.Right });
					}
					else
					{
						return new ProbableMove { Words = new List<ProbableWord>(), Direction = "H", Moves = new List<Word>() };
					}
				}
			}

			List<ProbableWord> W = new List<ProbableWord>();
			foreach (int index in Impacted)
			{
				W.AddRange(WordsAt(NewCells, size, index));
			}
			return new ProbableMove { Mode = Mode, Words = W, Moves = Moves, Direction = "H" };
		}
		protected static ProbableMove TryVertical(int Mode, string[] Cells, int size, int Index, int offset, string[] Pre, string[] Centers, string[] Post)
		{
			List<Word> Moves = new List<Word>();
			int PreCount = Pre.Length;
			int PostCount = Post.Length;

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
						NewCells[n.Top] += Pre[x];
						Impacted.Add(n.Top);
						if (Pre[x] == null)
						{
							continue;
						}
						Moves.Add(new Word { Tiles = Pre[x], Index = n.Top });
					}
					else
					{
						return new ProbableMove { Words = new List<ProbableWord>(), Direction = "V", Moves = new List<Word>() };
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

					NewCells[cellIndex] += Centers[c];
					Impacted.Add(cellIndex);
					if (Centers[c] == null)
					{
						continue;
					}
					Moves.Add(new Word { Tiles = Centers[c], Index = cellIndex });
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
						//string temp = Join(Post[x], Seperator);
						NewCells[n.Bottom] += Post[x];
						Impacted.Add(n.Bottom);
						if (Post[x] == null)
						{
							continue;
						}
						Moves.Add(new Word { Tiles = Post[x], Index = n.Bottom });
					}
					else
					{
						return new ProbableMove { Words = new List<ProbableWord>(), Direction = "V", Moves = new List<Word>() };
					}
				}
			}

			List<ProbableWord> W = new List<ProbableWord>();
			foreach (int index in Impacted)
			{
				W.AddRange(WordsAt(NewCells, size, index));
			}
			return new ProbableMove { Mode = Mode, Words = W, Moves = Moves, Direction = "V" };
		}

		static List<ProbableWord> WordsAt(string[] Cells, int size, int index)
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
		static ProbableWord MakeAWord(List<Word> F1, Word C, List<Word> F2)
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

		protected void RefreshScores(List<ProbableMove> Moves, int[] Weights, int size)
		{
			//using (new Watcher("\tRefresh Scores"))
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
		}
	}
	abstract class RegexEngineBase : EngineBase
	{
		public override ProbableMove BestMove()
		{
			var Moves = Probables();
			if (Moves.Count == 0)
			{
				return null;
			}
			return Moves[0];
		}

		protected static bool Resolve(string prev, List<string> Tiles, Dictionary<string, Regex> SpeicalList, ref string ordered)
		{
			if (string.IsNullOrEmpty(prev))
			{
				return true;
			}
			if (prev.Length == 1)
			{
				if (Tiles.Contains(prev))
				{
					Tiles.Remove(prev);
					return true;
				}
				else
				{
					return false; //Can't be Reoslved for Sure.
				}
			}
			else
			{
				if (SpeicalList.ContainsKey(prev))
				{
					if (Tiles.Contains(prev))
					{
						Tiles.Remove(prev);
						return true;
					}
					//More checks needed
				}

				#region Is a Set of Specials
				foreach (var special in SpeicalList)
				{
					Match M = special.Value.Match(prev);
					if (!M.Success)
					{
						continue;
					}
					if (Tiles.Contains(special.Key))
					{
						Tiles.Remove(special.Key);
					}
					else
					{
						continue;
					}

					List<string> order = new List<string>();
					string Pre = M.Groups["Pre"].Value;
					string Center = M.Groups["Center"].Value;
					string Post = M.Groups["Post"].Value;

					if (!string.IsNullOrEmpty(Pre))
					{
						string temp = "";
						bool resolved = Resolve(Pre, Tiles, SpeicalList, ref temp);
						if (!resolved)
						{
							return false;
						}
						order.Add(string.IsNullOrEmpty(temp) ? Pre : temp);
					}

					order.Add(special.Key);

					if (!string.IsNullOrEmpty(Center))
					{
						string temp = "";
						bool resolved = Resolve(Center, Tiles, SpeicalList, ref temp);
						if (!resolved)
						{
							return false;
						}
						order.Add(string.IsNullOrEmpty(temp) ? Center : temp);
					}

					if (!string.IsNullOrEmpty(Post))
					{
						string temp = "";
						bool resolved = Resolve(Post, Tiles, SpeicalList, ref temp);
						if (!resolved)
						{
							return false;
						}
						order.Add(string.IsNullOrEmpty(temp) ? Post : temp);
					}

					ordered = string.Join(",", order);
					return true;
				}

				#endregion

				//Now Every Char must be resovled.
				{
					List<string> order = new List<string>();
					foreach (char c in prev)
					{
						if (Tiles.Contains(c.ToString()))
						{
							Tiles.Remove(c.ToString());
							order.Add(c.ToString());
						}
						else
						{
							return false; //Can't be Reoslved for Sure.
						}
					}
					ordered = string.Join(",", order);
					return true;
				}
			}
		}
		protected static bool Resolve(string[] Pres, string[] Centers, string[] Posts, List<string> Tiles, Dictionary<string, Regex> SpeicalDict)
		{
			bool res = true;
			for (int i = 0; i < Pres.Length; i++)
			{
				string tile = Pres[i]; string temp = "";
				res = Resolve(tile, Tiles, SpeicalDict, ref temp);
				if (!res)
				{
					return false;
				}
				if (!string.IsNullOrEmpty(temp))
				{
					Pres[i] = temp;
				}
			}
			for (int i = 0; i < Centers.Length; i++)
			{
				string tile = Centers[i]; string temp = "";
				res = Resolve(tile, Tiles, SpeicalDict, ref temp);
				if (!res)
				{
					return false;
				}
				if (!string.IsNullOrEmpty(temp))
				{
					Centers[i] = temp;
				}
			}
			for (int i = 0; i < Posts.Length; i++)
			{
				string tile = Posts[i]; string temp = "";
				res = Resolve(tile, Tiles, SpeicalDict, ref temp);
				if (!res)
				{
					return false;
				}
				if (!string.IsNullOrEmpty(temp))
				{
					Posts[i] = temp;
				}
			}
			return true;
		}

		protected List<Word> MatchedWords(List<Word> words, string Pattern)
		{
			using (new Watcher("\t\tMatch Words "))
			{

				Regex r = new Regex(Pattern, RegexOptions.IgnoreCase | RegexOptions.Compiled);
				List<Word> List = words.FindAll(delegate (Word s) { return r.IsMatch(s.Tiles); });

				Printer.PrintLine("\t\t\t" + List.Count + " of " + words.Count + " found: " + Pattern);
				return List;
			}
		}
		protected static string MatchedString(Group group, string seperator)
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

		protected static List<Word> GetWordsOnBoard(string[] Cells, int size, bool includeDuplicates)
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
		static List<Word> GetWords(string[] Cells, string option, int r, int size, bool includeDuplicates)
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

		static int GetStartIndex(string option, int r, int pos, int size, int move)
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

		protected static List<Word> GetSyllableList2(string[] Cells, int size, bool filter, bool free)
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
		protected List<string> GetSyllableList(string[] Cells, int size, bool fetchAll, bool filterEdges, bool asGroups)
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

				if (!fetchAll)
				{
					if ((r != "" || l != "") && (t != "" || b != ""))
					{
						if (!filterEdges)
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
						if (filterEdges)
						{
							string x = asGroups ? cell : "(" + cell + ")";
							if (!List.Contains(x))
							{
								List.Add(x);
							}
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
		static string GetSpecialSyllablePattern2(CharSet CharSet, string specialOptions)
		{
			if (string.IsNullOrEmpty(specialOptions))
			{
				return "";
			}

			string ret = "";
			{
				string temp = "";

				List<string> Consos = new List<string>();
				List<string> Vowels = new List<string>();
				Classify2(CharSet, specialOptions, Consos, Vowels);

				if (Vowels.Count > 0 && Consos.Count > 0)
				{
					//Both Exists
					//(మ[ConsoOptions]ఉ)
					foreach (var a in Consos)
					{
						temp = temp + a;
					}
					temp = temp + "(?<Center>.*?)";
					foreach (var a in Vowels)
					{
						temp = temp + a;
					}
					temp = "(?<Pre>.*?)" + temp + "(?<Post>.*?)";
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
					temp = "(?<Pre>.*?)" + temp + "(?<Post>.*?)";
				}
				ret = "^" + temp + "$";
			}
			return ret;
		}
		static string GetSyllablePattern(CharSet CharSet, string syllable, string consoPatternNoComma, string sunnaPattern, string allPatternNoComma)
		{
			string temp = "";
			List<string> Consos = new List<string>();
			List<string> Vowels = new List<string>();
			Classify(CharSet, syllable, Consos, Vowels);

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
		protected static string GetSyllablePattern2(CharSet CharSet, string syllable, string consoPatternNoComma, string prePattern, string PostPattern)
		{
			string temp = "";
			List<string> Consos = new List<string>();
			List<string> Vowels = new List<string>();
			Classify(CharSet, syllable, Consos, Vowels);
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

		static string Join(string str, char join)
		{
			string ret = "";
			foreach (char ch in str)
			{
				ret = ret + ch + join;
			}
			ret = ret.TrimEnd(join);
			return ret;
		}
		protected string GetFlatList2(string[] inputs)
		{
			var list = inputs.ToList(); list.Sort();

			List<string> X = new List<string>();
			foreach (string input in list)
			{
				if (!X.Contains(input))
				{
					X.Add(input);
				}
			}

			return GetFlatList(X, ' ').Replace(" ", "");
		}
		protected string GetFlatList(List<string> List, char Seperator)
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
		protected List<string> DistinctList(string Set, char Seperator)
		{
			List<string> List = new List<string>();

			foreach (string s in Set.Split(Seperator))
			{
				if (string.IsNullOrEmpty(s))
				{
					continue;
				}
				if (!List.Contains(s))
				{
					List.Add(s);
				}
			}
			return List;
		}

		protected Dictionary<string, int> GetCountDict(string input)
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
		protected Dictionary<string, int> GetCountDict(string[] inputs)
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

		static void Classify2(CharSet CharSet, string syllable, List<string> Consos, List<string> Vowels)
		{
			List<string> Sunna = new List<string>();
			foreach (char ch in syllable)
			{
				string c = ch.ToString();
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
		static void Classify(CharSet CharSet, string syllable, List<string> Consos, List<string> Vowels)
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

		protected static string GenWordPattern(CharSet CharSet, string word, string consoPatternNoComma, string sunnaPattern, string allPatternNoComma, string prePattern, string postPattern, bool useSyllableIndex)
		{
			string temp = "";
			var arr = word.Split('|');
			for (int i = 0; i < arr.Length; i++)
			{
				string syllable = arr[i];

				string pattern = "";
				if (useSyllableIndex)
				{
					pattern = GetSyllablePattern(CharSet,
							syllable.Replace("(", "").Replace(")", ""),
							string.Format(consoPatternNoComma, i + 1),
							string.Format(sunnaPattern, i + 1),
							i == arr.Length - 1 ? "" : string.Format(allPatternNoComma, i + 1));
				}
				else
				{
					pattern = GetSyllablePattern(CharSet,
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
		protected Dictionary<string, Regex> GetSpecialDict(List<string> SpecialList)
		{
			Dictionary<string, Regex> SpeicalDict = new Dictionary<string, Regex>();
			foreach (string sp in SpecialList)
			{
				string pattern = GetSpecialSyllablePattern2(CharSet, sp);
				SpeicalDict.Add(sp, new Regex(pattern, RegexOptions.Compiled));
			}
			return SpeicalDict;
		}

		protected static bool Validate(ProbableMove Move, List<Word> AllWords)
		{
			Move.Words = Move.Words.Distinct(new ProbableWordComparer()).ToList();
			if (Move.Words.Count == 0 || Move.Moves.Count == 0)
			{
				return false;
			}
			return Validate(Move.Words, AllWords);
		}
		protected static bool Validate(List<ProbableWord> WV, List<Word> AllWords)
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
		protected bool Validate(Dictionary<string, int> InputDict, Dictionary<string, int> CharCount)
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

		protected List<Word> ShortList(List<Word> Words, string NonCornerPattern, Dictionary<string, int> Dict)
		{
			if (string.IsNullOrEmpty(NonCornerPattern))
			{
				return new List<Word>();
			}

			using (new Watcher("\tShortList "))
			{
				List<Word> Matches = MatchedWords(Words, NonCornerPattern);
				List<Word> Shortlisted = new List<Word>();

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

						Shortlisted.Add(word);
					}
					Printer.PrintLine("\t\t\t Shortlisted: " + Shortlisted.Count + "  of " + Matches.Count);
				}
				return Shortlisted;
			}
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

		protected CharSet CharSet;
	}
}
