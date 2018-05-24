//---------------------------------------------------------------------------------------------
// <copyright file="ConfigHandler.cs" company="Chandam-ఛందం">
//    Copyright © 2013 - 2018 'Chandam-ఛందం' : http://chandam.apphb.com
//    Original Author : Dileep Miriyala (m.dileep@gmail.com)
//    Last Updated    : 25-Apr-2018 20:36EST
//    Revisions:
//       Version    | Author                   | Email                     | Remarks
//       1.0        | Dileep Miriyala          | m.dileep@gmail.com        | Initial Commit
//       _._        | <TODO>                   |   <TODO>                  | <TODO>
// </copyright>
//---------------------------------------------------------------------------------------------


using Shared;
using System.Collections.Generic;
using System.Web;
using System;

namespace Scrabble.Server
{
	public class ConfigHandler : IHttpHandler
	{
		public void ProcessRequest(HttpContext context)
		{
			Dictionary<string, object> response = BuildConfig(context.Request);
			context.Response.ContentType = "application/json";
			ScriptManager SC = new ScriptManager();
			SC.SetScriptVar("Config", response);
			context.Response.Write(SC.Go(false));
		}

		Dictionary<string, object> BuildConfig(HttpRequest Request)
		{
			string Query = ServerUtil.GetQuery(Request);
			var parts = Query.Split(':', ',', '-');
			if (parts.Length == 1)
			{
				string key = parts[0];
				switch (key)
				{
					default:
					case "Home":
						return BuildHomeConfig();
				}
			}
			return BuildGameConfig(parts);
		}

		Dictionary<string, object> BuildGameConfig(string[] parts)
		{
			string Lang = parts.Length > 0 ? parts[0] : "";
			if (!Config.Languages.Contains(Lang))
			{
				Lang = Config.DefaultLang;
			}
			var boardName = parts[1].ToLower();
			if (!Config.BoardNames.Contains(boardName))
			{
				boardName = Config.DefaultBoard;
			}
			var board = Config.GetBoard(Lang + "." + boardName);
			var bot1 = Config.GetBot(parts.Length > 1 ? parts[2] : "", Lang);
			var bot2 = Config.GetBot(parts.Length > 2 ? parts[3] : "", Lang);
			var charSet = Config.GetCharSet(Lang);
			var messages = Config.GetMessages(Lang);
			var players = GetPlayers(Lang, bot1, bot2);
			var gameId = Config.NewId();

			Dictionary<string, object> Dict = new Dictionary<string, object>();
			Dict["Board"] = board;
			Dict["CharSet"] = charSet;
			Dict["Localization"] = messages;
			Dict["Players"] = players;
			Dict["GameId"] = gameId;
			return Dict;
		}

		Dictionary<string, object> BuildHomeConfig()
		{
			Dictionary<string, object> Dict = new Dictionary<string, object>();
			Dict["Langs"] = GetLangs();
			Dict["Boards"] = GetBoards();
			Dict["Bots"] = GetBots();
			Dict["Strings"] = GetStrings();
			return Dict;
		}

		object GetStrings()
		{
			Dictionary<string, object> Dict = new Dictionary<string, object>();
			foreach (string lang in Config.Languages)
			{
				Dict[lang] = Config.Messages(lang, new string[]
				{
					"LangName", "PlayerFull","Against","Play","Bots"
				});
			}
			return Dict;
		}

		object GetBots()
		{
			Dictionary<string, object> Dict = new Dictionary<string, object>();
			foreach (string lang in Config.Languages)
			{
				Dict[lang] = Config.BotsByLang(lang);
			}
			return Dict;
		}

		string[] GetLangs()
		{
			return Config.Languages.ToArray();
		}

		object GetBoards()
		{
			return Config.BoardNames.ToArray();
		}

		Player[] GetPlayers(string Lang, Bot bot1, Bot bot2)
		{
			var player1 = GetPlayer(Lang, bot1);
			var player2 = GetPlayer(Lang, bot2);
			if (player1.Name == player2.Name)
			{
				player1.Name = string.Format(Config.Lang(Lang, "PlayerName"), player1.Name, 1);
				player2.Name = string.Format(Config.Lang(Lang, "PlayerName"), player2.Name, 2);
			}
			return new Player[] { player1, player2 };
		}

		Player GetPlayer(string Lang, Bot bot)
		{
			return bot != null ?
				new Player { Bot = bot, Name = bot.Name } :
				new Player { Bot = null, Name = Config.Lang(Lang, "Player") };
		}

		public bool IsReusable
		{
			get
			{
				return false;
			}
		}
	}
}
