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
	public class ScrabbleBoard
	{
		public ScrabbleBoard()
		{

		}

		public string Reference;
		public string Language;
		//
		public string Bot;
		//
		public int Size;
		public string[] Cells;
		public int[] Weights;
		//Inputs
		public string Vowels;
		public string Conso;
		public string Special;
	}
}