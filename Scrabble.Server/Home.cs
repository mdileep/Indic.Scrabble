//---------------------------------------------------------------------------------------------
// <copyright file="Home.cs" company="Chandam-ఛందం">
//    Copyright © 2013 - 2018 'Chandam-ఛందం' : http://chandam.apphb.com
//    Original Author : Dileep Miriyala (m.dileep@gmail.com)
//    Last Updated    : 25-Feb-2018 17:47EST
//    Revisions:
//       Version    | Author                   | Email                     | Remarks
//       1.0        | Dileep Miriyala          | m.dileep@gmail.com        | Initial Commit
//       _._        | <TODO>                   |   <TODO>                  | <TODO>
// </copyright>
//---------------------------------------------------------------------------------------------


using System;
using System.Web.UI.HtmlControls;

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
			if (Request.QueryString.Count == 0)
			{
				Lang = Config.DefaultLang;
				return;
			}

			Lang = Request.QueryString["lang"];
			if (Lang == null)
			{
				string key = Request.QueryString.AllKeys[0];
				Lang = Request.QueryString[key].ToLower();
			}
			if (!Config.Languages.Contains(Lang))
			{
				Lang = Config.DefaultLang;
			}
		}

		protected HtmlMeta Keywords;
		protected HtmlMeta Author;
		protected HtmlMeta Description;
		protected HtmlHead Head;
		protected HtmlGenericControl Author2;
		protected HtmlGenericControl H2;
		protected HtmlLink LangStyle;
		protected HtmlGenericControl Scripts;
		protected string Lang;
	}
}
