//---------------------------------------------------------------------------------------------
// <copyright file="Response.cs" company="Chandam-ఛందం">
//    Copyright © 2013 - 2018 'Chandam-ఛందం' : http://chandam.apphb.com
//    Original Author : Dileep Miriyala (m.dileep@gmail.com)
//    Last Updated    : 21-Mar-2018 23:35EST
//    Revisions:
//       Version    | Author                   | Email                     | Remarks
//       1.0        | Dileep Miriyala          | m.dileep@gmail.com        | Initial Commit
//       _._        | <TODO>                   |   <TODO>                  | <TODO>
// </copyright>
//---------------------------------------------------------------------------------------------

using System.Runtime.Serialization;

namespace Scrabble.Server
{
	public class Response
	{
		public string Action { get; set; }

		public string Language { get; set; }

		public string Reference { get; set; }

		public object Result { get; set; }

		public string Effort { get; set; }
	}
}
