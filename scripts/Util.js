define(["require", "exports"], function (require, exports) {
    "use strict";
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
        Util.Abs = function (X, Y, size) {
            var min = 0;
            var max = size - 1;
            if ((X < min || X > max) || (Y < min || Y > max)) {
                return -1;
            }
            return (size * (X + 1)) + Y - size;
        };
        Util.Position = function (N, size) {
            var X = Math.floor(N / size);
            var Y = (N % size);
            return { X: X, Y: Y };
        };
        Util.FindNeighbors = function (index, size) {
            var arr = [];
            var pos = Util.Position(index, size);
            var bottom = Util.Abs(pos.X + 1, pos.Y, size);
            var top = Util.Abs(pos.X - 1, pos.Y, size);
            var left = Util.Abs(pos.X, pos.Y - 1, size);
            var right = Util.Abs(pos.X, pos.Y + 1, size);
            var a = [right, left, top, bottom];
            for (var i = 0; i < a.length; i++) {
                if (a[i] != -1) {
                    arr.push(a[i]);
                }
            }
            return arr;
        };
        Util.Contains = function (word, arr) {
            var res = false;
            for (var key in arr) {
                if (arr[key].Text == word.Text) {
                    return true;
                }
            }
            return res;
        };
        Util.Draw = function (available, max) {
            var size = max;
            if (available.length < max) {
                size = available.length;
            }
            var ret = [];
            for (var i = 0; i < size; i++) {
                var indx = Math.round(Math.random() * (available.length - 1));
                ret.push(available[indx]);
            }
            return ret;
        };
        return Util;
    }());
    exports.Util = Util;
});
