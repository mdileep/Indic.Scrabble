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
	}
}
