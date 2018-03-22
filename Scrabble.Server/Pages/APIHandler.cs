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

using System.Web;

namespace Scrabble.Server
{
	public class APIHandler : IHttpHandler
	{
		public void ProcessRequest(HttpContext context)
		{
			context.Response.ContentType = "application/json";
			var args = ServerUtil.Get(context.Request, "args");
			var action = ServerUtil.GetQuery(context.Request, "action", Config.Actions, ActionNames.Help);
			var req = Parser.ParseRequest(args);
			var response = ActionHandler.Process(action, req);

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
}
