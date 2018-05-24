using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;

namespace Experiments
{
	class Temp
	{
		int size;
		string[] Items;
		Cell[] Cells;
		List<Word> Words;
		public Temp()
		{
			size = 10;
			Items = new string[]
					{
						"","D","I","L","E","E","P","","","",
						"","I","","","","","","","","",
						"I","N","D","I","A","","","","","",
						"","N","","","","","","","","",
						"","E","","","","","","","","",
						"P","R","A","D","E","E","P","","","",
						"","","","P","","","","","","",
						"","","","P","","","","","","",
						"","","","L","O","V","E","","","",
						"","","","E","","","","","","",
					};

			Words = new List<Word>();
			Cells = new Cell[Items.Length];
			for (int i = 0; i < Items.Length; i++)
			{
				Cells[i] = new Cell { Currrent = Items[i], Index = i, Waiting = (i % 4 == 0 && Items[i] != "") };
			}
		}

		public void Go()
		{
			bool isValid = Validate();
			for (int i = 0; i < size; i++)
			{
				WordsOnRow(i);
				WordsOnColumn(i);
			}

			bool soloIsolations = HasSoloIsolations();
			bool hasClusters = HasClusters();
		}
		bool Validate()
		{
			bool res = false;
			int cnt = 0;
			Pos P = new Pos();
			for (int i = 0; i < size * size; i++)
			{
				Cell C = Cells[i];
				if (!C.Waiting)
				{
					continue;
				}
				if (string.IsNullOrEmpty(C.Currrent))
				{
					continue;
				}
				if (cnt == 0)
				{
					//First Waiting Cell
					P = Pos(i, size);
					cnt++;
					continue;
				}
				Pos P2 = Pos(i, size);
				if (P2.X == P.X || P2.Y == P.Y)
				{
					//Valid
				}
				else
				{
					//Not Valid
					res = false;
					Debug.WriteLine(P2.X + " " + P2.Y + " " + C.Currrent);
				}
				cnt++;
			}
			return res;
		}
		
		bool HasSoloIsolations()
		{
			bool res = false;
			for (int i = 0; i < size * size; i++)
			{
				if (string.IsNullOrEmpty(Cells[i].Currrent))
				{
					continue;
				}
				int[] neighors = FindNeighbors(i);
				bool valid = false;
				foreach (int neighbor in neighors)
				{
					Cell C = Cells[neighbor];
					if (!string.IsNullOrEmpty(C.Currrent))
					{
						valid = true;
					}
				}
				if (!valid)
				{
					Pos P = Pos(i, size);
					Cell C = Cells[i];
					Debug.WriteLine("Isolated Cell at Row: " + (P.X + 1) + "  Column: " + (P.Y + 1) + " : " + C.Currrent);
					res = true;
				}
			}
			return res;
		}

		void _Words(int r, char option)
		{
			string pending = "";
			string prev = "";
			int cnt = 0;
			bool waiting = false;
			int score = 0;
			for (int i = 0; i < size; i++)
			{
				int index = -1;
				switch (option)
				{
					case 'R':
						index = Abs(r, i, size);
						break;
					case 'C':
						index = Abs(i, r, size);
						break;
				}

				Cell cell = Cells[index];
				if (!string.IsNullOrEmpty(cell.Currrent))
				{
					pending += cell.Currrent;
					cnt++;
					if (cell.Waiting)
					{
						waiting = true;
					}
					score += cell.Weight;
				}

				if (prev != "" && cell.Currrent == "")
				{
					if (cnt > 1)
					{
						string word = pending + cell.Currrent;
						Word W = new Word { Text = word, Waiting = waiting, Score = score };
						Words.Add(W);
						Debug.WriteLine(word + (W.Waiting ? " [YES]" : ""));
					}
					pending = "";
					cnt = 0;
					waiting = false;
					score = 0;
				}
				prev = cell.Currrent;
			}
		}
		void WordsOnRow(int i)
		{
			_Words(i, 'R');
		}
		void WordsOnColumn(int i)
		{
			_Words(i, 'C');
		}

		bool HasClusters()
		{
			List<int> Clustered = new List<int>();
			var clusters = 0;
			while (true)
			{
				int first = FirstNonEmpty(Clustered);
				if (first == -1)
				{
					break;
				}
				Debug.WriteLine("Cluster #" + (clusters + 1));
				List<int> List = ClusterCells(first);
				Clustered.AddRange(List);
				clusters++;
			}
			Debug.WriteLine("Clusters found: " + clusters);
			return (clusters > 1);
		}
		List<int> ClusterCells(int first)
		{
			List<int> List = new List<int>();
			List.Add(first);
			{
				Pos P = Pos(first, size);
				Cell C = Cells[first];
				Debug.WriteLine("\t" + first + " " + P.X + " , " + P.Y + " :" + C.Currrent);
			}
			int curr = 0;
			bool found = true;
			while (found)
			{
				if (curr >= List.Count)
				{
					break;
				}
				found = false;

				int[] neighors = FindNeighbors(List[curr]);
				foreach (int neighbor in neighors)
				{
					if (List.Contains(neighbor))
					{
						continue;
					}
					found = true;
					Cell C = Cells[neighbor];
					if (string.IsNullOrEmpty(C.Currrent))
					{
						continue;
					}
					Pos P = Pos(neighbor, size);
					Debug.WriteLine("\t" + neighbor + " " + P.X + " , " + P.Y + " :" + C.Currrent);
					List.Add(neighbor);
				}
				curr++;
			}
			return List;
		}
		int FirstNonEmpty(List<int> Clustered)
		{
			int first = -1;
			for (int i = 0; i < size * size; i++)
			{
				if (Clustered.Contains(i))
				{
					continue;
				}
				if (string.IsNullOrEmpty(Cells[i].Currrent))
				{
					continue;
				}
				first = i;
				break;
			}
			return first;
		}
		int[] FindNeighbors(int index)
		{
			List<int> arr = new List<int>();
			Pos pos = Pos(index, size);
			int bottom = Abs(pos.X + 1, pos.Y, size);
			int top = Abs(pos.X - 1, pos.Y, size);
			int left = Abs(pos.X, pos.Y - 1, size);
			int right = Abs(pos.X, pos.Y + 1, size);
			foreach (int a in new int[] { right, left, top, bottom })
			{
				if (a != -1)
				{
					arr.Add(a);
				}
			}
			return arr.ToArray();
		}
		static int Abs(int X, int Y, int size)
		{
			const int min = 0;
			int max = size - 1;

			if ((X < min || X > max) || (Y < min || Y > max))
			{
				return -1;
			}
			return (size * (X + 1)) + Y - size;
		}
		static Pos Pos(int N, int size)
		{
			int X = (N / size);
			int Y = (N % size);
			return new Pos { X = X, Y = Y };
		}
	}
	struct Pos
	{
		public int X;
		public int Y;
	}
	struct Word
	{
		public string Text;
		public bool Waiting;
		public int Score;
	}
	class Cell
	{
		public string Currrent;
		public int Index;
		public int Weight;
		public bool Waiting;
		public override string ToString()
		{
			return Index + " " + Currrent;
		}
	}
}
