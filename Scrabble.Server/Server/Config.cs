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
using System;

namespace Scrabble.Server
{
	public class Config
	{
		public const string DefaultLang = "te";
		public const string NeutralLang = "en";
		public const string DefaultBoard = "11x11";

		public static readonly List<string> Languages = new List<string> { "te", "kn", "hi" };
		public static readonly List<string> Actions = new List<string> { ActionNames.Ping, ActionNames.Help, ActionNames.NextMove, ActionNames.Probables, ActionNames.Validate };
		public static readonly List<string> BoardNames = new List<string> { "11x11" };

		static Dictionary<string, object> Dictionary = null;
		static Dictionary<string, CharSet> CharSets = null;
		static Dictionary<string, Bot> Bots = null;
		static Dictionary<string, KnownBoard> Boards = null;
		static Random Random = null;

		static Config()
		{
			Load();
		}

		static void Load()
		{
			if (Dictionary != null && CharSets != null)
			{
				return;
			}
			Dictionary = CacheManager.GetApppObject<Dictionary<string, object>>("Localization", BuildResources);
			CharSets = CacheManager.GetApppObject<Dictionary<string, CharSet>>("CharSets", BuildCharSets);
			Bots = CacheManager.GetApppObject<Dictionary<string, Bot>>("Bots", BuildBots);
			Boards = CacheManager.GetApppObject<Dictionary<string, KnownBoard>>("Boards", BuildBoards);
			Random = new Random(1000);
		}

		internal static Bot[] BotsByLang(string lang)
		{
			List<Bot> bots = new List<Shared.Bot>();
			foreach (var KV in Bots)
			{
				if (KV.Value.Language != lang)
				{
					continue;
				}
				bots.Add(KV.Value);
			}
			return bots.ToArray();
		}

		internal static int NewId()
		{
			return Random.Next();
		}

		static Dictionary<string, KnownBoard> BuildBoards()
		{
			string resouceName = ResourceName("Boards");
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
			string resouceName = ResourceName("Bots");
			var content = ServerUtil.ReadResource(resouceName);
			var dict = ParseUtil.ParseJSON<Dictionary<string, object>>(content);
			var Sets = new Dictionary<string, Bot>();
			foreach (var KVP in dict)
			{
				var bot = ParseUtil.ConvertTo<Bot>(KVP.Value);
				bot.Id = KVP.Key;
				Sets[KVP.Key] = bot;
			}
			return Sets;
		}

		static Dictionary<string, CharSet> BuildCharSets()
		{
			string resouceName = ResourceName("CharSets");
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
			string resouceName = ResourceName("Localization");
			var content = ServerUtil.ReadResource(resouceName);
			var dict = ParseUtil.ParseJSON<Dictionary<string, object>>(content);
			foreach (string lang in Languages)
			{
				SetResources(lang, dict, Resources);
			}
			SetResources(NeutralLang, dict, Resources);
			return Resources;
		}

		static void SetResources(string lang, Dictionary<string, object> dict, Dictionary<string, object> Resources)
		{
			var Messages = (Dictionary<string, object>)dict[lang];
			foreach (var messages in Messages)
			{
				Resources[lang + ":" + messages.Key] = messages.Value;
			}
		}

		internal static Dictionary<string, object> GetMessages(string lang)
		{
			var Resources = new Dictionary<string, object>();
			string resouceName = ResourceName("Localization");
			var content = ServerUtil.ReadResource(resouceName);
			var dict = ParseUtil.ParseJSON<Dictionary<string, object>>(content);
			var neutral = (Dictionary<string, object>)dict[NeutralLang];
			var localized = (Dictionary<string, object>)dict[lang];
			Merge(neutral, localized);
			return localized;
		}

		static void Merge(Dictionary<string, object> neutral, Dictionary<string, object> localized)
		{
			foreach (var KV in neutral)
			{
				if (localized.ContainsKey(KV.Key))
				{
					continue;
				}
				localized[KV.Key] = neutral[KV.Key];
			}
		}

		internal static Dictionary<string, string> Messages(string lang, string[] keys)
		{
			Dictionary<string, string> Dict = new Dictionary<string, string>();
			foreach (string key in keys)
			{
				Dict[key] = Lang(lang, key);
			}
			return Dict;
		}

		public static string Lang(string lang, string key)
		{
			if (!Dictionary.ContainsKey(lang + ":" + key))
			{
				if (lang == NeutralLang)
				{
					return null;
				}
				return Lang(NeutralLang, key);
			}
			return Dictionary[lang + ":" + key].ToString();
		}

		internal static object ResourceKey(string lang, string key)
		{
			if (!Dictionary.ContainsKey(lang + ":" + key))
			{
				if (lang == NeutralLang)
				{
					return null;
				}
				return ResourceKey(NeutralLang, key);
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

		internal static Bot GetBot(string bot, string Lang)
		{
			var Bot = GetBot(bot);
			if (Bot == null || Bot.Language != Lang)
			{
				return null;
			}
			return Bot;
		}

		internal static KnownBoard GetBoard(string name)
		{
			if (!Boards.ContainsKey(name))
			{
				return null;
			}
			return Boards[name];
		}

		static string ResourceName(string name)
		{
			return string.Format("Scrabble.Server.Resources.{0}.json", name);
		}
	}
}
