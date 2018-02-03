define(["require", "exports", 'AksharaSets'], function (require, exports, AS) {
    "use strict";
    var Indic = (function () {
        function Indic() {
        }
        Indic.IsValid = function (arr) {
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
        Indic.ToString = function (arr) {
            var res = "";
            var pending = "";
            var sunna = "";
            var isConso = false;
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
        Indic.GetSynonym = function (akshara) {
            return AS.AksharaSets.Synonyms[akshara];
        };
        Indic.GetSynonyms = function () {
            return AS.AksharaSets.Synonyms;
        };
        return Indic;
    }());
    exports.Indic = Indic;
});
