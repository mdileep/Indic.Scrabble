//---------------------------------------------------------------------------------------------
// <copyright file="Indic.ts" company="Chandam-ఛందం">
//    Copyright © 2013 - 2018 'Chandam-ఛందం' : http://chandam.apphb.com
//    Original Author : Dileep Miriyala (m.dileep@gmail.com)
//    Last Updated    : 29-Jan-2018 21:53EST
//    Revisions:
//       Version    | Author                   | Email                     | Remarks
//       1.0        | Dileep Miriyala          | m.dileep@gmail.com        | Initial Commit
//       _._        | <TODO>                   |   <TODO>                  | <TODO>
// </copyright>
//---------------------------------------------------------------------------------------------

export class AksharaSets {
    public static FullSpecialSet: string[] = [];
    public static SpecialSet: string[] = [];
    public static SunnaSet: string[] = [];
    public static Vowels: string[] = [];
    public static Consonents: string[] = [];
    public static Virama: string = "";
    public static Synonyms: any = {};
    public static SyllableTiles: any = {};
    public static SyllableChars: any = {};
    public static SyllableSynonym: any = {};
}

export class Indic {
    public static ToWord(Cells: string[]): string {
        var res = "";
        for (var indx in Cells) {
            var cell = Cells[indx];
            var tiles = cell.split('');
            if (tiles.length == 1) {
                res = res + Indic.ToString(tiles);
                continue;
            }
            if (tiles.length == 2 && Indic.IsSunnaSet(tiles[1])) {
                res = res + Indic.ToString(tiles);
                continue;
            }
            for (var indx2 in tiles) {
                var tile = tiles[indx2];
                var alt = Indic.GetSynonym(tile);
                if (alt != null) {
                    tiles[indx2] = alt;
                }
            }
            res = res + Indic.ToString(tiles);
        }
        return res;
    }
    public static ToScrabble(word: string): string {
        //Expecting to have Syllables seperated by comma
        //To Extract Syllables from general
        var res: string = "";
        var Syllables: string[] = word.split(',');
        for (var indx in Syllables) {
            var Syllable: string = Syllables[indx];
            var s = "";
            for (var i = 0; i < Syllable.length; i++) {
                var C = Syllable[i];

                if (Indic.IsVirama(C)) {
                    if (i == Syllable.length - 1) {
                        s = s + C;
                    }
                    continue;
                }

                if (Indic.IsZWNJ(C)) {
                    continue;
                }

                if (C.length == 0) {
                    continue;
                }
                if (Indic.IsSpecialSet(C)) {
                    s = s + Indic.GetSynonym(C);
                }
                else {
                    s = s + C;
                }
            }
            res = res + s + ",";
        }
        res = res.TrimEnd(',');
        res = res.TrimStart(',');
        res = res.Replace(",,", ",");
        return res;
    }
    public static IsValid(original: string[]): boolean {
        var arr: string[] = Indic.ToChars(original);
        if (arr.length == 1 && Indic.IsFullSpecialSet(arr[0])) {
            return false;
        }
        if (arr.length == 1 && Indic.IsSunnaSet(arr[0])) {
            return false;
        }
        var special: number = 0;
        var conso: number = 0;
        var vowel: number = 0;
        var sunnaSet: number = 0;
        for (var i = 0; i < arr.length; i++) {
            if (Indic.IsFullSpecialSet(arr[i])) {
                special++;
                continue;
            }

            if (Indic.IsSunnaSet(arr[i])) {
                sunnaSet++;
                continue;
            }
            if (Indic.IsConsonent(arr[i])) {
                conso++;
                continue;
            }
            if (Indic.IsVowel(arr[i])) {
                vowel++;
                continue;
            }
        }
        if (conso > 0 && vowel > 0) {
            return false;
        }
        if (vowel > 0 && special > 0) {
            return false;
        }
        if (sunnaSet > 1) {
            return false;
        }
        if (vowel > 1) {
            return false;
        }
        if (special > 1) {
            return false;
        }
        return true;
    }
    public static ToString(original: string[]): string {
        var res = "";
        var pending = "";
        var sunna = "";
        var isConso: boolean = false;
        var arr: string[] = Indic.ToChars(original);
        for (var i = 0; i < arr.length; i++) {
            if (Indic.IsFullSpecialSet(arr[i])) {
                pending = arr[i];
                continue;
            }
            if (Indic.IsSunnaSet(arr[i])) {
                sunna = arr[i];
                continue;
            }
            var isCurrConso: boolean = Indic.IsConsonent(arr[i]);
            if (isConso && isCurrConso) {
                res = res + AksharaSets.Virama + arr[i];
            }
            else {
                res = res + arr[i];
            }
            isConso = isCurrConso;
        }
        res = res + pending + sunna;
        return res;
    }
    public static Contains(arr: string[], char: string): boolean {
        var index: number = arr.indexOf(char);
        return index >= 0;
    }
    public static IsVowel(char: string): boolean {
        return Indic.Contains(AksharaSets.Vowels, char);
    }
    public static IsConsonent(char: string): boolean {
        return Indic.Contains(AksharaSets.Consonents, char);
    }
    public static IsSpecialSet(char: string): boolean {
        return Indic.Contains(AksharaSets.SpecialSet, char);
    }
    public static IsZWNJ(char: string): boolean {
        return char == String.fromCharCode(0x200C);
    }
    public static IsVirama(char: string): boolean {
        return char == AksharaSets.Virama;
    }
    public static IsFullSpecialSet(char: string): boolean {
        return Indic.Contains(AksharaSets.FullSpecialSet, char);
    }
    public static IsSunnaSet(char: string): boolean {
        return Indic.Contains(AksharaSets.SunnaSet, char);
    }
    public static IsSpecialSyllable(char: string): boolean {
        return AksharaSets.SyllableChars[char] != null;
    }
    public static GetSyllableChars(char: string): string[] {
        return AksharaSets.SyllableChars[char];
    }
    public static GetSyllableTiles(char: string): string[] {
        return AksharaSets.SyllableTiles[char];
    }
    public static GetSyllableSynonym(char: string): string {
        return AksharaSets.SyllableSynonym[char];
    }
    public static HasSyllableSynonym(char: string): boolean {
        return AksharaSets.SyllableSynonym[char] != null;
    }
    public static GetSynonym(akshara: string): string {
        return AksharaSets.Synonyms[akshara];
    }
    public static GetSynonyms(): any {
        return AksharaSets.Synonyms;
    }
    public static ToChars(original: string[]): string[] {
        var arr: string[] = [];
        for (var key in original) {
            var char = original[key];
            if (Indic.IsSpecialSyllable(char)) {
                var set: string[] = Indic.GetSyllableChars(char);
                arr = arr.concat(set);
                continue;
            }
            arr.push(char);
        }
        return arr;
    }
}

