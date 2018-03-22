//---------------------------------------------------------------------------------------------
// <copyright file="ServerUtil.cs" company="Chandam-ఛందం">
//    Copyright © 2013 - 2018 'Chandam-ఛందం' : http://chandam.apphb.com
//    Original Author : Dileep Miriyala (m.dileep@gmail.com)
//    Last Updated    : 21-Mar-2018 23:34EST
//    Revisions:
//       Version    | Author                   | Email                     | Remarks
//       1.0        | Dileep Miriyala          | m.dileep@gmail.com        | Initial Commit
//       _._        | <TODO>                   |   <TODO>                  | <TODO>
// </copyright>
//---------------------------------------------------------------------------------------------



using System.Collections.Generic;
using System.IO;
using System.Reflection;
using System.Web;

namespace Scrabble.Server
{
	class ServerUtil
	{
		internal static string Get(HttpRequest request, string key)
		{
			string val = request[key];
			return val;
		}

		internal static string GetQuery(HttpRequest request, string key, List<string> valid, string defaultVal)
		{
			string val = "";
			if (request.QueryString.Count == 0)
			{
				val = defaultVal;
				return val;
			}
			val = request.QueryString[key];
			if (val == null)
			{
				if (request.QueryString.Keys.Count == 1)
				{
					try
					{
						val = request.QueryString.GetValues(0)[0];
					}
					catch
					{

					}
				}
			}
			if (!valid.Contains(val.ToLower()))
			{
				val = defaultVal;
			}
			return val;
		}


		internal static string GetLang(HttpRequest request)
		{
			return GetQuery(request, "lang", Config.Languages, Config.DefaultLang);
		}

		internal static string ReadResource(string resourceName)
		{
			var assembly = Assembly.GetExecutingAssembly();
			string result = "";
			using (Stream stream = assembly.GetManifestResourceStream(resourceName))
			{
				using (StreamReader reader = new StreamReader(stream))
				{
					result = reader.ReadToEnd();
				}
			}
			return result;
		}
	}
}
