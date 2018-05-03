//---------------------------------------------------------------------------------------------
// <copyright file="ml.config.ts" company="Chandam-ఛందం">
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
    Id: "Malayalam",
    GameTable: {
        MaxOnTable: 16,
        MaxVowels: 8,
    },
    Cabinet: {
        Trays: [
            {
                Id: "Vowels",
                Title: "അച്ചുലു",
                Show: true,
                Set:
                [
                    { "അ": 10 },
                    { "ആ": 20 },
                    { "ഇ": 20 },
                    { "ഈ": 20 },
                    { "ഉ": 20 },
                    { "ഊ": 20 },
                    { "എ": 20 },
                    { "ഏ": 20 },
                    { "ഐ": 20 },
                    { "ഒ": 20 },
                    { "ഓ": 20 },
                    { "ഔ": 20 },
                    { "ഋ": 10 },
                    { "ൠ": 10 },
                    { "്ℌ": 5 },
                    { "ം": 5 },
                    { "ഃ": 5 }
                ]
            },
            {
                Id: "Consonants",
                Title: "ഹല്ലുലു",
                Show: true,
                Set:
                [
                    { "ക": 20 }, { "ഖ": 5 }, { "ഗ": 20 }, { "ഘ": 5 }, { "ങ": 5 },
                    { "ച": 20 }, { "ഛ": 10 }, { "ജ": 20 }, { "ഝ": 5 }, { "ഞ": 5 },
                    { "ട": 20 }, { "ഠ": 5 }, { "ഡ": 20 }, { "ഢ": 5 }, { "ണ": 5 },
                    { "ത": 20 }, { "ഥ": 5 }, { "ദ": 20 }, { "ധ": 10 }, { "ന": 5 },
                    { "പ": 20 }, { "ഫ": 5 }, { "ബ": 20 }, { "ഭ": 20 }, { "മ": 20 },
                    { "യ": 20 }, { "ര": 20 }, { "ല": 20 }, { "വ": 20 },
                    { "ശ": 20 }, { "ഷ": 20 }, { "സ": 20 }, { "ഹ": 20 },
                    { "ള": 20 }, { "റ": 20 },
                    { "ക്ഷ": 5 }, { "മു": 20 },
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
    Language: "ml",
    FullSpecialSet: [
        "ാ",
        "ി", "ീ",
        "ു", "ൂ",
        "ൃ", "ൄ",
        "െ", "േ",
        "ൈ",
        "ൊ", "ോ",
        "ൌ", "്", "്ℌ"// Including Virama,Virama+ZWJ
    ],
    SpecialSet: [
        "ാ",
        "ി", "ീ",
        "ു", "ൂ",
        "ൃ", "ൄ",
        "െ", "േ",
        "ൈ",
        "ൊ", "ോ",
        "ൌ" // Excluding Virama
    ],
    SunnaSet: ["ം", "ഃ"],
    Vowels: [
        "അ", "ആ",
        "ഇ", "ഈ",
        "ഉ", "ഊ",
        "എ", "ഏ", "ഐ",
        "ഒ", "ഓ", "ഔ",
        "ഋ", "ൠ"],
    Consonents: [
        "ക", "ഖ", "ഗ", "ഘ", "ങ",
        "ച", "ഛ", "ജ", "ഝ", "ഞ",
        "ട", "ഠ", "ഡ", "ഢ", "ണ",
        "ത", "ഥ", "ദ", "ധ", "ന",
        "പ", "ഫ", "ബ", "ഭ", "മ",
        "യ", "ര", "ല", "വ",
        "ശ", "ഷ", "സ", "ഹ",
        "ള", "റ",
        "ക്ഷ", "മു"],
    Virama: "്",
    Synonyms:
    {
        "ആ": "ാ",
        "ഇ": "ി",
        "ഈ": "ീ",
        "ഉ": "ു",
        "ഊ": "ൂ",
        "ഋ": "ൃ",
        "ൠ": "ൄ",
        "എ": "െ",
        "ഏ": "േ",
        "ഐ": "ൈ",
        "ഒ": "ൊ",
        "ഓ": "ോ",
        "ഔ": "ൌ",
        "ാ": "ആ",
        "ി": "ഇ",
        "ീ": "ഈ",
        "ു": "ഉ",
        "ൂ": "ഊ",
        "ൃ": "ഋ",
        "ൄ": "ൠ",
        "െ": "എ",
        "േ": "ഏ",
        "ൈ": "ഐ",
        "ൊ": "ഒ",
        "ോ": "ഓ",
        "ൌ": "ഔ"
    },
    Syllables: {
        "മു": ["മ", "ു"]
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
