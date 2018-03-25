//---------------------------------------------------------------------------------------------
// <copyright file="Watcher.cs" company="Chandam-ఛందం">
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
using System.Diagnostics;

namespace Scrabble
{
	/// <summary>
	/// Time Keeper
	/// </summary>
	public class Watcher : IDisposable
	{
		private Stopwatch stopWatch = null;
		private string title;

		public Watcher(string title)
		{
			Init(title);
		}

		public Watcher()
		{
			Init("");
		}

		public string Elapsed()
		{
			return ElapsedTime();
		}

		public void Dispose()
		{
			End();
		}

		private void Init(string title)
		{
			stopWatch = new Stopwatch();
			stopWatch.Start();
			this.title = title;
		}


		private void End()
		{
			stopWatch.Stop();
			Printer.PrintLine(string.Format("{0} : {1}", title, ElapsedTime()));
		}

		private string ElapsedTime()
		{
			var timeSpan = stopWatch.Elapsed;

			if (timeSpan.TotalMilliseconds < 1000)
			{
				return string.Format("{0}ms", timeSpan.TotalMilliseconds.ToString("0.00"));
			}
			if (timeSpan.TotalSeconds < 60)
			{
				return string.Format("{0}sec", timeSpan.TotalSeconds.ToString("0.00"));
			}
			if (timeSpan.TotalMinutes < 60)
			{
				return string.Format("{0}min", timeSpan.TotalMinutes.ToString("0.00"));
			}
			return string.Format("{0}Hours", timeSpan.TotalHours.ToString("0.00"));
		}
	}
}
