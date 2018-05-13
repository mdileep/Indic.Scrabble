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

namespace Scrabble.Server
{
	public class StaticPage : System.Web.UI.Page
	{
	}
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
			LangStyle.Href = string.Format("styles/css/{0}.min.css", Lang);
		}

		void _Init()
		{
			Query = ServerUtil.GetQuery(Request);
			var parts = Query.Split(':', ',', '-');
			Lang = parts.Length > 0 ? parts[0] : "";
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
		protected string Lang;
		protected string Query;
	}
}
