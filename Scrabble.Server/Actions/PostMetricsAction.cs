//---------------------------------------------------------------------------------------------
// <copyright file="PostMetricsAction.cs" company="Chandam-ఛందం">
//    Copyright © 2013 - 2018 'Chandam-ఛందం' : http://chandam.apphb.com
//    Original Author : Dileep Miriyala (m.dileep@gmail.com)
//    Last Updated    : 05-Jun-2018 18:49EST
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
	internal class PostMetricsAction : iAPIAction
	{
		public object Process(Dictionary<string, object> dict)
		{
			AddIP(dict);
			//Ideally Should define a Structure.
			new Storage.StorageUtil().AddMetric(dict);
			return true;
		}

		void AddIP(Dictionary<string, object> dict)
		{
			try
			{
				string clientIp = null;
				clientIp = (HttpContext.Current.Request.ServerVariables["HTTP_X_FORWARDED_FOR"] ?? context.Request.ServerVariables["REMOTE_ADDR"]).Split(',')[0].Trim();
				clientIp = (clientIp.Length < 4) ? null : clientIp;
				dict["IP"] = clientIp;
			}
			catch { }
		}
	}
}