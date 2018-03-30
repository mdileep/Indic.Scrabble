define(["require", "exports", 'AksharaSets'], function (require, exports, AS) {
    "use strict";
    var Indic = (function () {
        function Indic() {
        }
        Indic.IsValid = function (original) {
            var arr = Indic.ToChars(original);
            if (arr.length == 1 && Indic.IsFullSpecialSet(arr[0])) {
                return false;
            }
            var special = 0;
            var conso = 0;
            var vowel = 0;
            var sunnaSet = 0;
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
        };
        Indic.ToString = function (original) {
            var res = "";
            var pending = "";
            var sunna = "";
            var isConso = false;
            var arr = Indic.ToChars(original);
            for (var i = 0; i < arr.length; i++) {
                if (Indic.IsFullSpecialSet(arr[i])) {
                    pending = arr[i];
                    continue;
                }
                if (Indic.IsSunnaSet(arr[i])) {
                    sunna = arr[i];
                    continue;
                }
                var isCurrConso = Indic.IsConsonent(arr[i]);
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
        };
        Indic.Contains = function (arr, char) {
            var index = arr.indexOf(char);
            return index >= 0;
        };
        Indic.IsVowel = function (char) {
            return Indic.Contains(AS.AksharaSets.Vowels, char);
        };
        Indic.IsConsonent = function (char) {
            return Indic.Contains(AS.AksharaSets.Consonents, char);
        };
        Indic.IsSpecialSet = function (char) {
            return Indic.Contains(AS.AksharaSets.SpecialSet, char);
        };
        Indic.IsFullSpecialSet = function (char) {
            return Indic.Contains(AS.AksharaSets.FullSpecialSet, char);
        };
        Indic.IsSunnaSet = function (char) {
            return Indic.Contains(AS.AksharaSets.SunnaSet, char);
        };
        Indic.IsSpecialSyllable = function (char) {
            return AS.AksharaSets.SyllableChars[char] != null;
        };
        Indic.GetSyllableChars = function (char) {
            return AS.AksharaSets.SyllableChars[char];
        };
        Indic.GetSyllableTiles = function (char) {
            return AS.AksharaSets.SyllableTiles[char];
        };
        Indic.GetSyllableSynonym = function (char) {
            return AS.AksharaSets.SyllableSynonym[char];
        };
        Indic.HasSyllableSynonym = function (char) {
            return AS.AksharaSets.SyllableSynonym[char] != null;
        };
        Indic.GetSynonym = function (akshara) {
            return AS.AksharaSets.Synonyms[akshara];
        };
        Indic.GetSynonyms = function () {
            return AS.AksharaSets.Synonyms;
        };
        Indic.ToChars = function (original) {
            var arr = [];
            for (var key in original) {
                var char = original[key];
                if (Indic.IsSpecialSyllable(char)) {
                    var set = Indic.GetSyllableChars(char);
                    arr = arr.concat(set);
                    continue;
                }
                arr.push(char);
            }
            return arr;
        };
        return Indic;
    }());
    exports.Indic = Indic;
});
