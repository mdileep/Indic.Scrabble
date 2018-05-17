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

using System.IO;
using System.Runtime.Serialization.Json;
using System.Text;
using System.Web.Script.Serialization;

namespace Scrabble.Server
{
	class ParseUtil
	{
		internal static string ToJSONStrict(object obj)
		{
			byte[] json = null;
			using (MemoryStream ms = new MemoryStream())
			{
				DataContractJsonSerializer ser = new DataContractJsonSerializer(obj.GetType());
				ser.WriteObject(ms, obj);
				json = ms.ToArray();
				ms.Close();
			}
			return Encoding.UTF8.GetString(json, 0, json.Length);
		}

		internal static T ParseJSONStrict<T>(string json)
		{
			T obj = default(T);
			using (MemoryStream ms = new MemoryStream(Encoding.UTF8.GetBytes(json)))
			{
				DataContractJsonSerializer ser = new DataContractJsonSerializer(typeof(T));
				obj = (T)ser.ReadObject(ms);
				ms.Close();
			}
			return obj;
		}

		internal static T ParseJSON<T>(string json)
		{
			var ser = new JavaScriptSerializer();
			var obj = ser.DeserializeObject(json);
			return ConvertTo<T>(obj);
		}

		internal static string ToJSON(object o)
		{
			JavaScriptSerializer serializer = new JavaScriptSerializer();
			return serializer.Serialize(o);
		}

		internal static T ConvertTo<T>(object obj)
		{
			var ser = new JavaScriptSerializer();
			return ser.ConvertToType<T>(obj);
		}
	}
}
