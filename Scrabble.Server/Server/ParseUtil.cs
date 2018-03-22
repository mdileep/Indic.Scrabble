//---------------------------------------------------------------------------------------------
// <copyright file="ParseUtil.cs" company="Chandam-ఛందం">
//    Copyright © 2013 - 2018 'Chandam-ఛందం' : http://chandam.apphb.com
//    Original Author : Dileep Miriyala (m.dileep@gmail.com)
//    Last Updated    : 21-Mar-2018 23:34EST
//    Revisions:
//       Version    | Author                   | Email                     | Remarks
//       1.0        | Dileep Miriyala          | m.dileep@gmail.com        | Initial Commit
//       _._        | <TODO>                   |   <TODO>                  | <TODO>
// </copyright>
//---------------------------------------------------------------------------------------------


using System.Web.Script.Serialization;

namespace Scrabble.Server
{
	class ParseUtil
	{
		internal static T ParseJSON<T>(string json)
		{
			var ser = new JavaScriptSerializer();
			return (T)ser.DeserializeObject(json);
		}

		internal static string ToJSON(object o)
		{
			JavaScriptSerializer serializer = new JavaScriptSerializer
			{

			};
			return serializer.Serialize(o);
		}

		internal static T ConvertTo<T>(object obj)
		{
			var ser = new JavaScriptSerializer();
			return ser.ConvertToType<T>(obj);
		}
	}
}
