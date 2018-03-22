//---------------------------------------------------------------------------------------------
// <copyright file="BoardUtil.cs" company="Chandam-ఛందం">
//    Copyright © 2013 - 2018 'Chandam-ఛందం' : http://chandam.apphb.com
//    Original Author : Dileep Miriyala (m.dileep@gmail.com)
//    Last Updated    : 21-Mar-2018 23:35EST
//    Revisions:
//       Version    | Author                   | Email                     | Remarks
//       1.0        | Dileep Miriyala          | m.dileep@gmail.com        | Initial Commit
//       _._        | <TODO>                   |   <TODO>                  | <TODO>
// </copyright>
//---------------------------------------------------------------------------------------------


using System;

namespace Scrabble
{
	public static class BoardUtil
	{
		public static Neighbor FindNeighbors(int index, int size)
		{
			Neighbor arr = new Neighbor { Right = -1, Left = -1, Top = -1, Bottom = -1 };
			var pos = Position(index, size);
			var bottom = Abs(pos.X + 1, pos.Y, size);
			var top = Abs(pos.X - 1, pos.Y, size);
			var left = Abs(pos.X, pos.Y - 1, size);
			var right = Abs(pos.X, pos.Y + 1, size);
			arr = new Neighbor { Right = right, Left = left, Top = top, Bottom = bottom };
			return arr;
		}

		public static int Abs(decimal X, decimal Y, int size)
		{
			return Abs((int)X, (int)Y, size);
		}

		public static Point Position(decimal N, decimal size)
		{
			var X = Math.Floor(N / size);
			var Y = (N % size);
			return new Point
			{
				X = X,
				Y = Y
			};
		}

		public static int Abs(int X, int Y, int size)
		{
			var min = 0;
			var max = size - 1;
			if ((X < min || X > max) || (Y < min || Y > max))
			{
				return -1;
			}
			return (size * (X + 1)) + Y - size;
		}
	}
}
