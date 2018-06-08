//---------------------------------------------------------------------------------------------
// <copyright file="ActionHandler.cs" company="Chandam-ఛందం">
//    Copyright © 2013 - 2018 'Chandam-ఛందం' : http://chandam.apphb.com
//    Original Author : Dileep Miriyala (m.dileep@gmail.com)
//    Last Updated    : 21-Mar-2018 23:32EST
//    Revisions:
//       Version    | Author                   | Email                     | Remarks
//       1.0        | Dileep Miriyala          | m.dileep@gmail.com        | Initial Commit
//       _._        | <TODO>                   |   <TODO>                  | <TODO>
// </copyright>
//---------------------------------------------------------------------------------------------

namespace Scrabble.Server
{
	class ActionHandler
	{
		internal static iAPIAction LookupRegsiter(string action)
		{
			switch (action.ToLower())
			{
				case ActionNames.Ping:
					return new PingAction();

				case ActionNames.NextMove:
					return new NextMoveAction();

				case ActionNames.Probables:
					return new ProbablesAction();

				case ActionNames.Validate:
					return new ValidateAction();

				case ActionNames.PostMetrics:
					return new PostMetricsAction();

				case ActionNames.ReportWords:
					return new ReportWordsAction();

				default:
				case ActionNames.Help:
					return new HelpAction();
			}
		}

		internal static Response Process(string action, Request req)
		{
			using (Watcher W = new Watcher(action))
			{
				iAPIAction command = LookupRegsiter(action);
				var actionReponse = command.Process(req);
				Response response = new Response
				{
					Action = action,
					Result = actionReponse,
					Effort = W.Elapsed()
				};
				return response;
			}
		}
	}
}
