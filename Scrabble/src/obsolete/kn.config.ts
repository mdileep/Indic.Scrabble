//---------------------------------------------------------------------------------------------
// <copyright file="kn.config.ts" company="Chandam-ఛందం">
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
    Id: "Kannada",
    GameTable: {
        MaxOnTable: 16,
        MaxVowels: 8,
    },
    Cabinet: {
        Trays: [
            {
                Id: "Vowels",
                Title: "ಅಚ್ಚುಲು",
                Show: true,
                Set:
                    [
                        { "ಅ": 10 },
                        { "ಆ": 20 },
                        { "ಇ": 20 },
                        { "ಈ": 20 },
                        { "ಉ": 20 },
                        { "ಊ": 20 },
                        { "ಎ": 20 },
                        { "ಏ": 20 },
                        { "ಐ": 20 },
                        { "ಒ": 20 },
                        { "ಓ": 20 },
                        { "ಔ": 20 },
                        { "ಋ": 10 },
                        { "ೠ": 10 },
                        { "್₌": 5 },
                        { "ಂ": 5 },
                        { "ಃ": 5 }
                    ]
            },
            {
                Id: "Consonants",
                Title: "ಹಲ್ಲುಲು",
                Show: true,
                Set:
                    [
                        { "ಕ": 20 }, { "ಖ": 5 }, { "ಗ": 20 }, { "ಘ": 5 }, { "ಙ": 5 },
                        { "ಚ": 20 }, { "ಛ": 10 }, { "ಜ": 20 }, { "ಝ": 5 }, { "ಞ": 5 },
                        { "ಟ": 20 }, { "ಠ": 5 }, { "ಡ": 20 }, { "ಢ": 5 }, { "ಣ": 5 },
                        { "ತ": 20 }, { "ಥ": 5 }, { "ದ": 20 }, { "ಧ": 10 }, { "ನ": 5 },
                        { "ಪ": 20 }, { "ಫ": 5 }, { "ಬ": 20 }, { "ಭ": 20 }, { "ಮ": 20 },
                        { "ಯ": 20 }, { "ರ": 20 }, { "ಲ": 20 }, { "ವ": 20 },
                        { "ಶ": 20 }, { "ಷ": 20 }, { "ಸ": 20 }, { "ಹ": 20 },
                        { "ಳ": 20 }, { "ಱ": 20 },
                        { "ಕ್ಷ": 5 }
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
    Language: "kn",
    FullSpecialSet: [
        "ಾ",
        "ಿ", "ೀ",
        "ು", "ೂ",
        "ೃ", "ೄ",
        "ೆ", "ೇ",
        "ೈ",
        "ೊ", "ೋ",
        "ೌ", "್", "್₌"// Including Virama,Virama+ZWJ
    ],
    SpecialSet: [
        "ಾ",
        "ಿ", "ೀ",
        "ು", "ೂ",
        "ೃ", "ೄ",
        "ೆ", "ೇ",
        "ೈ",
        "ೊ", "ೋ",
        "ೌ" // Excluding Virama
    ],
    SunnaSet: ["ಂ", "ಃ"],
    Vowels: [
        "ಅ", "ಆ",
        "ಇ", "ಈ",
        "ಉ", "ಊ",
        "ಎ", "ಏ", "ಐ",
        "ಒ", "ಓ", "ಔ",
        "ಋ", "ೠ"],
    Consonents: [
        "ಕ", "ಖ", "ಗ", "ಘ", "ಙ",
        "ಚ", "ಛ", "ಜ", "ಝ", "ಞ",
        "ಟ", "ಠ", "ಡ", "ಢ", "ಣ",
        "ತ", "ಥ", "ದ", "ಧ", "ನ",
        "ಪ", "ಫ", "ಬ", "ಭ", "ಮ",
        "ಯ", "ರ", "ಲ", "ವ",
        "ಶ", "ಷ", "ಸ", "ಹ",
        "ಳ", "ಱ",
        "ಕ್ಷ"],
    Virama: "್",
    Synonyms:
        {
            "ಆ": "ಾ",
            "ಇ": "ಿ",
            "ಈ": "ೀ",
            "ಉ": "ು",
            "ಊ": "ೂ",
            "ಋ": "ೃ",
            "ೠ": "ೄ",
            "ಎ": "ೆ",
            "ಏ": "ೇ",
            "ಐ": "ೈ",
            "ಒ": "ೊ",
            "ಓ": "ೋ",
            "ಔ": "ೌ",
            "ಾ": "ಆ",
            "ಿ": "ಇ",
            "ೀ": "ಈ",
            "ು": "ಉ",
            "ೂ": "ಊ",
            "ೃ": "ಋ",
            "ೄ": "ೠ",
            "ೆ": "ಎ",
            "ೇ": "ಏ",
            "ೈ": "ಐ",
            "ೊ": "ಒ",
            "ೋ": "ಓ",
            "ೌ": "ಔ"
        },
    Syllables: {
        "ಮು": ["ಮ", "ು"]
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
