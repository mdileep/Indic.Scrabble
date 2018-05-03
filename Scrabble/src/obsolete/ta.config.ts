//---------------------------------------------------------------------------------------------
// <copyright file="ta.config.ts" company="Chandam-ఛందం">
//    Copyright © 2013 - 2018 'Chandam-ఛందం' : http://chandam.apphb.com
//    Original Author : Dileep Miriyala (m.dileep@gmail.com)
//    Last Updated    : 25-Feb-2018 15:18EST
//    Revisions:
//       Version    | Author                   | Email                     | Remarks
//       1.0        | Dileep Miriyala          | m.dileep@gmail.com        | Initial Commit
//       _._        | <TODO>                   |   <TODO>                  | <TODO>
// </copyright>
//---------------------------------------------------------------------------------------------
var InitState: any = {
    Id: "Tamil",
    GameTable: {
        MaxOnTable: 16,
        MaxVowels: 8,
    },
    Cabinet: {
        Trays: [
            {
                Id: "Vowels",
                Title: "அச்சுலு",
                Show: true,
                Set:
                [
                    { "அ": 10 },
                    { "ஆ": 20 },
                    { "இ": 20 },
                    { "ஈ": 20 },
                    { "உ": 20 },
                    { "ஊ": 20 },
                    { "எ": 20 },
                    { "ஏ": 20 },
                    { "ஐ": 20 },
                    { "ஒ": 20 },
                    { "ஓ": 20 },
                    { "ஔ": 20 },
                    { "஋": 10 },
                    { "௠": 10 },
                    { "்ᾌ": 5 },
                    { "ம்": 5 },
                    { "ஃ": 5 }
                ]
            },
            {
                Id: "Consonants",
                Title: "ஹல்லுலு",
                Show: true,
                Set:
                [
                    { "க": 20 }, { "க": 5 }, { "க": 20 }, { "க": 5 }, { "ங": 5 },
                    { "ச": 20 }, { "ச": 10 }, { "ஜ": 20 }, { "ச": 5 }, { "ஞ": 5 },
                    { "ட": 20 }, { "ட": 5 }, { "ட": 20 }, { "ட": 5 }, { "ண": 5 },
                    { "த": 20 }, { "த": 5 }, { "த": 20 }, { "த": 10 }, { "ந": 5 },
                    { "ப": 20 }, { "ப": 5 }, { "ப": 20 }, { "ப": 20 }, { "ம": 20 },
                    { "ய": 20 }, { "ர": 20 }, { "ல": 20 }, { "வ": 20 },
                    { "ஶ": 20 }, { "ஷ": 20 }, { "ஸ": 20 }, { "ஹ": 20 },
                    { "ள": 20 }, { "ற": 20 },
                    { "க்ஷ": 5 }, { "மு": 20 },
                ]
            }
        ]
    },
    Board: {
        Size: 11,
        Weights: [
            6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6,
            1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 3, 1, 4, 1, 4, 1, 4, 1, 3, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            6, 3, 1, 4, 1, 8, 1, 4, 1, 3, 6,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 3, 1, 4, 1, 4, 1, 4, 1, 3, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1,
            6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6,
        ]
    }
};
var Configuration: any = {
    Language: "ta",
    FullSpecialSet: [
        "ா",
        "ி", "ீ",
        "ு", "ூ",
        "ிரு", "௄",
        "ெ", "ே",
        "ை",
        "ொ", "ோ",
        "ௌ", "்", "்ᾌ"// Including Virama,Virama+ZWJ
    ],
    SpecialSet: [
        "ா",
        "ி", "ீ",
        "ு", "ூ",
        "ிரு", "௄",
        "ெ", "ே",
        "ை",
        "ொ", "ோ",
        "ௌ" // Excluding Virama
    ],
    SunnaSet: ["ம்", "ஃ"],
    Vowels: [
        "அ", "ஆ",
        "இ", "ஈ",
        "உ", "ஊ",
        "எ", "ஏ", "ஐ",
        "ஒ", "ஓ", "ஔ",
        "஋", "௠"],
    Consonents: [
        "க", "க", "க", "க", "ங",
        "ச", "ச", "ஜ", "ச", "ஞ",
        "ட", "ட", "ட", "ட", "ண",
        "த", "த", "த", "த", "ந",
        "ப", "ப", "ப", "ப", "ம",
        "ய", "ர", "ல", "வ",
        "ஶ", "ஷ", "ஸ", "ஹ",
        "ள", "ற",
        "க்ஷ", "மு"],
    Virama: "்",
    Synonyms:
    {
        "ஆ": "ா",
        "இ": "ி",
        "ஈ": "ீ",
        "உ": "ு",
        "ஊ": "ூ",
        "஋": "ிரு",
        "௠": "௄",
        "எ": "ெ",
        "ஏ": "ே",
        "ஐ": "ை",
        "ஒ": "ொ",
        "ஓ": "ோ",
        "ஔ": "ௌ",
        "ா": "ஆ",
        "ி": "இ",
        "ீ": "ஈ",
        "ு": "உ",
        "ூ": "ஊ",
        "ிரு": "஋",
        "௄": "௠",
        "ெ": "எ",
        "ே": "ஏ",
        "ை": "ஐ",
        "ொ": "ஒ",
        "ோ": "ஓ",
        "ௌ": "ஔ"
    },
    Syllables: {
        "மு": ["ம", "ு"]
    },
    Messages:
    {
        InvalidMove: "'{0}' can't be combined with '{1}'",
        UseSynonym: "Attempting to use '{2}' instead of '{1}' with '{0}'.",
        Messages: "Messages",
        CrossCells: "All letters should be arranged either hariontally or vertically.",
        HasIslands: "Words are spreaded across islands.",
        HasOraphans: "Single Letter (Akshara) Words are not allowed.",
        OrphanCell: "Single Letter(Akshara) at position Harizontal: {2} Vertical: {0}",
        HasDupliates: "The word ('{0}') already exists on the board.",
        Claimed: "* Is a Claim"
    }
};
