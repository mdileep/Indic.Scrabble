//---------------------------------------------------------------------------------------------
// <copyright file="StorageConfig.cs" company="Chandam-ఛందం">
//    Copyright © 2013 - 2018 'Chandam-ఛందం' : http://chandam.apphb.com
//    Original Author : Dileep Miriyala (m.dileep@gmail.com)
//    Last Updated    : 05-Jun-2018 20:56EST
//    Revisions:
//       Version    | Author                   | Email                     | Remarks
//       1.0        | Dileep Miriyala          | m.dileep@gmail.com        | Initial Commit
//       _._        | <TODO>                   |   <TODO>                  | <TODO>
// </copyright>
//---------------------------------------------------------------------------------------------

using System.Configuration;

namespace Scrabble.Storage
{
	public class StorageConfig
	{
		public static readonly string ConnectionString = "";
		public const string Metrics = "Metrics";

		static StorageConfig()
		{
			try
			{
				ConnectionString = ConfigurationManager.AppSettings["MONGOLAB_URI"].ToString();
			}
			catch { }
		}
	}
}