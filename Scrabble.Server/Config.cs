//---------------------------------------------------------------------------------------------
// <copyright file="Config.cs" company="Chandam-ఛందం">
//    Copyright © 2013 - 2018 'Chandam-ఛందం' : http://chandam.apphb.com
//    Original Author : Dileep Miriyala (m.dileep@gmail.com)
//    Last Updated    : 25-Feb-2018 17:46EST
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
using System.Web.Script.Serialization;

namespace Scrabble.Server
{
	class Config
	{
		public const string DefaultLang = "te";
		public static readonly List<string> Languages = new List<string> { "te", "hi", "bn", "pa", "gu", "or", "ta", "kn", "ml" };
		static Dictionary<string, string> Dictionary = new Dictionary<string, string>();

		static Config()
		{
			Init();
		}

		private static void Init()
		{
			if (HttpContext.Current.Application["Localize"] != null)
			{
				Dictionary = (Dictionary<string, string>)HttpContext.Current.Application["Localize"];
				return;
			}
			foreach (string lang in Languages)
			{
				string resouceName = string.Format("Scrabble.Server.{0}.json", lang);
				var content = ReadResource(resouceName);
				Dictionary<string, object> dict = ParseJSON(content);
				foreach (var item in dict)
				{
					Dictionary[lang + ":" + item.Key] = item.Value.ToString();
				}
			}
			HttpContext.Current.Application["Localize"] = Dictionary;
		}

		public static string Lang(string lang, string key)
		{
			return Dictionary[lang + ":" + key];
		}

		static Dictionary<string, object> ParseJSON(string json)
		{
			var ser = new JavaScriptSerializer();
			var dict = (Dictionary<string, object>)ser.DeserializeObject(json);
			return dict;
		}

		static string ReadResource(string resourceName)
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
