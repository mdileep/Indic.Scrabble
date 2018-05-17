//---------------------------------------------------------------------------------------------
// <copyright file="ScrabbleBoard.cs" company="Chandam-ఛందం">
//    Copyright © 2013 - 2018 'Chandam-ఛందం' : http://chandam.apphb.com
//    Original Author : Dileep Miriyala (m.dileep@gmail.com)
//    Last Updated    : 22-Mar-2018 21:32EST
//    Revisions:
//       Version    | Author                   | Email                     | Remarks
//       1.0        | Dileep Miriyala          | m.dileep@gmail.com        | Initial Commit
//       _._        | <TODO>                   |   <TODO>                  | <TODO>
// </copyright>
//---------------------------------------------------------------------------------------------


using System;
using System.Collections.Generic;
namespace Scrabble.Server
{
	public class ScrabbleBoard
	{
		public string Name;
		public string Bot;
		//
		public string Reference;
		//Dynamic
		public string[] Cells;
		public string Vowels;
		public string Conso;
		public string Special;


		internal ScrabbleBoard Clone()
		{
			ScrabbleBoard S = new ScrabbleBoard();
			S.Name = this.Name;
			S.Reference = this.Reference;
			S.Bot = this.Bot;
			S.Cells = (string[])this.Cells.Clone();
			S.Vowels = this.Vowels;
			S.Conso = this.Conso;
			S.Special = this.Special;
			return S;
		}
	}
	public class Game
	{
		public ScrabbleBoard Board;
		public Scores Scores;

		public Game Clone()
		{
			Game G = new Game();

			G.Scores = this.Scores.Clone();
			G.Board = this.Board.Clone();
			return G;
		}

		public void Apply(ProbableMove PM, bool mePlaying)
		{
			var Vowels = new List<string>(Board.Vowels.Split(' '));
			var Conso = new List<string>(Board.Conso.Split(' '));
			var Special = new List<string>(Board.Special.Replace(",", "").Split(' '));
			foreach (var move in PM.Moves)
			{
				string current = Board.Cells[move.Index];
				string cell = PlaceTiles(current, move.Tiles);

				Board.Cells[move.Index] = cell;
				foreach (string tile in move.Tiles.Split(','))
				{
					Vowels.Remove(tile);
					Conso.Remove(tile);
					Special.Remove("(" + tile + ")");
				}
			}
			Board.Vowels = string.Join(" ", Vowels);
			Board.Conso = string.Join(" ", Conso);
			Board.Special = Join(Special);
			if (mePlaying)
			{
				Scores.MyScore = Scores.MyScore + PM.Score;
			}
			else
			{
				Scores.OppScore = Scores.OppScore + PM.Score;
			}
		}

		private string PlaceTiles(string current, string tiles)
		{
			string x = "";
			foreach (string tile in tiles.Split(','))
			{
				if (tile.Length == 1)
				{
					x = x + "," + tile;
				}
				else
				{
					x = x + ",(" + string.Join(",", tile.Replace("(", "").Replace(")", "").ToCharArray()) + ")";
				}
			}
			return x.TrimEnd(',').TrimStart(',');
		}

		private string Join(List<string> Special)
		{
			string s = "";
			foreach (string _s in Special)
			{
				s = s + " (" + string.Join(",", _s.Replace("(", "").Replace(")", "").ToCharArray()) + ")";
			}
			return s.TrimEnd(' ').TrimStart(' ');
		}
	}

	public class Scores
	{
		public int MyScore = 0;
		public int OppScore = 0;
		public int Diff { get { return MyScore - OppScore; } }

		internal Scores Clone()
		{
			return new Scores { MyScore = this.MyScore, OppScore = this.OppScore };
		}
	}
}