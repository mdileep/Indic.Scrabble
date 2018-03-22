using System.Collections.Generic;

namespace Shared
{
	public static class Indic
	{
		public static List<string> SunnaSet = new List<string> { "ం", "ః" };

		public static List<string> Vowels = new List<string>{
		"అ", "ఆ",
		"ఇ", "ఈ",
		"ఉ", "ఊ",
		"ఎ", "ఏ", "ఐ",
		"ఒ", "ఓ", "ఔ",
		"ఋ", "ౠ"};

		public static List<string> Consonents = new List<string>{
		"క", "ఖ", "గ", "ఘ", "ఙ",
		"చ", "ఛ", "జ", "ఝ", "ఞ",
		"ట", "ఠ", "డ", "ఢ", "ణ",
		"త", "థ", "ద", "ధ", "న",
		"ప", "ఫ", "బ", "భ", "మ",
		"య", "ర", "ల", "వ",
		"శ", "ష", "స", "హ",
		"ళ", "ఱ",
		"క్ష", "ము"};

		public static Dictionary<string, string> Synonyms = new Dictionary<string, string>{
			{"ా", "ఆ"},
			{"ి", "ఇ"},{"ీ", "ఈ"},
			{"ు", "ఉ"},{"ూ", "ఊ"},
			{"ృ", "ఋ"},{"ౄ", "ౠ"},
			{"ె", "ఎ"},{"ే", "ఏ"},
			{"ై", "ఐ"},
			{"ొ", "ఒ"},{"ో", "ఓ"},{"ౌ", "ఔ"}
		};
		
		public static string Virama = "్";
	}
}
