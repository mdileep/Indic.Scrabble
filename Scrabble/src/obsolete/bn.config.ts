//---------------------------------------------------------------------------------------------
// <copyright file="bn.config.ts" company="Chandam-ఛందం">
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
    Id: "Bengali",
    GameTable: {
        MaxOnTable: 16,
        MaxVowels: 8,
    },
    Cabinet: {
        Trays: [
            {
                Id: "Vowels",
                Title: "অচ্চুলু",
                Show: true,
                Set:
                [
                    { "অ": 10 },
                    { "আ": 20 },
                    { "ই": 20 },
                    { "ঈ": 20 },
                    { "উ": 20 },
                    { "ঊ": 20 },
                    { "঎": 20 },
                    { "এ": 20 },
                    { "ঐ": 20 },
                    { "঒": 20 },
                    { "ও": 20 },
                    { "ঔ": 20 },
                    { "ঋ": 10 },
                    { "ৠ": 10 },
                    { "্ᶌ": 5 },
                    { "ং": 5 },
                    { "ঃ": 5 }
                ]
            },
            {
                Id: "Consonants",
                Title: "হল্লুলু",
                Show: true,
                Set:
                [
                    { "ক": 20 }, { "খ": 5 }, { "গ": 20 }, { "ঘ": 5 }, { "ঙ": 5 },
                    { "চ": 20 }, { "ছ": 10 }, { "জ": 20 }, { "ঝ": 5 }, { "ঞ": 5 },
                    { "ট": 20 }, { "ঠ": 5 }, { "ড": 20 }, { "ঢ": 5 }, { "ণ": 5 },
                    { "ত": 20 }, { "থ": 5 }, { "দ": 20 }, { "ধ": 10 }, { "ন": 5 },
                    { "প": 20 }, { "ফ": 5 }, { "ব": 20 }, { "ভ": 20 }, { "ম": 20 },
                    { "য": 20 }, { "র": 20 }, { "ল": 20 }, { "঵": 20 },
                    { "শ": 20 }, { "ষ": 20 }, { "স": 20 }, { "হ": 20 },
                    { "঳": 20 }, { "঱": 20 },
                    { "ক্ষ": 5 }, { "মু": 20 },
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
    Language: "bn",
    FullSpecialSet: [
        "া",
        "ি", "ী",
        "ু", "ূ",
        "ৃ", "ৄ",
        "৆", "ে",
        "ৈ",
        "৊", "ো",
        "ৌ", "্", "্ᶌ"// Including Virama,Virama+ZWJ
    ],
    SpecialSet: [
        "া",
        "ি", "ী",
        "ু", "ূ",
        "ৃ", "ৄ",
        "৆", "ে",
        "ৈ",
        "৊", "ো",
        "ৌ" // Excluding Virama
    ],
    SunnaSet: ["ং", "ঃ"],
    Vowels: [
        "অ", "আ",
        "ই", "ঈ",
        "উ", "ঊ",
        "঎", "এ", "ঐ",
        "঒", "ও", "ঔ",
        "ঋ", "ৠ"],
    Consonents: [
        "ক", "খ", "গ", "ঘ", "ঙ",
        "চ", "ছ", "জ", "ঝ", "ঞ",
        "ট", "ঠ", "ড", "ঢ", "ণ",
        "ত", "থ", "দ", "ধ", "ন",
        "প", "ফ", "ব", "ভ", "ম",
        "য", "র", "ল", "঵",
        "শ", "ষ", "স", "হ",
        "঳", "঱",
        "ক্ষ", "মু"],
    Virama: "্",
    Synonyms:
    {
        "আ": "া",
        "ই": "ি",
        "ঈ": "ী",
        "উ": "ু",
        "ঊ": "ূ",
        "ঋ": "ৃ",
        "ৠ": "ৄ",
        "঎": "৆",
        "এ": "ে",
        "ঐ": "ৈ",
        "঒": "৊",
        "ও": "ো",
        "ঔ": "ৌ",
        "া": "আ",
        "ি": "ই",
        "ী": "ঈ",
        "ু": "উ",
        "ূ": "ঊ",
        "ৃ": "ঋ",
        "ৄ": "ৠ",
        "৆": "঎",
        "ে": "এ",
        "ৈ": "ঐ",
        "৊": "঒",
        "ো": "ও",
        "ৌ": "ঔ"
    },
    Syllables: {
        "মু": ["ম", "ু"]
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
