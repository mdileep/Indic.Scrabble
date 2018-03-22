using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text.RegularExpressions;

namespace Scrabble
{
	class Runner2
	{
		static void RunBatches(string file, string pattern)
		{
			for (int i = 0; i < 5; i++)
			{
				Debug.WriteLine("======== Batch - " + (i + 1) + "========");
				{
					Debug.WriteLine("========Match========");
					List<string> words = LoadWords(file);
					words = ReWrite(words);
					List<string> List = MatchedWords(words, pattern);
					List<int> List2 = MatchedIndexes(words, pattern);
					List<int> List3 = MatchedIndexes2(words, pattern);
					Debug.WriteLine("");
				}
				{
					Debug.WriteLine("========Match========");
					List<Word> words = LoadWords2(file);
					List<Word> List = MatchedWords2(words, pattern);
					List<int> List2 = MatchedIndexes3(words, pattern);
					List<int> List3 = MatchedIndexes4(words, pattern);
					Debug.WriteLine("");
				}
			}
		}

		static List<Word> MatchedWords2(List<Word> words, string Pattern)
		{
			Debug.WriteLine("Match Pattern: " + Pattern);
			DateTime st = DateTime.Now;
			Regex r = new Regex(Pattern, RegexOptions.IgnoreCase);
			List<Word> List = words.FindAll(delegate (Word s) { return r.IsMatch(s.String); });
			DateTime end = DateTime.Now;
			Debug.WriteLine("Words Found: " + List.Count);
			Debug.WriteLine("Matching Word by Word: (ms): " + (end - st).TotalMilliseconds);
			return List;
		}

		static List<string> ReWrite(List<string> words)
		{
			List<string> W = new List<string>();
			foreach (string s in words)
			{
				W.Add(ReWrite(s));
			}
			return W;
		}

		static string ReWrite(string s)
		{
			return s.Replace("్", "");
		}

		static List<string> MatchedWords(List<string> words, string Pattern)
		{
			DateTime st = DateTime.Now;
			Regex r = new Regex(Pattern, RegexOptions.IgnoreCase);
			List<string> List = words.FindAll(delegate (string s) { return r.IsMatch(s); });
			DateTime end = DateTime.Now;
			Debug.WriteLine("Words Found: " + List.Count);
			Debug.WriteLine("Matching Word by Word (2)  (ms): " + (end - st).TotalMilliseconds);
			return List;
		}

		static List<int> MatchedIndexes(List<string> words, string Pattern)
		{
			DateTime st = DateTime.Now;
			Regex r = new Regex(Pattern, RegexOptions.IgnoreCase);
			List<int> List = Enumerable.Range(0, words.Count).Where(i => r.IsMatch(words[i])).ToList();
			DateTime end = DateTime.Now;
			Debug.WriteLine("Words Found: " + List.Count);
			Debug.WriteLine("Matching Indexes Word by Word: (ms): " + (end - st).TotalMilliseconds);
			return List;
		}

		static List<int> MatchedIndexes3(List<Word> words, string Pattern)
		{
			DateTime st = DateTime.Now;
			Regex r = new Regex(Pattern, RegexOptions.IgnoreCase);
			List<int> List = Enumerable.Range(0, words.Count).Where(i => r.IsMatch(words[i].String)).ToList();
			DateTime end = DateTime.Now;
			Debug.WriteLine("Words Found: " + List.Count);
			Debug.WriteLine("Matching Indexes (3) Word by Word: (ms): " + (end - st).TotalMilliseconds);
			return List;
		}

		static List<int> MatchedIndexes2(List<string> words, string Pattern)
		{
			DateTime st = DateTime.Now;
			Regex r = new Regex(Pattern, RegexOptions.IgnoreCase);
			List<int> List = words.IndexOfAll(s => r.IsMatch(s)).ToList();
			DateTime end = DateTime.Now;
			Debug.WriteLine("Words Found: " + List.Count);
			Debug.WriteLine("Matching Indexes (2) Word by Word: (ms): " + (end - st).TotalMilliseconds);
			return List;
		}

		static List<int> MatchedIndexes4(List<Word> words, string Pattern)
		{
			DateTime st = DateTime.Now;
			Regex r = new Regex(Pattern, RegexOptions.IgnoreCase);
			List<int> List = words.IndexOfAll(s => r.IsMatch(s.String)).ToList();
			DateTime end = DateTime.Now;
			Debug.WriteLine("Words Found: " + List.Count);
			Debug.WriteLine("Matching Indexes (4) Word by Word: (ms): " + (end - st).TotalMilliseconds);
			return List;
		}

		static List<string> LoadWords(string file)
		{
			DateTime st = DateTime.Now;
			List<string> List = new List<string>();
			string[] lines = System.IO.File.ReadAllLines(file);
			List.AddRange(lines);
			DateTime end = DateTime.Now;
			Debug.WriteLine("Load Words: (ms): " + (end - st).TotalMilliseconds);
			return List;
		}

		static List<Word> LoadWords2(string file)
		{
			DateTime st = DateTime.Now;
			List<Word> List = new List<Word>();
			string[] lines = System.IO.File.ReadAllLines(file);
			int cnt = 0;
			foreach (string line in lines)
			{
				List.Add(new Word
				{
					String = line,
					Index = cnt++,
					Syllables = line.Count(x => x == ',') + 1,
				});
			}
			DateTime end = DateTime.Now;
			Debug.WriteLine("Load Words: (ms): " + (end - st).TotalMilliseconds);
			return List;
		}
	}
}
