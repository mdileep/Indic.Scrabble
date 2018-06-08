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
using Scrabble.Server;
using System.Collections.Generic;

namespace Scrabble.Storage
{
	public class StorageUtil
	{
		IMongoCollection<BsonDocument> Metrics;
		IMongoCollection<BsonDocument> Words;

		public StorageUtil()
		{
			var url = MongoUrl.Create(StorageConfig.ConnectionString);
			var client = new MongoClient(StorageConfig.ConnectionString);
			var db = new MongoClient(url).GetDatabase(url.DatabaseName);
			Metrics = db.GetCollection<BsonDocument>(StorageConfig.Metrics);
			Words = db.GetCollection<BsonDocument>(StorageConfig.Words);
		}

		internal void AddWords(string[] words)
		{
			var doc = BsonDocument.Parse(ParseUtil.ToJSON(words));
			Words.InsertOne(doc);
		}

		public void AddMetric(Dictionary<string, object> dict)
		{
			var doc = BsonDocument.Parse(ParseUtil.ToJSON(dict));
			Metrics.InsertOne(doc);
		}
	}
}