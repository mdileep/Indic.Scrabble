//---------------------------------------------------------------------------------------------
// <copyright file="Home.cs" company="Chandam-ఛందం">
//    Copyright © 2013 - 2018 'Chandam-ఛందం' : http://chandam.apphb.com
//    Original Author : Dileep Miriyala (m.dileep@gmail.com)
//    Last Updated    : 21-Mar-2018 23:34EST
//    Revisions:
//       Version    | Author                   | Email                     | Remarks
//       1.0        | Dileep Miriyala          | m.dileep@gmail.com        | Initial Commit
//       _._        | <TODO>                   |   <TODO>                  | <TODO>
// </copyright>
//---------------------------------------------------------------------------------------------

using System;
using System.Web.UI.HtmlControls;
using Shared;

namespace Scrabble.Server
{
	public class Home : System.Web.UI.Page
	{
		protected void Page_Load(object sender, EventArgs e)
		{
			try
			{
				_Init();
				ConfigUI();
			}
			catch
			{
			}
		}

		void ConfigUI()
		{
			Head.Title = Config.Lang(Lang, "Title");
			Keywords.Content = Config.Lang(Lang, "Keywords");
			Description.Content = Config.Lang(Lang, "Description");
			Author.Content = Config.Lang(Lang, "Author");
			Author2.InnerText = Config.Lang(Lang, "Author2");
			H2.InnerHtml = Config.Lang(Lang, "Name");
			LangStyle.Href = string.Format("styles/{0}.css", Lang);

			ScriptManager SC = new ScriptManager();
			SC.AddScriptFile(string.Format("scripts/{0}.config.js", Lang));
			Scripts.InnerHtml = SC.Go();
		}

		void _Init()
		{
			string query = ServerUtil.GetQuery(Request);
			var parts = query.Split(':', ',');
			Lang = parts.Length > 0 ? parts[0] : "";
			if (!Config.Languages.Contains(Lang))
			{
				Lang = Config.DefaultLang;
			}
			var bot1 = Config.GetBot(parts.Length > 1 ? parts[1] : "", Lang);
			var bot2 = Config.GetBot(parts.Length > 2 ? parts[2] : "", Lang);
			SetPlayers(bot1, bot2);
		}

		void SetPlayers(Bot bot1, Bot bot2)
		{
			var player1 = GetPlayer(bot1);
			var player2 = GetPlayer(bot2);
			if (player1.Name == player2.Name)
			{
				player1.Name = string.Format(Config.Lang(Lang, "PlayerName"), player1.Name, 1);
				player2.Name = string.Format(Config.Lang(Lang, "PlayerName"), player2.Name, 2);
			}
			ScriptManager SC = new ScriptManager();
			SC.SetScriptVar("Players", new Player[] { player1, player2 });
			Players.InnerHtml = SC.Go();
		}

		Player GetPlayer(Bot bot)
		{
			return bot != null ?
				new Player { BotId = bot.Id, Name = bot.Name, IsBot = true } :
				new Player { Name = Config.Lang(Lang, "Player"), IsBot = false };
		}

		protected HtmlMeta Keywords;
		protected HtmlMeta Author;
		protected HtmlMeta Description;
		protected HtmlHead Head;
		protected HtmlGenericControl Author2;
		protected HtmlGenericControl H2;
		protected HtmlLink LangStyle;
		protected HtmlGenericControl Scripts;
		protected HtmlGenericControl Players;
		protected string Lang;
	}
}
