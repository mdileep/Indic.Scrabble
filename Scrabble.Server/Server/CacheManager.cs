//---------------------------------------------------------------------------------------------
// <copyright file="CacheManager.cs" company="Chandam-ఛందం">
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
	class CacheManager
	{
		internal static T GetApppObject<T>(string Key, Func<object, T> callBack, object args)
		{
			if (HttpContext.Current.Application[Key] != null)
			{
				return (T)HttpContext.Current.Application[Key];
			}
			var obj = callBack(args);
			HttpContext.Current.Application[Key] = obj;
			return obj;
		}

		internal static T GetApppObject<T>(string Key, Func<T> callBack)
		{
			if (HttpContext.Current.Application[Key] != null)
			{
				return (T)HttpContext.Current.Application[Key];
			}
			var obj = callBack();
			HttpContext.Current.Application[Key] = obj;
			return obj;
		}

		internal static T GetCache<T>(string Key, Func<T> callBack)
		{
			if (HttpContext.Current.Application[Key] != null)
			{
				return (T)HttpContext.Current.Application[Key];
			}
			var obj = callBack();
			HttpContext.Current.Application[Key] = obj;
			return obj;
		}

		internal static T GetSession<T>(string Key)
		{
			var Val = HttpContext.Current.Session[Key];
			if (Val == null)
			{
				return default(T);
			}
			return (T)Val;
		}

		internal static T GetSession<T>(string Block, string Key)
		{
			var Dict = (Dictionary<string, T>)HttpContext.Current.Session[Block];
			if (Dict == null)
			{
				return default(T);
			}
			if (Dict.ContainsKey(Key))
			{
				return Dict[Key];
			}
			return default(T);
		}

		internal static T GetSession<T, T1, T2>(string Block, string Key, T1 p1, T2 p2, Func<T1, T2, T> callBack)
		{
			var Dict = (Dictionary<string, T>)HttpContext.Current.Session[Block];
			if (Dict == null)
			{
				Dict = new Dictionary<string, T>();
			}
			if (Dict.ContainsKey(Key))
			{
				return Dict[Key];
			}
			var obj = callBack(p1, p2);
			Dict[Key] = obj;
			HttpContext.Current.Session[Block] = Dict;
			return obj;
		}
	}
}
