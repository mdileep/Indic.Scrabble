//---------------------------------------------------------------------------------------------
// <copyright file="gu.config.ts" company="Chandam-ఛందం">
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
    Id: "Gujarati",
    GameTable: {
        MaxOnTable: 16,
        MaxVowels: 8,
    },
    Cabinet: {
        Trays: [
            {
                Id: "Vowels",
                Title: "અચ્ચુલુ",
                Show: true,
                Set:
                [
                    { "અ": 10 },
                    { "આ": 20 },
                    { "ઇ": 20 },
                    { "ઈ": 20 },
                    { "ઉ": 20 },
                    { "ઊ": 20 },
                    { "઎": 20 },
                    { "એ": 20 },
                    { "ઐ": 20 },
                    { "઒": 20 },
                    { "ઓ": 20 },
                    { "ઔ": 20 },
                    { "ઋ": 10 },
                    { "ૠ": 10 },
                    { "્Ẍ": 5 },
                    { "ં": 5 },
                    { "ઃ": 5 }
                ]
            },
            {
                Id: "Consonants",
                Title: "હલ્લુલુ",
                Show: true,
                Set:
                [
                    { "ક": 20 }, { "ખ": 5 }, { "ગ": 20 }, { "ઘ": 5 }, { "ઙ": 5 },
                    { "ચ": 20 }, { "છ": 10 }, { "જ": 20 }, { "ઝ": 5 }, { "ઞ": 5 },
                    { "ટ": 20 }, { "ઠ": 5 }, { "ડ": 20 }, { "ઢ": 5 }, { "ણ": 5 },
                    { "ત": 20 }, { "થ": 5 }, { "દ": 20 }, { "ધ": 10 }, { "ન": 5 },
                    { "પ": 20 }, { "ફ": 5 }, { "બ": 20 }, { "ભ": 20 }, { "મ": 20 },
                    { "ય": 20 }, { "ર": 20 }, { "લ": 20 }, { "વ": 20 },
                    { "શ": 20 }, { "ષ": 20 }, { "સ": 20 }, { "હ": 20 },
                    { "ળ": 20 }, { "઱": 20 },
                    { "ક્ષ": 5 }, { "મુ": 20 },
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
            { Name: "શર્વાણી" },
            { Name: "શ્રીદીપિક" }
        ]
    },
    InfoBar: {}
};
var Configuration: any = {
    Language: "gu",
    FullSpecialSet: [
        "ા",
        "િ", "ી",
        "ુ", "ૂ",
        "ૃ", "ૄ",
        "૆", "ે",
        "ૈ",
        "૊", "ો",
        "ૌ", "્", "્Ẍ"// Including Virama,Virama+ZWJ
    ],
    SpecialSet: [
        "ા",
        "િ", "ી",
        "ુ", "ૂ",
        "ૃ", "ૄ",
        "૆", "ે",
        "ૈ",
        "૊", "ો",
        "ૌ" // Excluding Virama
    ],
    SunnaSet: ["ં", "ઃ"],
    Vowels: [
        "અ", "આ",
        "ઇ", "ઈ",
        "ઉ", "ઊ",
        "઎", "એ", "ઐ",
        "઒", "ઓ", "ઔ",
        "ઋ", "ૠ"],
    Consonents: [
        "ક", "ખ", "ગ", "ઘ", "ઙ",
        "ચ", "છ", "જ", "ઝ", "ઞ",
        "ટ", "ઠ", "ડ", "ઢ", "ણ",
        "ત", "થ", "દ", "ધ", "ન",
        "પ", "ફ", "બ", "ભ", "મ",
        "ય", "ર", "લ", "વ",
        "શ", "ષ", "સ", "હ",
        "ળ", "઱",
        "ક્ષ", "મુ"],
    Virama: "્",
    Synonyms:
    {
        "આ": "ા",
        "ઇ": "િ",
        "ઈ": "ી",
        "ઉ": "ુ",
        "ઊ": "ૂ",
        "ઋ": "ૃ",
        "ૠ": "ૄ",
        "઎": "૆",
        "એ": "ે",
        "ઐ": "ૈ",
        "઒": "૊",
        "ઓ": "ો",
        "ઔ": "ૌ",
        "ા": "આ",
        "િ": "ઇ",
        "ી": "ઈ",
        "ુ": "ઉ",
        "ૂ": "ઊ",
        "ૃ": "ઋ",
        "ૄ": "ૠ",
        "૆": "઎",
        "ે": "એ",
        "ૈ": "ઐ",
        "૊": "઒",
        "ો": "ઓ",
        "ૌ": "ઔ"
    },
    Syllables: {
        "મુ": ["મ", "ુ"]
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
