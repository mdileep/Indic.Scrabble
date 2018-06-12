//---------------------------------------------------------------------------------------------
// <copyright file="ABPAgent.cs" company="Chandam-ఛందం">
//    Copyright © 2013 - 2018 'Chandam-ఛందం' : http://chandam.apphb.com
//    Original Author : Dileep Miriyala (m.dileep@gmail.com)
//    Last Updated    : 11-Jun-2018 21:12EST
//    Revisions:
//       Version    | Author                   | Email                     | Remarks
//       1.0        | Dileep Miriyala          | m.dileep@gmail.com        | Initial Commit
//       _._        | <TODO>                   |   <TODO>                  | <TODO>
// </copyright>
//---------------------------------------------------------------------------------------------

using Scrabble.Engines;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Scrabble.Server.Game.Engines
{
	/// <summary>
	/// It's an AI Agent Works based on Alpha-Beta Pruning.
	/// </summary>
	class ABPAgent
	{
		const int Top = 3;
		public void BestMove(ScrabbleGame game)
		{
			var moves = Probables(game);
			ProbableMove move = MiniMaxRoot(2, game, true);
		}

		List<ProbableMove> Probables(ScrabbleGame game)
		{
			var R = new RegexV2Engine(game.Board);
			var x = R.Probables();
			return x.Take(Top).ToList<ProbableMove>();
		}

		public ProbableMove MiniMaxRoot(int depth, ScrabbleGame game, bool isMaximisingPlayer)
		{
			var _game = game.Clone();
			var bestScore = -9999;
			ProbableMove bestMove = null;

			var moves = Probables(_game);
			for (var i = 0; i < moves.Count; i++)
			{
				var move = moves[i];

				Apply(_game, move, isMaximisingPlayer);

				var score = MiniMax(depth - 1, _game, -10000, 10000, !isMaximisingPlayer);
				_game = game.Clone();

				if (score >= bestScore)
				{
					bestScore = score;
					bestMove = move;
				}
			}

			return bestMove;
		}
		int MiniMax(int depth, ScrabbleGame game, int alpha, int beta, bool isMaximisingPlayer)
		{
			if (depth == 0)
			{
				return game.Scores.Diff;
			}

			var _game = game.Clone();
			var moves = Probables(_game);
			if (isMaximisingPlayer)
			{
				var bestScore = -9999;
				for (var i = 0; i < moves.Count; i++)
				{
					var move = moves[i];

					Apply(_game, move, isMaximisingPlayer);
					bestScore = Math.Max(bestScore, MiniMax(depth - 1, _game, alpha, beta, !isMaximisingPlayer));
					_game = game.Clone();

					alpha = Math.Max(alpha, bestScore);
					if (beta <= alpha)
					{
						return bestScore;
					}
				}
				return bestScore;
			}
			else
			{
				var bestScore = 9999;
				for (var i = 0; i < moves.Count; i++)
				{
					var move = moves[i];
					Apply(_game, move, isMaximisingPlayer);
					bestScore = Math.Min(bestScore, MiniMax(depth - 1, _game, alpha, beta, !isMaximisingPlayer));
					_game = game.Clone();
					beta = Math.Min(beta, bestScore);
					if (beta <= alpha)
					{
						return bestScore;
					}
				}
				return bestScore;
			}
		}
		public void Apply(ScrabbleGame game, ProbableMove PM, bool mePlaying)
		{
			var Board = game.Board;

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
			var Scores = game.Scores;
			if (mePlaying)
			{
				Scores.MyScore = Scores.MyScore + PM.Score;
			}
			else
			{
				Scores.OppScore = Scores.OppScore + PM.Score;
			}
		}
		string PlaceTiles(string current, string tiles)
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
		string Join(List<string> Special)
		{
			string s = "";
			foreach (string _s in Special)
			{
				s = s + " (" + string.Join(",", _s.Replace("(", "").Replace(")", "").ToCharArray()) + ")";
			}
			return s.TrimEnd(' ').TrimStart(' ');
		}
	}
}
