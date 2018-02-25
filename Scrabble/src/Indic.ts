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
import * as AS from 'AksharaSets';

export class Indic {
    public static IsValid(original: string[]): boolean {
        var arr: string[] = Indic.ToChars(original);
        if (arr.length == 1 && Indic.IsFullSpecialSet(arr[0])) {
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
                res = res + AS.AksharaSets.Virama + arr[i];
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
        return Indic.Contains(AS.AksharaSets.Vowels, char);
    }
    public static IsConsonent(char: string): boolean {
        return Indic.Contains(AS.AksharaSets.Consonents, char);
    }
    public static IsSpecialSet(char: string): boolean {
        return Indic.Contains(AS.AksharaSets.SpecialSet, char);
    }
    public static IsFullSpecialSet(char: string): boolean {
        return Indic.Contains(AS.AksharaSets.FullSpecialSet, char);
    }
    public static IsSunnaSet(char: string): boolean {
        return Indic.Contains(AS.AksharaSets.SunnaSet, char);
    }
    public static IsSpecialSyllable(char: string): boolean {
        return AS.AksharaSets.Syllables[char] != null;
    }
    public static GetSyllables(char: string): string[] {
        return AS.AksharaSets.Syllables[char];
    }
    public static GetSynonym(akshara: string): string {
        return AS.AksharaSets.Synonyms[akshara];
    }
    public static GetSynonyms(): any {
        return AS.AksharaSets.Synonyms;
    }
    public static ToChars(original: string[]): string[] {
        var arr: string[] = [];
        for (var key in original) {
            var char = original[key];
            if (Indic.IsSpecialSyllable(char)) {
                var set: string[] = Indic.GetSyllables(char);
                arr = arr.concat(set);
                continue;
            }
            arr.push(char);
        }
        return arr;
    }
}
