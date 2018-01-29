define(["require", "exports"], function (require, exports) {
    "use strict";
    var GameRules = (function () {
        function GameRules() {
        }
        GameRules.ToTray = function (state, args) {
            var cell = state.Center.Cells[args.index];
            if (cell.last == cell.current) {
                return;
            }
            debugger;
            if (cell.waiting.length > 0) {
                var toRemove = cell.waiting[cell.waiting.length - 1];
                cell.waiting.pop();
                cell.current = Indic.Merge(cell.confirmed.concat(cell.waiting));
                var fnd = GameRules.FindTray(state, toRemove);
                var group = state.Left.items[fnd.groupIndex];
                var tile = group.items[fnd.index];
                tile.count++;
            }
        };
        GameRules.ToBoard = function (state, args) {
            var group = state.Left.items[args.groupIndex];
            var tile = group.items[args.tileIndex];
            if (tile.count == 0) {
                return;
            }
            var cell = state.Center.Cells[args.cellIndex];
            var list = cell.confirmed.concat(cell.waiting);
            list.push(args.src);
            var isValid = Indic.IsValid(list);
            if (!isValid) {
                return;
            }
            cell.waiting.push(args.src);
            list = cell.confirmed.concat(cell.waiting);
            cell.current = Indic.Merge(list);
            tile.count--;
        };
        GameRules.FindTray = function (state, char) {
            for (var i = 0; i < state.Left.items.length; i++) {
                var groups = state.Left.items[i];
                for (var j = 0; j < groups.items.length; j++) {
                    var group = groups.items[j];
                    if (group.text == char) {
                        return { groupIndex: i, index: j };
                    }
                }
            }
            return null;
        };
        GameRules.GroupsDisplay = function (state, args) {
            var group = state.Left.items[args.groupIndex];
            group.show = !group.show;
            var cnt = 0;
            var last = -1;
            for (var i = 0; i < state.Left.items.length; i++) {
                if (cnt > 1) {
                    break;
                }
                if (state.Left.items[i].show) {
                    cnt++;
                    last = i;
                }
            }
            if (cnt == 1) {
                state.Left.items[last].disabled = true;
            }
            else {
                for (var i = 0; i < state.Left.items.length; i++) {
                    state.Left.items[i].disabled = false;
                }
            }
        };
        return GameRules;
    }());
    exports.GameRules = GameRules;
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
        Indic.FullSpecialSet = ["ా",
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
            "ఋ", "ౠ",
            "అం", "అః"];
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
        return Indic;
    }());
    exports.Indic = Indic;
});
