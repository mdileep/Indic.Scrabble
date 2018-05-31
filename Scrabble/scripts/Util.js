define(["require", "exports"], function (require, exports) {
    "use strict";
    var Util = (function () {
        function Util() {
        }
        Util.ElapsedTime = function (timeSpan) {
            if (timeSpan < 1000) {
                return Util.Format("{0}ms", [timeSpan.toFixed(2)]);
            }
            var totalSeconds = timeSpan / 1000;
            if (totalSeconds < 60) {
                return Util.Format("{0}sec", [totalSeconds.toFixed(2)]);
            }
            var totalMinutes = timeSpan / (1000 * 60);
            if (totalMinutes < 60) {
                return Util.Format("{0}min", [totalMinutes.toFixed(2)]);
            }
            var totalHours = timeSpan / (1000 * 60 * 60);
            return Util.Format("{0}Hours", [totalHours.toFixed(2)]);
        };
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
                available.splice(indx, 1);
            }
            ret.sort();
            return ret;
        };
        Util.IsNullOrEmpty = function (input) {
            return input == null || input.trim().length == 0;
        };
        return Util;
    }());
    exports.Util = Util;
    var DOMUtil = (function () {
        function DOMUtil() {
        }
        DOMUtil.SelectedValue = function (id) {
            var e = document.getElementById(id);
            if (e == null) {
                return "";
            }
            var value = e.options[e.selectedIndex].value;
            if (value == null) {
                return "";
            }
            return value;
        };
        DOMUtil.RegisterClick = function (id, elementEventListener) {
            DOMUtil.RegisterEvent(document.getElementById(id), 'click', elementEventListener);
        };
        DOMUtil.RegisterEvent = function (E, eventName, elementEventListener) {
            if (E == null) {
                return;
            }
            if (E.addEventListener != null) {
                E.addEventListener(eventName, elementEventListener, false);
            }
            else if (E.attachEvent != null) {
                E.attachEvent('on' + eventName, elementEventListener);
            }
            else {
                E['on' + eventName] = elementEventListener;
            }
        };
        DOMUtil.ApplyTemplate = function (target, templateId, data) {
            var template = document.getElementById(templateId).innerHTML;
            var html = DOMUtil._ApplyTemplate(template, data);
            document.getElementById(target).innerHTML = html;
        };
        DOMUtil._ApplyTemplate = function (html, data) {
            var re = /<#%([^%>]+)?%#>/g, reExp = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g, code = 'var r=[];\n', cursor = 0;
            var add = function (line, js) {
                js ? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') :
                    (code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
                return add;
            };
            var match = null;
            while (match = re.exec(html)) {
                add(html.slice(cursor, match.index))(match[1], true);
                cursor = match.index + match[0].length;
            }
            add(html.substr(cursor, html.length - cursor));
            code += 'return r.join("");';
            return new Function(code.replace(/[\r\t\n]/g, '')).apply(data);
        };
        return DOMUtil;
    }());
    exports.DOMUtil = DOMUtil;
    Object.defineProperty(String.prototype, 'StartsWith', {
        enumerable: false,
        value: function (needle) {
            return this.indexOf(needle) == 0;
        }
    });
    Object.defineProperty(String.prototype, 'Replace', {
        enumerable: false,
        value: function (needle, replacement) {
            return this.replace(new RegExp("\\" + needle, 'g'), replacement);
        }
    });
    Object.defineProperty(String.prototype, 'TrimEnd', {
        enumerable: false,
        value: function (c) {
            for (var i = this.length - 1; i >= 0 && this.charAt(i) == c; i--)
                ;
            return this.substring(0, i + 1);
        }
    });
    Object.defineProperty(String.prototype, 'TrimStart', {
        enumerable: false,
        value: function (c) {
            for (var i = 0; i < this.length && this.charAt(i) == c; i++)
                ;
            return this.substring(i);
        }
    });
    Object.defineProperty(String.prototype, 'Trim', {
        enumerable: false,
        value: function (c) {
            return this.TrimStart(c).TrimEnd(c);
        }
    });
    Object.defineProperty(Array.prototype, 'Contains', {
        enumerable: false,
        value: function (item) {
            return this.indexOf(item) > -1;
        }
    });
    Object.defineProperty(Array.prototype, 'Remove', {
        enumerable: false,
        value: function (item) {
            var indx = this.indexOf(item);
            if (indx < 0) {
                return;
            }
            delete this[indx];
        }
    });
    Object.defineProperty(Array.prototype, 'Find', {
        enumerable: false,
        value: function (item) {
            var indx = this.indexOf(item);
            if (indx < 0) {
                return;
            }
            return this[indx];
        }
    });
    Object.defineProperty(Array.prototype, 'Clone', {
        enumerable: false,
        value: function () {
            return [].concat(this);
        }
    });
});
