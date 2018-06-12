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


namespace Scrabble.Server
{
	public class ScrabbleGame
	{
		public ScrabbleBoard Board;
		public GameScores Scores;

		internal ScrabbleGame Clone()
		{
			ScrabbleGame G = new ScrabbleGame();
			G.Scores = this.Scores.Clone();
			G.Board = this.Board.Clone();
			return G;
		}
	}
	public class ScrabbleBoard
	{
		public string Name;
		public string Bot;
		public string Id;
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
	public class GameScores
	{
		public int MyScore = 0;
		public int OppScore = 0;
		public int Diff { get { return MyScore - OppScore; } }

		internal GameScores Clone()
		{
			return new GameScores { MyScore = this.MyScore, OppScore = this.OppScore };
		}
	}
}