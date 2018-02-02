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

export class Messages {
    public static InvalidMove: string = "'{0}' ను '{1}' తో కలపడం సాధ్యంకాదు.";
    public static UseSynonym: string = " '{1}' కు బదులుగా '{2}' తో '{0}' ను కలపడానికి ప్రయత్నం చేస్తున్నాం.";
    public static Messages: string = "సందేశాలు";
    public static CrossCells: string = "అన్నీ ఒకే నిలువు లేదా అడ్డం గడులలో మాత్రమే ఉండాలి.";
    public static HasIslands: string = "పదాలు వేరువేరు లంకలలో విస్తరించి ఉన్నాయి.";
    public static HasOraphans: string = "ఏకాక్షరపదాలు అంగీకారం కావు.";
    public static OrphanCell: string = "ఏకాక్షరము {2} అడ్డం: {0} నిలువు:{1} వద్ధ ఉన్నది ";
}
export class AksharaSets {
    public static FullSpecialSet: string[] = [
        "ా",
        "ి", "ీ",
        "ు", "ూ",
        "ృ", "ౄ",
        "ె", "ే",
        "ై",
        "ొ", "ో",
        "ౌ", "్",// Including Virama
        "ం", "ః"];
    public static SpecialSet: string[] = [
        "ా",
        "ి", "ీ",
        "ు", "ూ",
        "ృ", "ౄ",
        "ె", "ే",
        "ై",
        "ొ", "ో",
        "ౌ", // Excluding Virama
        "ం", "ః"];
    public static SunnaSet: string[] = ["ం", "ః"];
    public static Vowels: string[] = [
        "అ", "ఆ",
        "ఇ", "ఈ",
        "ఉ", "ఊ",
        "ఎ", "ఏ", "ఐ",
        "ఒ", "ఓ", "ఔ",
        "ఋ", "ౠ"];
    public static Consonents = [
        "క", "ఖ", "గ", "ఘ", "ఙ",
        "చ", "ఛ", "జ", "ఝ", "ఞ",
        "ట", "ఠ", "డ", "ఢ", "ణ",
        "త", "థ", "ద", "ధ", "న",
        "ప", "ఫ", "బ", "భ", "మ",
        "య", "ర", "ల", "వ",
        "శ", "ష", "స",
        "హ", "ళ", "ఱ",
        "క్ష"];
    public static Virama: string = "్";
    public static Synonyms: any =
    {
        "ఆ": "ా",
        "ఇ": "ి",
        "ఈ": "ీ",
        "ఉ": "ు",
        "ఊ": "ూ",
        "ఋ": "ృ",
        "ౠ": "ౄ",
        "ఎ": "ె",
        "ఏ": "ే",
        "ఐ": "ై",
        "ఒ": "ొ",
        "ఓ": "ో",
        "ఔ": "ౌ",
        "ా": "ఆ",
        "ి": "ఇ",
        "ీ": "ఈ",
        "ు": "ఉ",
        "ూ": "ఊ",
        "ృ": "ఋ",
        "ౄ": "ౠ",
        "ె": "ఎ",
        "ే": "ఏ",
        "ై": "ఐ",
        "ొ": "ఒ",
        "ో": "ఓ",
        "ౌ": "ఔ"
    };
}
export class Util {
    public static Format(s: string, args: any): string {
        var formatted = s;
        for (var arg in args) {
            formatted = formatted.replace("{" + arg + "}", args[arg]);
        }
        return formatted;
    }
    public static Merge(...args: any[]): any {
        var resObj = {} as any;
        for (var i = 0; i < arguments.length; i += 1) {
            var obj = arguments[i],
                keys = Object.keys(obj);
            for (var j = 0; j < keys.length; j += 1) {
                resObj[keys[j]] = obj[keys[j]];
            }
        }
        return resObj;
    }
}
export class Indic {
    public static IsValid(arr: string[]): boolean {
        //Tobe improved.
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
                if (Indic.IsSunnaSet(arr[i])) {
                    sunnaSet++;
                }
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
        if (vowel > 0 && special > 0 && (sunnaSet != special)) {
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
    public static Merge(arr: string[]): string {
        var res = "";
        var pending = "";
        var isConso: boolean = false;

        for (var i = 0; i < arr.length; i++) {
            if (Indic.IsFullSpecialSet(arr[i])) {
                pending = arr[i];
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
        res = res + pending;
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
    public static IsFullSpecialSet(char: string): boolean {
        return Indic.Contains(AksharaSets.FullSpecialSet, char);
    }
    public static IsSunnaSet(char: string): boolean {
        return Indic.Contains(AksharaSets.SunnaSet, char);
    }
    public static GetSynonym(akshara: string): string {
        return AksharaSets.Synonyms[akshara];
    }
}