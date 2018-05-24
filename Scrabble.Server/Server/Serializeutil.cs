//---------------------------------------------------------------------------------------------
// <copyright file="Serializeutil.cs" company="Chandam-ఛందం">
//    Copyright © 2013 - 2018 'Chandam-ఛందం' : http://chandam.apphb.com
//    Original Author : Dileep Miriyala (m.dileep@gmail.com)
//    Last Updated    : 24-May-2018 12:16EST
//    Revisions:
//       Version    | Author                   | Email                     | Remarks
//       1.0        | Dileep Miriyala          | m.dileep@gmail.com        | Initial Commit
//       _._        | <TODO>                   |   <TODO>                  | <TODO>
// </copyright>
//---------------------------------------------------------------------------------------------


using System.IO;
using System.Runtime.Serialization.Formatters.Binary;

namespace Scrabble
{
	class Serializeutil
	{
		static T Deserialize<T>(string fromFile)
		{
			BinaryFormatter formatter = new BinaryFormatter();
			using (FileStream fs = File.Open(fromFile, FileMode.Open))
			{
				object obj = formatter.Deserialize(fs);
				fs.Flush();
				fs.Close();
				fs.Dispose();
				return (T)obj;
			}
		}
		static void Serialize<T>(T settings, string toFile)
		{
			using (Stream ms = File.OpenWrite(toFile))
			{
				BinaryFormatter formatter = new BinaryFormatter();
				formatter.Serialize(ms, settings);
				ms.Flush();
				ms.Close();
				ms.Dispose();
			}
		}
	}
}
