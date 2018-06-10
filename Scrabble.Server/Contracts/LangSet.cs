//---------------------------------------------------------------------------------------------
// <copyright file="LangSet.cs" company="Chandam-ఛందం">
//    Copyright © 2013 - 2018 'Chandam-ఛందం' : http://chandam.apphb.com
//    Original Author : Dileep Miriyala (m.dileep@gmail.com)
//    Last Updated    : 21-Mar-2018 23:35EST
//    Revisions:
//       Version    | Author                   | Email                     | Remarks
//       1.0        | Dileep Miriyala          | m.dileep@gmail.com        | Initial Commit
//       _._        | <TODO>                   |   <TODO>                  | <TODO>
// </copyright>
//---------------------------------------------------------------------------------------------

using System.Collections.Generic;

namespace Shared
{
	public class CharSet
	{
		public string Name = "";
		public string Language = "";
		public string Dictionary = "";
		public string[] SunnaSet = new string[] { };
		public string[] Vowels = new string[] { };
		public string[] Consonents = new string[] { };
		public string Virama = "";
		//
		public string[] FullSpecialSet = new string[] { };
		public string[] SpecialSet = new string[] { };
		public Dictionary<string, string> Synonyms = new Dictionary<string, string>();
		public Dictionary<string, string> Synonyms2 = new Dictionary<string, string>();
		//
		public Dictionary<string, string[]> SyllableTiles = new Dictionary<string, string[]>();
		public Dictionary<string, string[]> SyllableChars = new Dictionary<string, string[]>();
		public Dictionary<string, string> SyllableSynonym = new Dictionary<string, string>();
		//
		internal const char ZWNJ = (char)0x200C;
	}
	public class Bot
	{
		public string Id;
		public string Name;
		public string FullName;
		public string Language;
		public string Dictionary;
		public string Algorithm;
		public string Endpoint;
	}
	public class Player
	{
		public string Name;
		public Bot Bot;
	}
	public class KnownBoard
	{
		public string Name;
		public string Language;
		public int Size;
		public int[] Weights;
		public int Star;
		public GameTable GameTable;
		public GameTray[] Trays;
	}
	public class GameTray
	{
		public string Id;
		public string Title;
		public bool Show;
		public Dictionary<string, WC>[] Set;
	}
	public class WC
	{
		public int W;
		public int C;
	}
	public class GameTable
	{
		public int MaxOnTable;
		public int MaxVowels;
	}
}
