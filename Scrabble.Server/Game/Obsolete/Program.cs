using Scrabble;
using Scrabble.Server;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Temp2
{
	class Program
	{
		static void Main(string[] args)
		{
			Run();
		}

		public static void Run()
		{
			ScrabbleBoard Board = new ScrabbleBoard
			{

				Reference = "123",
				Name = "te.11x11",
				Bot = "bbc.te",
				Cells = new string[]
				{
					"వ", "స,ఈ", "", "", "", "", "", "", "", "", "",
					"", "జ,ఏ", "", "", "", "", "", "", "", "", "",
					"", "క,ఉ", "ల,ఆ", "ల,ఉ", "", "", "", "", "", "", "",
					"", "", "", "", "", "", "", "", "", "", "",
					"", "", "", "", "", "", "", "", "", "", "",
					"", "", "", "", "", "", "", "", "", "", "",
					"", "", "", "", "", "", "", "", "", "", "",
					"", "", "", "", "", "", "", "", "", "", "",
					"", "", "", "", "", "", "", "", "", "", "",
					"", "", "", "", "", "", "", "", "", "", "",
					"", "", "", "", "", "", "", "", "", "", "",
				},
				//Vowels = "అ ఆ ఈ ఉ ఉ ఎ ఏ ఓ",
				//Conso = "క ఙ చ జ ప ల స వ",
				//Vowels = "అ ఆ ఉ ఎ ఓ",
				//Conso = "ఙ చ ప ల స వ",
				Vowels = "అ ఉ ఎ ఓ",
				Conso = "ఙ చ ప స వ",
				Special = "(క,ష)"
				//Special = "(ల,ఉ) (క,ష)"
			};

			Scores Scores = new Scores
			{
				MyScore = 12,
				OppScore = 7
			};
			Game game = new Game
			{
				Board = Board,
				Scores = Scores
			};
			new ABP().Run(game);
		}
	}

	class ABP
	{
		List<ProbableMove> Probables(Game game)
		{
			var M = new NextMoveAction();
			var R = new Runner2(game.Board);
			var x = R.Probables();
			return x.Take(3).ToList<ProbableMove>();
			//return x;
		}

		public void Run(Game game)
		{
			var moves = Probables(game);
			ProbableMove move = MiniMaxRoot(2, game, true);
		}

		public ProbableMove MiniMaxRoot(int depth, Game game, bool isMaximisingPlayer)
		{

			var _game = game.Clone();
			var bestScore = -9999;
			ProbableMove bestMove = null;


			var moves = Probables(_game);
			for (var i = 0; i < moves.Count; i++)
			{
				var move = moves[i];

				_game.Apply(move, isMaximisingPlayer);

				//Debug.WriteLine(depth + " " + i + " " + _game.Scores.MyScore + " " + _game.Scores.OppScore + " " + isMaximisingPlayer);

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

		int MiniMax(int depth, Game game, int alpha, int beta, bool isMaximisingPlayer)
		{
			if (depth == 0)
			{
				Debug.WriteLine(game.Scores.Diff + " : " + game.Scores.MyScore + " " + game.Scores.OppScore);
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

					_game.Apply(move, isMaximisingPlayer);
					//Debug.WriteLine(depth + " " + i + " " + _game.Scores.MyScore + " " + _game.Scores.OppScore + " " + alpha + " " + beta + " " + isMaximisingPlayer);
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

					_game.Apply(move, isMaximisingPlayer);
					//Debug.WriteLine(depth + " " + i + " " + _game.Scores.MyScore + " " + _game.Scores.OppScore + " " + alpha + " " + beta + " " + isMaximisingPlayer);
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

	}

}
