define(["require", "exports"], function (require, exports) {
    "use strict";
    var Messages = (function () {
        function Messages() {
        }
        Messages.InvalidMove = "'{0}' ను '{1}' తో కలపడం సాధ్యంకాదు.";
        Messages.UseSynonym = " '{1}' కు బదులుగా '{2}' తో '{0}' ను కలపడానికి ప్రయత్నం చేస్తున్నాం.";
        Messages.Messages = "సందేశాలు";
        Messages.CrossCells = "అన్నీ ఒకే నిలువు లేదా అడ్డం గడులలో మాత్రమే ఉండాలి.";
        Messages.HasIslands = "పదాలు వేరువేరు లంకలలో విస్తరించి ఉన్నాయి.";
        Messages.HasOraphans = "ఏకాక్షరపదాలు అంగీకారం కావు.";
        Messages.OrphanCell = "ఏకాక్షరము {2} అడ్డం: {0} నిలువు:{1} వద్ధ ఉన్నది ";
        return Messages;
    }());
    exports.Messages = Messages;
    var AksharaSets = (function () {
        function AksharaSets() {
        }
        AksharaSets.FullSpecialSet = [
            "ా",
            "ి", "ీ",
            "ు", "ూ",
            "ృ", "ౄ",
            "ె", "ే",
            "ై",
            "ొ", "ో",
            "ౌ", "్",
            "ం", "ః"];
        AksharaSets.SpecialSet = [
            "ా",
            "ి", "ీ",
            "ు", "ూ",
            "ృ", "ౄ",
            "ె", "ే",
            "ై",
            "ొ", "ో",
            "ౌ",
            "ం", "ః"];
        AksharaSets.SunnaSet = ["ం", "ః"];
        AksharaSets.Vowels = [
            "అ", "ఆ",
            "ఇ", "ఈ",
            "ఉ", "ఊ",
            "ఎ", "ఏ", "ఐ",
            "ఒ", "ఓ", "ఔ",
            "ఋ", "ౠ"];
        AksharaSets.Consonents = [
            "క", "ఖ", "గ", "ఘ", "ఙ",
            "చ", "ఛ", "జ", "ఝ", "ఞ",
            "ట", "ఠ", "డ", "ఢ", "ణ",
            "త", "థ", "ద", "ధ", "న",
            "ప", "ఫ", "బ", "భ", "మ",
            "య", "ర", "ల", "వ",
            "శ", "ష", "స",
            "హ", "ళ", "ఱ",
            "క్ష"];
        AksharaSets.Virama = "్";
        AksharaSets.Synonyms = {
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
        return AksharaSets;
    }());
    exports.AksharaSets = AksharaSets;
    var Util = (function () {
        function Util() {
        }
        Util.Format = function (s, args) {
            var formatted = s;
            for (var arg in args) {
                formatted = formatted.replace("{" + arg + "}", args[arg]);
            }
            return formatted;
        };
        Util.Merge = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            var resObj = {};
            for (var i = 0; i < arguments.length; i += 1) {
                var obj = arguments[i], keys = Object.keys(obj);
                for (var j = 0; j < keys.length; j += 1) {
                    resObj[keys[j]] = obj[keys[j]];
                }
            }
            return resObj;
        };
        return Util;
    }());
    exports.Util = Util;
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
                    res = res + AksharaSets.Virama + arr[i];
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
            return Indic.Contains(AksharaSets.Vowels, char);
        };
        Indic.IsConsonent = function (char) {
            return Indic.Contains(AksharaSets.Consonents, char);
        };
        Indic.IsSpecialSet = function (char) {
            return Indic.Contains(AksharaSets.SpecialSet, char);
        };
        Indic.IsFullSpecialSet = function (char) {
            return Indic.Contains(AksharaSets.FullSpecialSet, char);
        };
        Indic.IsSunnaSet = function (char) {
            return Indic.Contains(AksharaSets.SunnaSet, char);
        };
        Indic.GetSynonym = function (akshara) {
            return AksharaSets.Synonyms[akshara];
        };
        return Indic;
    }());
    exports.Indic = Indic;
});
