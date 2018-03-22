//---------------------------------------------------------------------------------------------
// <copyright file="hi.config.ts" company="Chandam-छंदं">
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
    Id: "Hindi",
    GameTable: {
        MaxOnTable: 16,
        MaxVowels: 8,
    },
    Cabinet: {
        Trays: [
            {
                Id: "Vowels",
                Title: "अच्चुलु",
                Show: true,
                Set:
                    [
                        { "अ": 10 },
                        { "आ": 20 },
                        { "इ": 20 },
                        { "ई": 20 },
                        { "उ": 20 },
                        { "ऊ": 20 },
                        { "ऎ": 20 },
                        { "ए": 20 },
                        { "ऐ": 20 },
                        { "ऒ": 20 },
                        { "ओ": 20 },
                        { "औ": 20 },
                        { "ऋ": 10 },
                        { "ॠ": 10 },
                        { "्ᴌ": 5 },
                        { "ं": 5 },
                        { "ः": 5 }
                    ]
            },
            {
                Id: "Consonants",
                Title: "हल्लुलु",
                Show: true,
                Set:
                    [
                        { "क": 20 }, { "ख": 5 }, { "ग": 20 }, { "घ": 5 }, { "ङ": 5 },
                        { "च": 20 }, { "छ": 10 }, { "ज": 20 }, { "झ": 5 }, { "ञ": 5 },
                        { "ट": 20 }, { "ठ": 5 }, { "ड": 20 }, { "ढ": 5 }, { "ण": 5 },
                        { "त": 20 }, { "थ": 5 }, { "द": 20 }, { "ध": 10 }, { "न": 5 },
                        { "प": 20 }, { "फ": 5 }, { "ब": 20 }, { "भ": 20 }, { "म": 20 },
                        { "य": 20 }, { "र": 20 }, { "ल": 20 }, { "व": 20 },
                        { "श": 20 }, { "ष": 20 }, { "स": 20 }, { "ह": 20 },
                        { "ळ": 20 }, { "ऱ": 20 },
                        { "क्ष": 5 }
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
    },
    Players:
        {
            Players:
                [
                    { Name: "शर्वाणी" },
                    { Name: "श्रीदीपिक" }
                ]
        },
    InfoBar: {}
};
var Configuration: any = {
    Language: "hi",
    FullSpecialSet: [
        "ा",
        "ि", "ी",
        "ु", "ू",
        "ृ", "ॄ",
        "ॆ", "े",
        "ै",
        "ॊ", "ो",
        "ौ", "्", "्ᴌ"// Including Virama,Virama+ZWJ
    ],
    SpecialSet: [
        "ा",
        "ि", "ी",
        "ु", "ू",
        "ृ", "ॄ",
        "ॆ", "े",
        "ै",
        "ॊ", "ो",
        "ौ" // Excluding Virama
    ],
    SunnaSet: ["ं", "ः"],
    Vowels: [
        "अ", "आ",
        "इ", "ई",
        "उ", "ऊ",
        "ऎ", "ए", "ऐ",
        "ऒ", "ओ", "औ",
        "ऋ", "ॠ"],
    Consonents: [
        "क", "ख", "ग", "घ", "ङ",
        "च", "छ", "ज", "झ", "ञ",
        "ट", "ठ", "ड", "ढ", "ण",
        "त", "थ", "द", "ध", "न",
        "प", "फ", "ब", "भ", "म",
        "य", "र", "ल", "व",
        "श", "ष", "स", "ह",
        "ळ", "ऱ",
        "क्ष"],
    Virama: "्",
    Synonyms:
        {
            "आ": "ा",
            "इ": "ि",
            "ई": "ी",
            "उ": "ु",
            "ऊ": "ू",
            "ऋ": "ृ",
            "ॠ": "ॄ",
            "ऎ": "ॆ",
            "ए": "े",
            "ऐ": "ै",
            "ऒ": "ॊ",
            "ओ": "ो",
            "औ": "ौ",
            "ा": "आ",
            "ि": "इ",
            "ी": "ई",
            "ु": "उ",
            "ू": "ऊ",
            "ृ": "ऋ",
            "ॄ": "ॠ",
            "ॆ": "ऎ",
            "े": "ए",
            "ै": "ऐ",
            "ॊ": "ऒ",
            "ो": "ओ",
            "ौ": "औ"
        },
    Syllables: {
        "मु": ["म", "ु"]
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
