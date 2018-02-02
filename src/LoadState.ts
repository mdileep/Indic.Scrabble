//---------------------------------------------------------------------------------------------
// <copyright file="LoadState.ts" company="Chandam-ఛందం">
//    Copyright © 2013 - 2018 'Chandam-ఛందం' : http://chandam.apphb.com
//    Original Author : Dileep Miriyala (m.dileep@gmail.com)
//    Last Updated    : 29-Jan-2018 21:53EST
//    Revisions:
//       Version    | Author                   | Email                     | Remarks
//       1.0        | Dileep Miriyala          | m.dileep@gmail.com        | Initial Commit
//       _._        | <TODO>                   |   <TODO>                  | <TODO>
// </copyright>
//---------------------------------------------------------------------------------------------
var LoadState: any = {
    Id: "Telugu",
    Language: "te",
    Cabinet: {
        Trays: [
            {
                Id: "Vowels",
                Title: "అచ్చులు",
                Count: 5,
                Show: true,
                Set:
                [
                    "అ", "ఆ",
                    "ఇ", "ఈ",
                    "ఉ", "ఊ",
                    "ఎ", "ఏ", "ఐ",
                    "ఒ", "ఓ", "ఔ",
                    "ఋ", "ౠ",
                    "్", "ం", "ః"]
            },
            {
                Id: "SuperScripts",
                Title: "గుణింతాలు",
                Count: 20,
                Show: false,
                Set: ["ా",
                    "ి", "ీ",
                    "ు", "ూ",
                    "ృ", "ౄ",
                    "ె", "ే",
                    "ై",
                    "ొ", "ో",
                    "ౌ"]
            },
            {
                Id: "Consonants",
                Title: "హల్లులు",
                Count: 5,
                Show: true,
                Set:
                ["క", "ఖ", "గ", "ఘ", "ఙ",
                    "చ", "ఛ", "జ", "ఝ", "ఞ",
                    "ట", "ఠ", "డ", "ఢ", "ణ",
                    "త", "థ", "ద", "ధ", "న",
                    "ప", "ఫ", "బ", "భ", "మ",
                    "య", "ర", "ల", "వ",
                    "శ", "ష", "స",
                    "హ", "ళ", "ఱ",
                    "క్ష"]
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
            6, 3, 1, 4, 1, 5, 1, 4, 1, 3, 6,
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
            { Name: "శర్వాణీ" },
            { Name: "శ్రీదీపిక" }
        ]
    },
    InfoBar: {}
};