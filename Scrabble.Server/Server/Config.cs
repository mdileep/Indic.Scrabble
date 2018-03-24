//---------------------------------------------------------------------------------------------
// <copyright file="Config.cs" company="Chandam-ఛందం">
//    Copyright © 2013 - 2018 'Chandam-ఛందం' : http://chandam.apphb.com
//    Original Author : Dileep Miriyala (m.dileep@gmail.com)
//    Last Updated    : 21-Mar-2018 23:34EST
//    Revisions:
//       Version    | Author                   | Email                     | Remarks
//       1.0        | Dileep Miriyala          | m.dileep@gmail.com        | Initial Commit
//       _._        | <TODO>                   |   <TODO>                  | <TODO>
// </copyright>
//---------------------------------------------------------------------------------------------


using Shared;
using System.Collections.Generic;

namespace Scrabble.Server
{
	class Config
	{
		//Not yet Enabled: "bn", "pa", "gu", "or", "ta", "ml" 
		public const string DefaultLang = "te";
		public static readonly List<string> Languages = new List<string> { "te", "hi", "kn" };
		public static readonly List<string> Actions = new List<string> { ActionNames.Ping, ActionNames.Help, ActionNames.NextMove, ActionNames.Probables, ActionNames.Validate };

		static Dictionary<string, object> Dictionary = null;
		static Dictionary<string, CharSet> CharSets = null;
		static Dictionary<string, Bot> Bots = null;
		static Dictionary<string, KnownBoard> Boards = null;

		static Config()
		{
			Load();
		}

		private static void Load()
		{
			if (Dictionary != null && CharSets != null)
			{
				return;
			}
			Dictionary = CacheManager.GetApppObject<Dictionary<string, object>>("Localize", BuildResources);
			CharSets = CacheManager.GetApppObject<Dictionary<string, CharSet>>("CharSets", BuildCharSets);
			Bots = CacheManager.GetApppObject<Dictionary<string, Bot>>("Bots", BuildBots);
			Boards = CacheManager.GetApppObject<Dictionary<string, KnownBoard>>("Boards", BuildBoards);
		}

		static Dictionary<string, KnownBoard> BuildBoards()
		{
			string resouceName = string.Format("Scrabble.Server.Resources.Boards.json");
			var content = ServerUtil.ReadResource(resouceName);
			var dict = ParseUtil.ParseJSON<Dictionary<string, object>>(content);
			var Sets = new Dictionary<string, KnownBoard>();
			foreach (var KVP in dict)
			{
				Sets[KVP.Key] = ParseUtil.ConvertTo<KnownBoard>(KVP.Value);
			}
			return Sets;
		}


		static Dictionary<string, Bot> BuildBots()
		{
			string resouceName = string.Format("Scrabble.Server.Resources.Bots.json");
			var content = ServerUtil.ReadResource(resouceName);
			var dict = ParseUtil.ParseJSON<Dictionary<string, object>>(content);
			var Sets = new Dictionary<string, Bot>();
			foreach (var KVP in dict)
			{
				Sets[KVP.Key] = ParseUtil.ConvertTo<Bot>(KVP.Value);
			}
			return Sets;
		}

		static Dictionary<string, CharSet> BuildCharSets()
		{
			string resouceName = string.Format("Scrabble.Server.Resources.CharSets.json");
			var content = ServerUtil.ReadResource(resouceName);
			var dict = ParseUtil.ParseJSON<Dictionary<string, object>>(content);
			var Sets = new Dictionary<string, CharSet>();
			foreach (string lang in Languages)
			{
				if (!dict.ContainsKey(lang))
				{
					//Ideally shouldn't reach here..
					Sets[lang] = new CharSet();
					continue;
				}
				var Set = dict[lang];
				Sets[lang] = ParseUtil.ConvertTo<CharSet>(Set);
			}
			return Sets;
		}

		static Dictionary<string, object> BuildResources()
		{
			var Resources = new Dictionary<string, object>();
			foreach (string lang in Languages)
			{
				string resouceName = string.Format("Scrabble.Server.Resources.{0}.json", lang);
				var content = ServerUtil.ReadResource(resouceName);
				var dict = ParseUtil.ParseJSON<Dictionary<string, object>>(content);
				foreach (var item in dict)
				{
					Resources[lang + ":" + item.Key] = item.Value;
				}
			}
			return Resources;
		}

		internal static string Lang(string lang, string key)
		{
			if (!Dictionary.ContainsKey(lang + ":" + key))
			{
				return null;
			}
			return Dictionary[lang + ":" + key].ToString();
		}

		internal static object ResourceKey(string lang, string key)
		{
			if (!Dictionary.ContainsKey(lang + ":" + key))
			{
				return null;
			}
			return Dictionary[lang + ":" + key];
		}

		internal static CharSet GetCharSet(string lang)
		{
			if (!CharSets.ContainsKey(lang))
			{
				return null;
			}
			return CharSets[lang];
		}

		internal static Bot GetBot(string bot)
		{
			if (!Bots.ContainsKey(bot))
			{
				return null;
			}
			return Bots[bot];
		}

		internal static KnownBoard GetBoard(string name)
		{
			if (!Boards.ContainsKey(name))
			{
				return null;
			}
			return Boards[name];
		}
	}
}
