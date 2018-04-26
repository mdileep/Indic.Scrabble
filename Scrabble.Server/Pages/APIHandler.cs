//---------------------------------------------------------------------------------------------
// <copyright file="APIHandler.cs" company="Chandam-ఛందం">
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
using System.Collections.Generic;
using System.Web;

namespace Scrabble.Server
{
	public class APIHandler : IHttpHandler
	{
		public void ProcessRequest(HttpContext context)
		{
			Response response = null;
			try
			{
				var reqJSON = ServerUtil.ReadRequest(context.Request);
				var action = ServerUtil.GetQuery(context.Request, "action", Config.Actions, ActionNames.Help);
				var req = Parser.ParseRequest(reqJSON);
				response = ActionHandler.Process(action, req);
			}
			catch (Exception ex)
			{
				response = new Response
				{
					Action = "ERROR",
					Result = new Dictionary<string, string> { { "Debug", ex.Message } }
				};
			}

			context.Response.ContentType = "application/json";
			string responseJSON = ParseUtil.ToJSON(response);
			context.Response.Write(responseJSON);
		}
		public bool IsReusable
		{
			get
			{
				return false;
			}
		}
	}

	public class APIPage : System.Web.UI.Page
	{
		protected void Page_Load(object sender, EventArgs e)
		{
			try
			{
				Response response = null;
				try
				{
					var reqJSON = ServerUtil.ReadRequest(Request);
					var action = ServerUtil.GetQuery(Request, "action", Config.Actions, ActionNames.Help);
					var req = Parser.ParseRequest(reqJSON);
					response = ActionHandler.Process(action, req);
				}
				catch (Exception ex)
				{
					response = new Response
					{
						Action = "ERROR",
						Result = new Dictionary<string, string> { { "Debug", ex.Message } }
					};
				}

				Response.Clear();
				Response.ContentType = "application/json";
				string responseJSON = ParseUtil.ToJSON(response);
				Response.Write(responseJSON);
			}
			catch
			{
			}
		}
	}
}
