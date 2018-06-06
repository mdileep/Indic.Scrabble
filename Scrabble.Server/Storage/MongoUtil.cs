//---------------------------------------------------------------------------------------------
// <copyright file="MongoUtil.cs" company="Chandam-ఛందం">
//    Copyright © 2013 - 2018 'Chandam-ఛందం' : http://chandam.apphb.com
//    Original Author : Dileep Miriyala (m.dileep@gmail.com)
//    Last Updated    : 05-Jun-2018 20:29EST
//    Revisions:
//       Version    | Author                   | Email                     | Remarks
//       1.0        | Dileep Miriyala          | m.dileep@gmail.com        | Initial Commit
//       _._        | <TODO>                   |   <TODO>                  | <TODO>
// </copyright>
//---------------------------------------------------------------------------------------------

using MongoDB.Bson;
using MongoDB.Driver;
using System.Collections.Generic;

namespace Scrabble.Storage
{
	public class StorageUtil
	{
		IMongoCollection<BsonDocument> Metrics;

		public StorageUtil()
		{
			var url = MongoUrl.Create(StorageConfig.ConnectionString);
			var client = new MongoClient(StorageConfig.ConnectionString);
			var db = new MongoClient(url).GetDatabase(url.DatabaseName);
			Metrics = db.GetCollection<BsonDocument>(StorageConfig.Metrics);
		}

		public void AddMetric(Dictionary<string, object> dict)
		{
			var document = dict.ToBsonDocument<Dictionary<string, object>>();
			Metrics.InsertOne(document);
		}
	}
}