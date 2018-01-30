define(["require", "exports"], function (require, exports) {
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
        };
        Indic.Merge = function (arr) {
            var res = "";
            var pending = "";
            var isConso = false;
            for (var i = 0; i < arr.length; i++) {
                if (Indic.IsFullSpecialSet(arr[i])) {
                    pending = arr[i];
                    continue;
                }
                var isCurrConso = Indic.IsConsonent(arr[i]);
                if (isConso && isCurrConso) {
                    res = res + Indic.Virama + arr[i];
                }
                else {
                    res = res + arr[i];
                }
                isConso = isCurrConso;
            }
            res = res + pending;
            return res;
        };
        Indic.Contains = function (arr, char) {
            var index = arr.indexOf(char);
            return index >= 0;
        };
        Indic.IsVowel = function (char) {
            return Indic.Contains(Indic.Vowels, char);
        };
        Indic.IsConsonent = function (char) {
            return Indic.Contains(Indic.Consonents, char);
        };
        Indic.IsSpecialSet = function (char) {
            return Indic.Contains(Indic.SpecialSet, char);
        };
        Indic.IsFullSpecialSet = function (char) {
            return Indic.Contains(Indic.FullSpecialSet, char);
        };
        Indic.IsSunnaSet = function (char) {
            return Indic.Contains(Indic.SunnaSet, char);
        };
        Indic.FullSpecialSet = [
            "ా",
            "ి", "ీ",
            "ు", "ూ",
            "ృ", "ౄ",
            "ె", "ే",
            "ై",
            "ొ", "ో",
            "ౌ", "్",
            "ం", "ః"];
        Indic.SpecialSet = [
            "ా",
            "ి", "ీ",
            "ు", "ూ",
            "ృ", "ౄ",
            "ె", "ే",
            "ై",
            "ొ", "ో",
            "ౌ",
            "ం", "ః"];
        Indic.SunnaSet = ["ం", "ః"];
        Indic.Vowels = [
            "అ", "ఆ",
            "ఇ", "ఈ",
            "ఉ", "ఊ",
            "ఎ", "ఏ", "ఐ",
            "ఒ", "ఓ", "ఔ",
            "ఋ", "ౠ"];
        Indic.Consonents = [
            "క", "ఖ", "గ", "ఘ", "ఙ",
            "చ", "ఛ", "జ", "ఝ", "ఞ",
            "ట", "ఠ", "డ", "ఢ", "ణ",
            "త", "థ", "ద", "ధ", "న",
            "ప", "ఫ", "బ", "భ", "మ",
            "య", "ర", "ల", "వ",
            "శ", "ష", "స",
            "హ", "ళ", "ఱ",
            "క్ష"];
        Indic.Virama = "్";
        Indic.Synonyms = {
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
        return Indic;
    }());
    exports.Indic = Indic;
});
