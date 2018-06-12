var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define("AksharaSets", ["require", "exports"], function (require, exports) {
    "use strict";
    var AksharaSets = (function () {
        function AksharaSets() {
        }
        AksharaSets.FullSpecialSet = [];
        AksharaSets.SpecialSet = [];
        AksharaSets.SunnaSet = [];
        AksharaSets.Vowels = [];
        AksharaSets.Consonents = [];
        AksharaSets.Virama = "";
        AksharaSets.Synonyms = {};
        AksharaSets.SyllableTiles = {};
        AksharaSets.SyllableChars = {};
        AksharaSets.SyllableSynonym = {};
        return AksharaSets;
    }());
    exports.AksharaSets = AksharaSets;
});
define("Contracts", ["require", "exports"], function (require, exports) {
    "use strict";
    var Events = (function () {
        function Events() {
        }
        Events.GameOver = 0;
        return Events;
    }());
    exports.Events = Events;
    var Actions = (function () {
        function Actions() {
        }
        Actions.Init = 0;
        Actions.ReRender = 1;
        Actions.ToBoard = 20;
        Actions.ToTray = 21;
        Actions.OpenOrClose = 22;
        Actions.Pass = 40;
        Actions.ReDraw = 41;
        Actions.RequestSuggestion = 42;
        Actions.ReciveSuggestion = 43;
        Actions.DismissSuggestion = 44;
        Actions.PunchAndPick = 45;
        Actions.BotMove = 50;
        Actions.BotMoveResponse = 51;
        Actions.Award = 60;
        Actions.ResolveWords = 61;
        Actions.TakeConsent = 62;
        Actions.WordResolved = 63;
        Actions.WordRejected = 64;
        Actions.DismissDialog = 90;
        Actions.AskHelp = 91;
        return Actions;
    }());
    exports.Actions = Actions;
    var Settings = (function () {
        function Settings() {
        }
        Settings.NoWords = 5;
        Settings.BotWait = 300;
        Settings.PinchWait = 300;
        Settings.RefreeWait = 100;
        Settings.ServerWait = 100;
        return Settings;
    }());
    exports.Settings = Settings;
});
define("_OverlayDialog", ["require", "exports", "react"], function (require, exports, React) {
    "use strict";
    var _OverlayDialog = (function (_super) {
        __extends(_OverlayDialog, _super);
        function _OverlayDialog(props) {
            _super.call(this, props);
            this.state = props;
            this.OnConfirm = this.OnConfirm.bind(this);
            this.OnDismiss = this.OnDismiss.bind(this);
        }
        _OverlayDialog.prototype.render = function () {
            return this.renderDialog(null);
        };
        _OverlayDialog.prototype.renderDialog = function (content) {
            var childs = [];
            if (this.props.Show) {
                var bg = this.renderBackground();
                var fg = this.renderForeground(content);
                childs.push(bg);
                childs.push(fg);
            }
            var elem = React.createElement('div', {
                key: this.props.Id,
                className: "olDialog"
            }, childs);
            return elem;
        };
        _OverlayDialog.prototype.renderForeground = function (content) {
            var childs = [];
            var title = React.createElement('h2', {
                key: "title_" + this.props.Id,
                className: "h2 oFTitle"
            }, this.props.Title);
            childs.push(title);
            if (content != null) {
                childs.push(content);
            }
            var buttons = this.renderActions();
            childs.push(buttons);
            return React.createElement('div', {
                key: "fg_" + this.props.Id,
                className: "oForeGround"
            }, childs);
        };
        _OverlayDialog.prototype.renderActions = function () {
            var childs = [];
            if (this.props.ShowConfirm) {
                var ok = React.createElement('button', {
                    key: "ok_" + this.props.Id,
                    className: "oOK",
                    onClick: this.OnConfirm
                }, [], this.props.ConfirmText);
                childs.push(ok);
            }
            if (this.props.ShowClose) {
                var cancel = React.createElement('button', {
                    key: "cancel_" + this.props.Id,
                    className: "oCancel",
                    onClick: this.OnDismiss
                }, [], this.props.CancelText);
                childs.push(cancel);
            }
            return React.createElement('div', {
                key: "actions_" + this.props.Id,
                className: "oFButtonHolder"
            }, childs);
        };
        _OverlayDialog.prototype.renderBackground = function () {
            return React.createElement('div', {
                key: "bg_" + this.props.Id,
                className: "oBackGround"
            });
        };
        _OverlayDialog.prototype.OnConfirm = function (ev) {
            if (this.props.OnConfirm == null) {
                return;
            }
            this.props.OnConfirm();
        };
        _OverlayDialog.prototype.OnDismiss = function (ev) {
            if (this.props.OnDismiss == null) {
                return;
            }
            this.props.OnDismiss();
        };
        return _OverlayDialog;
    }(React.Component));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = _OverlayDialog;
});
define("Util", ["require", "exports"], function (require, exports) {
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
define("_AlertDialog", ["require", "exports", "react", "_OverlayDialog"], function (require, exports, React, OverlayDialog) {
    "use strict";
    var _AlertDialog = (function (_super) {
        __extends(_AlertDialog, _super);
        function _AlertDialog(props) {
            _super.call(this, props);
            this.state = props;
        }
        _AlertDialog.prototype.render = function () {
            var message = React.createElement('div', {
                key: "msg_" + this.props.Id,
                className: "oFContent"
            }, this.props.Message);
            return this.renderDialog(message);
        };
        return _AlertDialog;
    }(OverlayDialog.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = _AlertDialog;
});
define("Messages", ["require", "exports"], function (require, exports) {
    "use strict";
    var Messages = (function () {
        function Messages() {
        }
        Messages.Title = "";
        Messages.Name = "";
        Messages.Keywords = "";
        Messages.Description = "";
        Messages.Author = "";
        Messages.Author2 = "";
        Messages.Player = "";
        Messages.PlayerName = "";
        Messages.InvalidMove = "";
        Messages.UseSynonym = "";
        Messages.Messages = "";
        Messages.CrossCells = "";
        Messages.HasIslands = "";
        Messages.HasOraphans = "";
        Messages.OrphanCell = "";
        Messages.HasDupliates = "";
        Messages.Claimed = "";
        Messages.Thinking = "";
        Messages.YourTurn = "";
        Messages.BotEffort = "";
        Messages.BotNoWords = "";
        Messages.BotEffort2 = "";
        Messages.GameOver = "";
        Messages.Winner = "";
        Messages.MatchTied = "";
        Messages.WhyGameOver = "";
        Messages.NoWordsAdded = "";
        Messages.Stats = "";
        Messages.LookupDict = "";
        Messages.ResolveWord = "";
        Messages.Referee = "";
        Messages.OK = "";
        Messages.Yes = "";
        Messages.No = "";
        Messages.IsStarCovered = "";
        Messages.ActionBar = "";
        Messages.Help = "";
        Messages.Suggest = "";
        Messages.Board = "";
        Messages.Row = "";
        Messages.Cabinet = "";
        Messages.TrayLabels = "";
        Messages.Words = "";
        Messages.Players = "";
        Messages.Brand = "";
        Messages.List = "";
        Messages.GameTable = "";
        Messages.ReDraw = "";
        Messages.Pass = "";
        Messages.Actions = "";
        Messages.NoGap = "";
        Messages.SuggestLoading = "";
        Messages.NoSuggestions = "";
        return Messages;
    }());
    exports.Messages = Messages;
});
define("DragDropTouch", ["require", "exports"], function (require, exports) {
    "use strict";
    var DataTransfer = (function () {
        function DataTransfer() {
            this._dropEffect = 'move';
            this._effectAllowed = 'all';
            this._data = {};
        }
        Object.defineProperty(DataTransfer.prototype, "dropEffect", {
            get: function () {
                return this._dropEffect;
            },
            set: function (value) {
                this._dropEffect = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DataTransfer.prototype, "effectAllowed", {
            get: function () {
                return this._effectAllowed;
            },
            set: function (value) {
                this._effectAllowed = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DataTransfer.prototype, "types", {
            get: function () {
                return Object.keys(this._data);
            },
            enumerable: true,
            configurable: true
        });
        DataTransfer.prototype.clearData = function (type) {
            if (type != null) {
                delete this._data[type];
            }
            else {
                this._data = null;
            }
        };
        DataTransfer.prototype.getData = function (type) {
            return this._data[type] || '';
        };
        DataTransfer.prototype.setData = function (type, value) {
            this._data[type] = value;
        };
        DataTransfer.prototype.setDragImage = function (img, offsetX, offsetY) {
            var ddt = DragDropTouch._instance;
            ddt._imgCustom = img;
            ddt._imgOffset = { x: offsetX, y: offsetY };
        };
        return DataTransfer;
    }());
    exports.DataTransfer = DataTransfer;
    var DragDropTouch = (function () {
        function DragDropTouch() {
            this._lastClick = 0;
            if (DragDropTouch._instance) {
                throw 'DragDropTouch instance already created.';
            }
            var supportsPassive = false;
            document.addEventListener('test', null, {
                get passive() {
                    supportsPassive = true;
                    return true;
                }
            });
            if ('ontouchstart' in document) {
                var d = document, ts = this._touchstart.bind(this), tm = this._touchmove.bind(this), te = this._touchend.bind(this), opt = supportsPassive ? { passive: false, capture: false } : false;
                d.addEventListener('touchstart', ts, opt);
                d.addEventListener('touchmove', tm, opt);
                d.addEventListener('touchend', te);
                d.addEventListener('touchcancel', te);
            }
        }
        DragDropTouch.getInstance = function () {
            return DragDropTouch._instance;
        };
        DragDropTouch.prototype._touchstart = function (e) {
            var _this = this;
            if (this._shouldHandle(e)) {
                if (Date.now() - this._lastClick < DragDropTouch._DBLCLICK) {
                    if (this._dispatchEvent(e, 'dblclick', e.target)) {
                        e.preventDefault();
                        this._reset();
                        return;
                    }
                }
                this._reset();
                var src = this._closestDraggable(e.target);
                if (src) {
                    if (!this._dispatchEvent(e, 'mousemove', e.target) &&
                        !this._dispatchEvent(e, 'mousedown', e.target)) {
                        this._dragSource = src;
                        this._ptDown = this._getPoint(e);
                        this._lastTouch = e;
                        e.preventDefault();
                        setTimeout(function () {
                            if (_this._dragSource == src && _this._img == null) {
                                if (_this._dispatchEvent(e, 'contextmenu', src)) {
                                    _this._reset();
                                }
                            }
                        }, DragDropTouch._CTXMENU);
                    }
                }
            }
        };
        DragDropTouch.prototype._touchmove = function (e) {
            if (this._shouldHandle(e)) {
                var target = this._getTarget(e);
                if (this._dispatchEvent(e, 'mousemove', target)) {
                    this._lastTouch = e;
                    e.preventDefault();
                    return;
                }
                if (this._dragSource && !this._img) {
                    var delta = this._getDelta(e);
                    if (delta > DragDropTouch._THRESHOLD) {
                        this._dispatchEvent(e, 'dragstart', this._dragSource);
                        this._createImage(e);
                        this._dispatchEvent(e, 'dragenter', target);
                    }
                }
                if (this._img) {
                    this._lastTouch = e;
                    e.preventDefault();
                    if (target != this._lastTarget) {
                        this._dispatchEvent(this._lastTouch, 'dragleave', this._lastTarget);
                        this._dispatchEvent(e, 'dragenter', target);
                        this._lastTarget = target;
                    }
                    this._moveImage(e);
                    this._dispatchEvent(e, 'dragover', target);
                }
            }
        };
        DragDropTouch.prototype._touchend = function (e) {
            if (this._shouldHandle(e)) {
                if (this._dispatchEvent(this._lastTouch, 'mouseup', e.target)) {
                    e.preventDefault();
                    return;
                }
                if (!this._img) {
                    this._dragSource = null;
                    this._dispatchEvent(this._lastTouch, 'click', e.target);
                    this._lastClick = Date.now();
                }
                this._destroyImage();
                if (this._dragSource) {
                    if (e.type.indexOf('cancel') < 0) {
                        this._dispatchEvent(this._lastTouch, 'drop', this._lastTarget);
                    }
                    this._dispatchEvent(this._lastTouch, 'dragend', this._dragSource);
                    this._reset();
                }
            }
        };
        DragDropTouch.prototype._shouldHandle = function (e) {
            return e &&
                !e.defaultPrevented &&
                e.touches && e.touches.length < 2;
        };
        DragDropTouch.prototype._reset = function () {
            this._destroyImage();
            this._dragSource = null;
            this._lastTouch = null;
            this._lastTarget = null;
            this._ptDown = null;
            this._dataTransfer = new DataTransfer();
        };
        DragDropTouch.prototype._getPoint = function (e, page) {
            if (e && e.touches) {
                e = e.touches[0];
            }
            return { x: page ? e.pageX : e.clientX, y: page ? e.pageY : e.clientY };
        };
        DragDropTouch.prototype._getDelta = function (e) {
            var p = this._getPoint(e);
            return Math.abs(p.x - this._ptDown.x) + Math.abs(p.y - this._ptDown.y);
        };
        DragDropTouch.prototype._getTarget = function (e) {
            var pt = this._getPoint(e), el = document.elementFromPoint(pt.x, pt.y);
            while (el && getComputedStyle(el).pointerEvents == 'none') {
                el = el.parentElement;
            }
            return el;
        };
        DragDropTouch.prototype._createImage = function (e) {
            if (this._img) {
                this._destroyImage();
            }
            var src = this._imgCustom || this._dragSource;
            this._img = src.cloneNode(true);
            this._copyStyle(src, this._img);
            this._img.style.top = this._img.style.left = '-9999px';
            if (!this._imgCustom) {
                var rc = src.getBoundingClientRect(), pt = this._getPoint(e);
                this._imgOffset = { x: pt.x - rc.left, y: pt.y - rc.top };
                this._img.style.opacity = DragDropTouch._OPACITY.toString();
            }
            this._moveImage(e);
            document.body.appendChild(this._img);
        };
        DragDropTouch.prototype._destroyImage = function () {
            if (this._img && this._img.parentElement) {
                this._img.parentElement.removeChild(this._img);
            }
            this._img = null;
            this._imgCustom = null;
        };
        DragDropTouch.prototype._moveImage = function (e) {
            var _this = this;
            if (this._img) {
                requestAnimationFrame(function () {
                    var pt = _this._getPoint(e, true), s = _this._img.style;
                    s.position = 'absolute';
                    s.pointerEvents = 'none';
                    s.zIndex = '999999';
                    s.left = Math.round(pt.x - _this._imgOffset.x) + 'px';
                    s.top = Math.round(pt.y - _this._imgOffset.y) + 'px';
                });
            }
        };
        DragDropTouch.prototype._copyProps = function (dst, src, props) {
            for (var i = 0; i < props.length; i++) {
                var p = props[i];
                dst[p] = src[p];
            }
        };
        DragDropTouch.prototype._copyStyle = function (src, dst) {
            DragDropTouch._rmvAtts.forEach(function (att) {
                dst.removeAttribute(att);
            });
            if (src instanceof HTMLCanvasElement) {
                var cSrc = src, cDst = dst;
                cDst.width = cSrc.width;
                cDst.height = cSrc.height;
                cDst.getContext('2d').drawImage(cSrc, 0, 0);
            }
            var cs = getComputedStyle(src);
            for (var i = 0; i < cs.length; i++) {
                var key = cs[i];
                if (key.indexOf('transition') < 0) {
                    dst.style[key] = cs[key];
                }
            }
            dst.style.pointerEvents = 'none';
            for (var i = 0; i < src.children.length; i++) {
                this._copyStyle(src.children[i], dst.children[i]);
            }
        };
        DragDropTouch.prototype._dispatchEvent = function (e, type, target) {
            if (e && target) {
                var evt = document.createEvent('Event'), t = e.touches ? e.touches[0] : e;
                evt.initEvent(type, true, true);
                evt.button = 0;
                evt.which = evt.buttons = 1;
                this._copyProps(evt, e, DragDropTouch._kbdProps);
                this._copyProps(evt, t, DragDropTouch._ptProps);
                evt.dataTransfer = this._dataTransfer;
                target.dispatchEvent(evt);
                return evt.defaultPrevented;
            }
            return false;
        };
        DragDropTouch.prototype._closestDraggable = function (e) {
            for (; e; e = e.parentElement) {
                if (e.hasAttribute('draggable') && e.draggable) {
                    return e;
                }
            }
            return null;
        };
        DragDropTouch._instance = new DragDropTouch();
        DragDropTouch._THRESHOLD = 5;
        DragDropTouch._OPACITY = 0.5;
        DragDropTouch._DBLCLICK = 500;
        DragDropTouch._CTXMENU = 900;
        DragDropTouch._rmvAtts = 'id,class,style,draggable'.split(',');
        DragDropTouch._kbdProps = 'altKey,ctrlKey,metaKey,shiftKey'.split(',');
        DragDropTouch._ptProps = 'pageX,pageY,clientX,clientY,screenX,screenY'.split(',');
        return DragDropTouch;
    }());
    exports.DragDropTouch = DragDropTouch;
});
define("Indic", ["require", "exports", "AksharaSets"], function (require, exports, AS) {
    "use strict";
    var Indic = (function () {
        function Indic() {
        }
        Indic.ToWord = function (Cells) {
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
        };
        Indic.ToScrabble = function (word) {
            var res = "";
            var Syllables = word.split(',');
            for (var indx in Syllables) {
                var Syllable = Syllables[indx];
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
        };
        Indic.IsValid = function (original) {
            var arr = Indic.ToChars(original);
            if (arr.length == 1 && Indic.IsFullSpecialSet(arr[0])) {
                return false;
            }
            if (arr.length == 1 && Indic.IsSunnaSet(arr[0])) {
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
        Indic.IsZWNJ = function (char) {
            return char == String.fromCharCode(0x200C);
        };
        Indic.IsVirama = function (char) {
            return char == AS.AksharaSets.Virama;
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
define("Parser", ["require", "exports", "GameActions", "Indic"], function (require, exports, GameActions, Indic) {
    "use strict";
    var Parser = (function () {
        function Parser() {
        }
        Parser.Parse = function () {
            var cabinet = Parser.ParseCabinet(Config.Board);
            var board = Parser.ParseBoard(Config.Board);
            var players = Parser.ParsePlayers(Config.Players);
            var cache = Parser.BuildCache(cabinet);
            var infoBar = Parser.BuildInfoBar();
            var gameTable = Parser.BuildGameTable(Config.Board.GameTable, board.TileWeights, cache);
            var consent = Parser.BuildConsent();
            var suggest = Parser.BuildSuggestion();
            var stats = { EmptyCells: 0, Occupancy: 0, TotalWords: 0, UnUsed: 0 };
            GameActions.GameActions.RefreshTrays(cabinet.Trays, cache);
            GameActions.GameActions.RefreshCabinet(cabinet, cache);
            var dialog = Parser.BuildDialog();
            var gameState = {
                Id: "game",
                key: "game",
                GameId: Config.GameId,
                className: "game",
                ReadOnly: false,
                Show: true,
                GameOver: false,
                Cache: cache,
                Cabinet: cabinet,
                Board: board,
                Players: players,
                InfoBar: infoBar,
                Consent: consent,
                Stats: stats,
                GameTable: gameTable,
                Dialog: dialog,
                Suggestion: suggest
            };
            return gameState;
        };
        Parser.BuildGameTable = function (JSON, tileWeights, cache) {
            var vAvailable = GameActions.GameActions.DrawVowelTiles(cache, {}, JSON.MaxVowels);
            var vTray = GameActions.GameActions.SetTableTray(vAvailable, tileWeights, "Vowels");
            GameActions.GameActions.SetOnBoard(cache, vAvailable);
            var cAvailable = GameActions.GameActions.DrawConsoTiles(cache, {}, JSON.MaxOnTable - JSON.MaxVowels);
            var cTray = GameActions.GameActions.SetTableTray(cAvailable, tileWeights, "Conso");
            GameActions.GameActions.SetOnBoard(cache, cAvailable);
            var raw = {};
            raw.key = "gameTable";
            raw.Id = raw.key;
            raw.className = "gameTable";
            raw.CanReDraw = true;
            raw.ReadOnly = false;
            raw.MaxOnTable = JSON.MaxOnTable;
            raw.MaxVowels = JSON.MaxVowels;
            raw.VowelTray = vTray;
            raw.ConsoTray = cTray;
            return raw;
        };
        Parser.ParseCabinet = function (JSON) {
            var raw = {};
            raw.key = "Cabinet";
            raw.Trays = [];
            raw.ReadOnly = true;
            raw.Show = true;
            var index = 0;
            var tilesDict = {};
            for (var i = 0; i < JSON.Trays.length; i++) {
                var item = JSON.Trays[i];
                var props = {};
                props.Id = item.Id;
                props.key = item.Id;
                props.className = "tray";
                props.Title = item.Title;
                props.Show = item.Show;
                props.Disabled = false;
                props.ReadOnly = raw.ReadOnly;
                props.Index = i;
                props.Tiles = [];
                for (var j = 0; j < item.Set.length; j++) {
                    var prop = {};
                    prop.Id = "T_" + (index + 1).toString();
                    prop.key = prop.Id;
                    var KVP = item.Set[j];
                    for (var key in KVP) {
                        prop.Text = key;
                        prop.Remaining = KVP[key].C;
                        prop.Total = prop.Remaining;
                        prop.Weight = KVP[key].W;
                    }
                    prop.Index = j;
                    prop.TrayIndex = i;
                    prop.ReadOnly = raw.ReadOnly;
                    props.Tiles.push(prop);
                    index++;
                }
                raw.Trays.push(props);
            }
            return raw;
        };
        Parser.BuildCache = function (JSON) {
            var tilesDict = {};
            for (var i = 0; i < JSON.Trays.length; i++) {
                var item = JSON.Trays[i];
                for (var j = 0; j < item.Tiles.length; j++) {
                    var prop = item.Tiles[j];
                    Parser.RefreshCache(tilesDict, { Text: prop.Text, Remaining: prop.Remaining, Total: prop.Total, Weight: prop.Weight });
                }
            }
            return tilesDict;
        };
        Parser.ParseBoard = function (JSON) {
            var raw = {};
            raw.Id = "Board";
            raw.key = "Board";
            raw.Size = JSON.Size;
            raw.Name = JSON.Name;
            raw.Star = JSON.Star;
            raw.Language = JSON.Language;
            raw.Cells = [];
            raw.TileWeights = Parser.GetTileWeights(JSON.Trays);
            var index = 0;
            for (var i = 0; i < JSON.Size; i++) {
                for (var j = 0; j < JSON.Size; j++) {
                    var cell = {};
                    cell.Id = "C_" + (index + 1).toString();
                    cell.key = cell.Id;
                    cell.Weight = JSON.Weights[index];
                    cell.Current = " ";
                    cell.Index = index;
                    cell.Waiting = [];
                    cell.Confirmed = [];
                    cell.Star = (JSON.Star == index);
                    raw.Cells.push(cell);
                    index++;
                }
            }
            return raw;
        };
        Parser.ParsePlayers = function (players) {
            var raw = {};
            raw.Id = "Players";
            raw.key = raw.Id;
            raw.Players = [];
            raw.Current = 0;
            raw.HasClaims = false;
            for (var i = 0; i < players.length; i++) {
                var player = players[i];
                player.CurrentTurn = (i == raw.Current);
                player.Score = 0;
                player.Unconfirmed = 0;
                player.Awarded = [];
                player.Claimed = [];
                player.Id = "P_" + (i + 1);
                player.key = player.Id;
                player.NoWords = 0;
                player.Name = player.Name;
                raw.Players.push(player);
            }
            return raw;
        };
        Parser.BuildInfoBar = function () {
            var raw = {};
            raw.key = "InfoBar";
            raw.Messages = [];
            return raw;
        };
        Parser.BuildDialog = function () {
            var id = "Dialog";
            var dialog = {
                Id: id,
                key: id,
                Show: false,
                ReadOnly: false,
                className: "",
                Title: "",
                Message: "",
            };
            return dialog;
        };
        Parser.BuildSuggestion = function () {
            var id = "Suggest";
            var suggest = {
                Id: id,
                key: id,
                Show: false,
                ReadOnly: false,
                className: "",
                Loaded: false,
                Moves: [],
                Title: "",
                ConfirmText: "",
                CancelText: "",
                ShowConfirm: true,
                ShowClose: false,
                OnConfirm: null,
                OnDismiss: null
            };
            return suggest;
        };
        Parser.BuildConsent = function () {
            var id = "Consent";
            var consent = {
                Id: id,
                key: id,
                Show: false,
                ReadOnly: false,
                className: "",
                Pending: [],
                UnResolved: []
            };
            return consent;
        };
        Parser.RefreshCache = function (cache, prop) {
            var text = prop.Text;
            cache[text] =
                {
                    Remaining: prop.Remaining,
                    Total: prop.Total,
                    OnBoard: 0
                };
            return;
        };
        Parser.GetTileWeights = function (trays) {
            var Weights = {};
            for (var indx in trays) {
                var tray = trays[indx];
                for (var indx2 in tray.Set) {
                    var tiles = tray.Set[indx2];
                    for (var indx3 in tiles) {
                        var tile = tiles[indx3];
                        Weights[indx3] = tile.W;
                        var sym = Indic.Indic.GetSynonym(indx3);
                        if (sym != null) {
                            Weights[sym] = tile.W;
                        }
                    }
                }
            }
            return Weights;
        };
        return Parser;
    }());
    exports.Parser = Parser;
});
define("GenericActions", ["require", "exports", "Contracts", "GameStore"], function (require, exports, Contracts, GS) {
    "use strict";
    var GenericActions = (function () {
        function GenericActions() {
        }
        GenericActions.OnDismissDialog = function () {
            GS.GameStore.Dispatch({
                type: Contracts.Actions.DismissDialog,
                args: {}
            });
        };
        GenericActions.DismissDialog = function (state, args) {
            state.Show = false;
            state = null;
        };
        return GenericActions;
    }());
    exports.GenericActions = GenericActions;
});
define("GameState", ["require", "exports", "Contracts", "Parser", "GameActions", "GenericActions"], function (require, exports, Contracts, Parser, GameActions, GenericActions) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = function (state, action) {
        if (state === void 0) { state = Parser.Parser.Parse(); }
        var args = action.args;
        switch (action.type) {
            case Contracts.Actions.Init:
                GameActions.GameActions.Init(state, args);
                return state;
            case Contracts.Actions.PunchAndPick:
                GameActions.GameActions.PunchAndPick(state, args);
                return state;
            case Contracts.Actions.ToBoard:
                GameActions.GameActions.ToBoard(state, args);
                return state;
            case Contracts.Actions.ToTray:
                GameActions.GameActions.ToTray(state, args);
                return state;
            case Contracts.Actions.OpenOrClose:
                GameActions.GameActions.OpenClose(state, args);
                return state;
            case Contracts.Actions.RequestSuggestion:
                GameActions.GameActions.RequestSuggestion(state, args);
                return state;
            case Contracts.Actions.ReciveSuggestion:
                GameActions.GameActions.ReciveSuggestion(state, args);
                return state;
            case Contracts.Actions.DismissSuggestion:
                GameActions.GameActions.DismissSuggestion(state, args);
                return state;
            case Contracts.Actions.Pass:
                GameActions.GameActions.Pass(state, args);
                return state;
            case Contracts.Actions.ReDraw:
                GameActions.GameActions.ReDraw(state, args);
                return state;
            case Contracts.Actions.BotMove:
                GameActions.GameActions.BotMove(state, args);
                return state;
            case Contracts.Actions.BotMoveResponse:
                GameActions.GameActions.BotMoveResponse(state, args);
                return state;
            case Contracts.Actions.Award:
                GameActions.GameActions.Award(state, args);
                return state;
            case Contracts.Actions.ResolveWords:
                GameActions.GameActions.ResolveWords(state, args);
                return state;
            case Contracts.Actions.TakeConsent:
                GameActions.GameActions.TakeConsent(state, args);
                return state;
            case Contracts.Actions.WordResolved:
                GameActions.GameActions.ResolveWord(state, args);
                return state;
            case Contracts.Actions.WordRejected:
                GameActions.GameActions.RejectWord(state, args);
                return state;
            default:
                return state;
            case Contracts.Actions.DismissDialog:
                GenericActions.GenericActions.DismissDialog(state.Dialog, args);
                return state;
        }
    };
});
define("GameStore", ["require", "exports", "GameState", 'redux'], function (require, exports, GameState_1, Redux) {
    "use strict";
    var GameStore = (function () {
        function GameStore() {
        }
        GameStore.CreateStore = function () {
            GameStore.store = Redux.createStore(GameState_1.default);
        };
        GameStore.GetState = function () {
            return GameStore.store.getState();
        };
        GameStore.Subscribe = function (listener) {
            return GameStore.store.subscribe(listener);
        };
        GameStore.Dispatch = function (action) {
            return GameStore.store.dispatch(action);
        };
        return GameStore;
    }());
    exports.GameStore = GameStore;
});
define("WordLoader", ["require", "exports", "Contracts", 'axios', "GameStore"], function (require, exports, C, axios, GS) {
    "use strict";
    var WordLoader = (function () {
        function WordLoader() {
        }
        WordLoader.LoadWords = function (file, askOpponent) {
            if (WordLoader.Lists == null) {
                return [];
            }
            if (WordLoader.Lists[file] != null) {
                return WordLoader.Lists[file];
            }
            if (!askOpponent) {
                return [];
            }
            for (var key in WordLoader.Lists) {
                if (key == WordLoader.Custom) {
                    continue;
                }
                return WordLoader.Lists[key];
            }
            return [];
        };
        WordLoader.AddWord = function (word) {
            var cnt = WordLoader.Lists[WordLoader.Custom].length;
            WordLoader.Lists[WordLoader.Custom].push({
                Tiles: word,
                Index: cnt++,
                Syllables: word.split(',').length,
            });
        };
        WordLoader.Load = function (file, rawResponse) {
            var words = rawResponse.split('\n');
            var List = [];
            var cnt = 0;
            for (var indx in words) {
                var line = words[indx];
                List.push({
                    Tiles: line,
                    Index: cnt++,
                    Syllables: line.split(',').length,
                });
            }
            WordLoader.Lists[file] = List;
            WordLoader.Loaded++;
            rawResponse = null;
        };
        WordLoader.Init = function (file) {
            axios
                .get("/bots/" + file)
                .then(function (response) {
                WordLoader.Load(file, response.data);
                WordLoader.VocabularyLoaded(file);
            })
                .catch(function (error) {
            });
        };
        WordLoader.Report = function (gameId, words) {
            if (words.length == 0) {
                return;
            }
            axios
                .post("API.ashx?reportwords", { id: gameId, words: words })
                .then(function (response) {
            })
                .catch(function (error) {
            });
        };
        WordLoader.Resolve = function (words) {
            var unResolved = [];
            for (var indx in words) {
                var word = words[indx];
                var isValid = WordLoader.IsValid(word);
                if (!isValid) {
                    unResolved.push(word);
                }
            }
            return unResolved;
        };
        WordLoader.IsValid = function (word) {
            var res = false;
            for (var indx in WordLoader.Lists) {
                var List = WordLoader.Lists[indx];
                for (var indx2 in List) {
                    var Word = List[indx2];
                    if (word == Word.Tiles) {
                        if (console) {
                            console.log(Word.Tiles);
                        }
                        return true;
                    }
                }
            }
            return res;
        };
        WordLoader.Prepare = function (list) {
            WordLoader.Total = list.length;
            if (list.length == 0) {
                WordLoader.LoadComplete();
                return;
            }
            WordLoader.LoadVocabularies(list);
        };
        WordLoader.LoadVocabularies = function (list) {
            for (var indx in list) {
                WordLoader.Init(list[indx]);
            }
        };
        WordLoader.VocabularyLoaded = function (file) {
            if (WordLoader.Loaded != WordLoader.Total) {
                return;
            }
            WordLoader.LoadComplete();
        };
        WordLoader.LoadComplete = function () {
            WordLoader.Lists[WordLoader.Custom] = [];
            GS.GameStore.Dispatch({
                type: C.Actions.Init,
                args: {}
            });
        };
        WordLoader.Post = function (gameId) {
            WordLoader.Report(gameId, WordLoader.Lists[WordLoader.Custom]);
        };
        WordLoader.Dispose = function () {
            WordLoader.Lists = null;
        };
        WordLoader.Loaded = 0;
        WordLoader.Total = 0;
        WordLoader.Custom = "Custom";
        WordLoader.Lists = {};
        return WordLoader;
    }());
    exports.WordLoader = WordLoader;
});
define("AskBot", ["require", "exports", 'axios', "GameStore", "Contracts", "Util", "WordLoader"], function (require, exports, axios, GS, C, U, WL) {
    "use strict";
    var AskServer = (function () {
        function AskServer() {
        }
        AskServer.NextMove = function () {
            GS.GameStore.Dispatch({
                type: C.Actions.BotMove,
                args: {}
            });
        };
        AskServer.Validate = function () {
            GS.GameStore.Dispatch({
                type: C.Actions.ResolveWords,
                args: {}
            });
        };
        AskServer.Suggest = function (post) {
            AskServer.SuggestClient(post);
        };
        AskServer.BotMove = function (post) {
            AskServer.BotMoveClient(post);
        };
        AskServer.Resolve = function (words) {
            AskServer.ResolveClient(words);
        };
        AskServer.SendMetrics = function (metrics) {
            axios
                .post("/API.ashx?postmetrics", metrics)
                .then(function (response) {
            })
                .catch(function (error) {
            });
        };
        AskServer.SuggestServer = function (post) {
        };
        AskServer.SuggestClient = function (post) {
            setTimeout(function () {
                var st = performance.now();
                var move = new RegexV2Engine().BestMove(post.Board);
                var effort = U.Util.ElapsedTime(performance.now() - st);
                var response = {
                    Action: "suggest",
                    Result: move,
                    Effort: effort
                };
                GS.GameStore.Dispatch({
                    type: C.Actions.ReciveSuggestion,
                    args: response
                });
            }, C.Settings.ServerWait);
        };
        AskServer.BotMoveServer = function (post) {
            axios
                .post("/API.ashx?nextmove", post.Board)
                .then(function (response) {
                GS.GameStore.Dispatch({
                    type: C.Actions.BotMoveResponse,
                    args: response.data
                });
            })
                .catch(function (error) {
            });
        };
        AskServer.BotMoveClient = function (post) {
            setTimeout(function () {
                var st2 = performance.now();
                var move2 = new RegexV2Engine().BestMove(post.Board);
                var effort2 = U.Util.ElapsedTime(performance.now() - st2);
                var response = {
                    Action: "nextmove",
                    Result: move2,
                    Effort: effort2
                };
                GS.GameStore.Dispatch({
                    type: C.Actions.BotMoveResponse,
                    args: response
                });
            }, C.Settings.ServerWait);
        };
        AskServer.ResolveServer = function (words) {
        };
        AskServer.ResolveClient = function (words) {
            setTimeout(function () {
                var st = performance.now();
                var invalid = WL.WordLoader.Resolve(words);
                var effort = U.Util.ElapsedTime(performance.now() - st);
                var response = {
                    Action: "resolve",
                    Result: invalid,
                    Effort: effort
                };
                GS.GameStore.Dispatch({
                    type: response.Result.length == 0 ?
                        C.Actions.Award :
                        C.Actions.TakeConsent,
                    args: response.Result
                });
            }, C.Settings.ServerWait);
        };
        return AskServer;
    }());
    exports.AskServer = AskServer;
    var BoardUtil = (function () {
        function BoardUtil() {
        }
        BoardUtil.FindNeighbors = function (index, size) {
            var arr = { Right: -1, Left: -1, Top: -1, Bottom: -1 };
            var pos = BoardUtil.Position(index, size);
            var bottom = BoardUtil.Abs(pos.X + 1, pos.Y, size);
            var top = BoardUtil.Abs(pos.X - 1, pos.Y, size);
            var left = BoardUtil.Abs(pos.X, pos.Y - 1, size);
            var right = BoardUtil.Abs(pos.X, pos.Y + 1, size);
            arr = { Right: right, Left: left, Top: top, Bottom: bottom };
            return arr;
        };
        BoardUtil.Position = function (N, size) {
            var X = Math.floor(N / size);
            var Y = (N % size);
            return { X: X, Y: Y };
        };
        BoardUtil.Abs = function (X, Y, size) {
            var min = 0;
            var max = size - 1;
            if ((X < min || X > max) || (Y < min || Y > max)) {
                return -1;
            }
            return (size * (X + 1)) + Y - size;
        };
        return BoardUtil;
    }());
    exports.BoardUtil = BoardUtil;
    var ProbableWordComparer = (function () {
        function ProbableWordComparer() {
        }
        ProbableWordComparer.Distinct = function (_Words) {
            var Words = [];
            for (var indx in _Words) {
                if (ProbableWordComparer.Contains(Words, _Words[indx])) {
                    continue;
                }
                Words.push(_Words[indx]);
            }
            return Words;
        };
        ProbableWordComparer.Equals = function (x, y) {
            if (x.Cells.length != y.Cells.length) {
                return false;
            }
            for (var i = 0; i < x.Cells.length; i++) {
                if (x.Cells[i].Index != y.Cells[i].Index) {
                    return false;
                }
                if (x.Cells[i].Target != y.Cells[i].Target) {
                    return false;
                }
            }
            return true;
        };
        ProbableWordComparer.Contains = function (Words, Word) {
            for (var indx in Words) {
                if (ProbableWordComparer.Equals(Words[indx], Word)) {
                    return true;
                }
            }
            return false;
        };
        return ProbableWordComparer;
    }());
    exports.ProbableWordComparer = ProbableWordComparer;
    var EngineBase = (function () {
        function EngineBase() {
        }
        EngineBase.TryHarizontal = function (Mode, Star, Cells, size, Index, offset, Pre, Centers, Post) {
            var Moves = [];
            var PreCount = Pre.length;
            var PostCount = Post.length;
            var NewCells = Cells.Clone();
            var Impacted = [];
            if (Pre.length != 0) {
                for (var x = Pre.length - 1; x >= 0; x--) {
                    var n = BoardUtil.FindNeighbors(Index - x, size);
                    if (n.Left != -1) {
                        NewCells[n.Left] += Pre[x];
                        Impacted.push(n.Left);
                        if (Pre[x] == null || Pre[x] == "") {
                            debugger;
                        }
                        Moves.push({ Tiles: Pre[x], Index: n.Left });
                    }
                    else {
                        return { Words: [], Direction: "H", WordsCount: 0, Moves: [] };
                    }
                }
            }
            if (Centers.length != 0) {
                for (var c = 0; c < Centers.length; c++) {
                    var cellIndex = Index + c;
                    if (cellIndex == -1 || Centers[c] == "") {
                        continue;
                    }
                    NewCells[cellIndex] += Centers[c];
                    Impacted.push(cellIndex);
                    if (Centers[c] == null || Centers[c] == "") {
                        debugger;
                    }
                    Moves.push({ Tiles: Centers[c], Index: cellIndex });
                }
            }
            if (Post.length != 0) {
                for (var x = 0; x < Post.length; x++) {
                    var n = BoardUtil.FindNeighbors(Index + offset + x, size);
                    if (n.Right != -1) {
                        NewCells[n.Right] += Post[x];
                        Impacted.push(n.Right);
                        if (Post[x] == null || Post[x] == "") {
                            debugger;
                        }
                        Moves.push({ Tiles: Post[x], Index: n.Right });
                    }
                    else {
                        return { Words: [], Direction: "H", WordsCount: 0, Moves: [] };
                    }
                }
            }
            var W = [];
            if (Star < 0 || (Star >= 0 && NewCells[Star] != "")) {
                for (var i in Impacted) {
                    var index = Impacted[i];
                    W = W.concat(EngineBase.WordsAt(NewCells, size, index));
                }
            }
            return { Mode: Mode, Words: W, Moves: Moves, WordsCount: W.length, Direction: "H" };
        };
        EngineBase.TryVertical = function (Mode, Star, Cells, size, Index, offset, Pre, Centers, Post) {
            var Moves = [];
            var PreCount = Pre.length;
            var PostCount = Post.length;
            var Pos = BoardUtil.Position(Index, size);
            var NewCells = Cells.Clone();
            var Impacted = [];
            if (Pre.length != 0) {
                for (var x = Pre.length - 1; x >= 0; x--) {
                    var cellIndex = BoardUtil.Abs(Pos.X - x, Pos.Y, size);
                    var n = BoardUtil.FindNeighbors(cellIndex, size);
                    if (n.Top != -1) {
                        NewCells[n.Top] += Pre[x];
                        Impacted.push(n.Top);
                        if (Pre[x] == null || Pre[x] == "") {
                            debugger;
                        }
                        Moves.push({ Tiles: Pre[x], Index: n.Top });
                    }
                    else {
                        return { Words: [], Direction: "V", WordsCount: 0, Moves: [] };
                    }
                }
            }
            if (Centers.length != 0) {
                for (var c = 0; c < Centers.length; c++) {
                    var cellIndex = BoardUtil.Abs(Pos.X + c, Pos.Y, size);
                    if (cellIndex == -1 || Centers[c] == "") {
                        continue;
                    }
                    NewCells[cellIndex] += Centers[c];
                    Impacted.push(cellIndex);
                    if (Centers[c] == null || Centers[c] == "") {
                        debugger;
                    }
                    Moves.push({ Tiles: Centers[c], Index: cellIndex });
                }
            }
            if (Post.length != 0) {
                for (var x = 0; x < Post.length; x++) {
                    var cellIndex = BoardUtil.Abs(Pos.X + offset + x, Pos.Y, size);
                    var n = BoardUtil.FindNeighbors(cellIndex, size);
                    if (n.Bottom != -1) {
                        NewCells[n.Bottom] += Post[x];
                        Impacted.push(n.Bottom);
                        if (Post[x] == null || Post[x] == "") {
                            debugger;
                        }
                        Moves.push({ Tiles: Post[x], Index: n.Bottom });
                    }
                    else {
                        return { Words: [], Direction: "V", WordsCount: 0, Moves: [] };
                    }
                }
            }
            var W = [];
            if (Star < 0 || (Star >= 0 && NewCells[Star] != "")) {
                for (var i in Impacted) {
                    var index = Impacted[i];
                    W = W.concat(EngineBase.WordsAt(NewCells, size, index));
                }
            }
            return { Mode: Mode, Words: W, Moves: Moves, WordsCount: W.length, Direction: "V" };
        };
        EngineBase.RefreshScores = function (Moves, Weights, tileWeights, size) {
            for (var indx in Moves) {
                var Move = Moves[indx];
                var score = 0;
                for (var indx2 in Move.Words) {
                    var w = Move.Words[indx2];
                    var wordScore = 0;
                    for (var indx3 in w.Cells) {
                        var cell = w.Cells[indx3];
                        var weight = Weights[cell.Index];
                        var cellScore = weight;
                        var tiles = cell.Target.split(',');
                        for (var indx4 in tiles) {
                            var tile = tiles[indx4];
                            if (tileWeights[tile] == null) {
                                debugger;
                                continue;
                            }
                            cellScore += tileWeights[tile];
                        }
                        cell.Score = cellScore;
                        wordScore += cellScore;
                    }
                    w.Score = wordScore;
                    score = score + wordScore;
                }
                Move.Score = score;
            }
            Moves.sort(function (x, y) { return x.Score - y.Score; });
            Moves.reverse();
        };
        EngineBase.WordsAt = function (Cells, size, index) {
            var List = [];
            var Neighbor = BoardUtil.FindNeighbors(index, size);
            var r = Neighbor.Right != -1 ? Cells[Neighbor.Right] : "";
            var l = Neighbor.Left != -1 ? Cells[Neighbor.Left] : "";
            var t = Neighbor.Top != -1 ? Cells[Neighbor.Top] : "";
            var b = Neighbor.Bottom != -1 ? Cells[Neighbor.Bottom] : "";
            var Lefties = [];
            var Righties = [];
            if (r != "") {
                Righties.push({ Tiles: r, Index: Neighbor.Right });
                var index_ = Neighbor.Right;
                var flg = true;
                while (flg) {
                    var n = BoardUtil.FindNeighbors(index_, size);
                    var r_ = n.Right != -1 ? Cells[n.Right] : "";
                    if (r_ == "") {
                        flg = false;
                        break;
                    }
                    Righties.push({ Tiles: r_, Index: n.Right });
                    index_ = n.Right;
                }
            }
            if (l != "") {
                Lefties.push({ Tiles: l, Index: Neighbor.Left });
                var index_ = Neighbor.Left;
                var flg = true;
                while (flg) {
                    var n = BoardUtil.FindNeighbors(index_, size);
                    var l_ = n.Left != -1 ? Cells[n.Left] : "";
                    if (l_ == "") {
                        flg = false;
                        break;
                    }
                    Lefties.push({ Tiles: l_, Index: n.Left });
                    index_ = n.Left;
                }
            }
            var Topies = [];
            var Downies = [];
            if (t != "") {
                Topies.push({ Tiles: t, Index: Neighbor.Top });
                var index_ = Neighbor.Top;
                var flg = true;
                while (flg) {
                    var n = BoardUtil.FindNeighbors(index_, size);
                    var t_ = n.Top != -1 ? Cells[n.Top] : "";
                    if (t_ == "") {
                        flg = false;
                        break;
                    }
                    Topies.push({ Tiles: t_, Index: n.Top });
                    index_ = n.Top;
                }
            }
            if (b != "") {
                Downies.push({ Tiles: b, Index: Neighbor.Bottom });
                var index_ = Neighbor.Bottom;
                var flg = true;
                while (flg) {
                    var n = BoardUtil.FindNeighbors(index_, size);
                    var d_ = n.Bottom != -1 ? Cells[n.Bottom] : "";
                    if (d_ == "") {
                        flg = false;
                        break;
                    }
                    Downies.push({ Tiles: d_, Index: n.Bottom });
                    index_ = n.Bottom;
                }
            }
            Topies.reverse();
            Lefties.reverse();
            if (Topies.length + Downies.length > 0) {
                var Vertical = EngineBase.MakeAWord(Topies, { Tiles: Cells[index], Index: index }, Downies);
                List.push(Vertical);
            }
            if (Lefties.length + Righties.length > 0) {
                var Harizontal = EngineBase.MakeAWord(Lefties, { Tiles: Cells[index], Index: index }, Righties);
                List.push(Harizontal);
            }
            return List;
        };
        EngineBase.MakeAWord = function (F1, C, F2) {
            var W = {};
            var List = [];
            var ret = "";
            for (var indx in F1) {
                var s = F1[indx];
                ret = ret + s.Tiles.Replace(",", "") + ",";
                var Cell = { Target: s.Tiles, Index: s.Index };
                List.push(Cell);
            }
            {
                ret = ret + C.Tiles.Replace(",", "") + ",";
                var Cell = { Target: C.Tiles, Index: C.Index };
                List.push(Cell);
            }
            for (var indx in F2) {
                var s = F2[indx];
                ret = ret + s.Tiles.Replace(",", "") + ",";
                var Cell = { Target: s.Tiles, Index: s.Index };
                List.push(Cell);
            }
            ret = ret.Trim(',');
            W.String = ret;
            W.Cells = List;
            return W;
        };
        return EngineBase;
    }());
    exports.EngineBase = EngineBase;
    var RegexEngineBase = (function (_super) {
        __extends(RegexEngineBase, _super);
        function RegexEngineBase() {
            _super.apply(this, arguments);
        }
        RegexEngineBase.prototype.BestMove = function (Board) {
            var Moves = this.Probables(Board);
            if (Moves.length == 0) {
                return null;
            }
            return Moves[0];
        };
        RegexEngineBase.prototype.Probables = function (Board) {
            return [];
        };
        RegexEngineBase.prototype.Validate = function (InputDict, CharCount) {
            if (InputDict == null) {
                return true;
            }
            var isValid = true;
            for (var key in CharCount) {
                var item = CharCount[key];
                if (InputDict[key] == null) {
                    isValid = false;
                    break;
                }
                if (InputDict[item.Key] < item.Value) {
                    isValid = false;
                    break;
                }
            }
            return isValid;
        };
        RegexEngineBase.Resolve2 = function (prev, Tiles, SpeicalList) {
            if (U.Util.IsNullOrEmpty(prev)) {
                return { res: true, temp: "" };
            }
            if (prev.length == 1) {
                if (Tiles.Contains(prev)) {
                    Tiles.Remove(prev);
                    return { res: true, temp: prev };
                }
                else {
                    return { res: false, temp: prev };
                }
            }
            else {
                if (SpeicalList.hasOwnProperty(prev)) {
                    if (Tiles.Contains(prev)) {
                        Tiles.Remove(prev);
                        return { res: true, temp: prev };
                    }
                }
                for (var key in SpeicalList) {
                    var special = SpeicalList[key];
                    if (!special.test(prev)) {
                        continue;
                    }
                    if (Tiles.Contains(key)) {
                        Tiles.Remove(key);
                    }
                    else {
                        continue;
                    }
                    var order = [];
                    var M = special.exec(prev);
                    var Pre = M.groups["Pre"];
                    var Center = M.groups["Center"];
                    var Post = M.groups["Post"];
                    if (!U.Util.IsNullOrEmpty(Pre)) {
                        var temp = "";
                        var resolved = RegexEngine.Resolve2(Pre, Tiles, SpeicalList);
                        if (!resolved.res) {
                            return { res: false, temp: Pre };
                        }
                        temp = resolved.temp;
                        order.push(U.Util.IsNullOrEmpty(temp) ? Pre : temp);
                    }
                    order.push(special.Key);
                    if (!U.Util.IsNullOrEmpty(Center)) {
                        var temp = "";
                        var resolved = RegexEngine.Resolve2(Center, Tiles, SpeicalList);
                        if (!resolved.res) {
                            return { res: false, temp: Center };
                        }
                        order.push(U.Util.IsNullOrEmpty(temp) ? Center : temp);
                    }
                    if (!U.Util.IsNullOrEmpty(Post)) {
                        var temp = "";
                        var resolved = RegexEngine.Resolve2(Post, Tiles, SpeicalList);
                        if (!resolved) {
                            return { res: false, temp: "" };
                        }
                        order.push(U.Util.IsNullOrEmpty(temp) ? Post : temp);
                    }
                    return { res: true, temp: order.join(',') };
                }
                {
                    var order = [];
                    for (var i = 0; i < prev.length; i++) {
                        var c = prev[i];
                        if (Tiles.Contains(c)) {
                            Tiles.Remove(c);
                            order.push(c);
                        }
                        else {
                            return { res: false, temp: c };
                        }
                    }
                    return { res: true, temp: order.join(',') };
                }
            }
        };
        RegexEngineBase.Resolve = function (Pres, Centers, Posts, Tiles, SpeicalDict) {
            var res = true;
            for (var i = 0; i < Pres.length; i++) {
                var tile = Pres[i];
                var result = RegexEngine.Resolve2(tile, Tiles, SpeicalDict);
                if (!result.res) {
                    return false;
                }
                var temp = result.temp;
                if (!U.Util.IsNullOrEmpty(temp)) {
                    Pres[i] = temp;
                }
            }
            for (var i = 0; i < Centers.length; i++) {
                var tile = Centers[i];
                var result = RegexEngine.Resolve2(tile, Tiles, SpeicalDict);
                if (!result.res) {
                    return false;
                }
                var temp = result.temp;
                if (!U.Util.IsNullOrEmpty(temp)) {
                    Centers[i] = temp;
                }
            }
            for (var i = 0; i < Posts.length; i++) {
                var tile = Posts[i];
                var result = RegexEngine.Resolve2(tile, Tiles, SpeicalDict);
                if (!result.res) {
                    return false;
                }
                var temp = result.temp;
                if (!U.Util.IsNullOrEmpty(temp)) {
                    Posts[i] = temp;
                }
            }
            return true;
        };
        RegexEngineBase.prototype.MatchedWords = function (words, Pattern) {
            var r = RegExp(Pattern);
            var List = words.filter(function (s) { return r.test(s.Tiles); });
            return List;
        };
        RegexEngineBase.MatchedString = function (group, seperator) {
            if (group == null) {
                return "";
            }
            var ret = "";
            for (var indx in group) {
                var capture = group[indx];
                ret = ret + capture + seperator;
            }
            if (!U.Util.IsNullOrEmpty(seperator)) {
                ret = ret.TrimEnd(seperator);
            }
            return ret;
        };
        RegexEngineBase.GetWordsOnBoard = function (Cells, size, includeDuplicates) {
            var Words = [];
            for (var i = 0; i < size; i++) {
                var R = RegexEngine.GetWords(Cells, "R", i, size, includeDuplicates);
                var C = RegexEngine.GetWords(Cells, "C", i, size, includeDuplicates);
                Words = Words.concat(R);
                Words = Words.concat(C);
            }
            return Words;
        };
        RegexEngineBase.GetWords = function (Cells, option, r, size, includeDuplicates) {
            var Words = [];
            var pending = "";
            var cnt = 0;
            for (var i = 0; i < size; i++) {
                var index = -1;
                switch (option) {
                    case "R":
                        index = BoardUtil.Abs(r, i, size);
                        break;
                    case "C":
                        index = BoardUtil.Abs(i, r, size);
                        break;
                }
                var cell = Cells[index];
                if (cell != "") {
                    pending += "(" + cell + ")|";
                    cnt++;
                    continue;
                }
                if (pending != "" && cell == "") {
                    if (cnt > 1) {
                        var word = pending.TrimEnd('|');
                        if (includeDuplicates) {
                            var startIndex = RegexEngine.GetStartIndex(option, r, i, size, cnt);
                            Words.push({ Tiles: word, Syllables: cnt, Position: option, Index: startIndex });
                        }
                        else {
                            var X = Words.filter(function (x) { return x.Tiles == word; });
                            if (X == null || X.length == 0) {
                                var startIndex = RegexEngine.GetStartIndex(option, r, i, size, cnt);
                                Words.push({ Tiles: word, Syllables: cnt, Position: option, Index: startIndex });
                            }
                        }
                    }
                    pending = "";
                    cnt = 0;
                    continue;
                }
            }
            if (cnt > 1) {
                var word = pending.TrimEnd('|');
                if (includeDuplicates) {
                    var startIndex = RegexEngine.GetStartIndex(option, r, size, size, cnt);
                    Words.push({ Tiles: word, Syllables: cnt, Position: option, Index: startIndex });
                }
                else {
                    var X = Words.filter(function (x) { return x.Tiles == word; });
                    if (X == null || X.length == 0) {
                        var startIndex = RegexEngine.GetStartIndex(option, r, size, size, cnt);
                        Words.push({ Tiles: word, Syllables: cnt, Position: option, Index: startIndex });
                    }
                }
            }
            return Words;
        };
        RegexEngineBase.GetStartIndex = function (option, r, pos, size, move) {
            switch (option) {
                case "R":
                    return BoardUtil.Abs(r, pos - move, size);
                case "C":
                    return BoardUtil.Abs(pos - move, r, size);
            }
            return -1;
        };
        RegexEngineBase.GetSyllableList2 = function (Cells, size, filter, free) {
            var List = [];
            for (var index = 0; index < Cells.length; index++) {
                var cell = Cells[index];
                if (cell == "") {
                    continue;
                }
                var Neighbor = BoardUtil.FindNeighbors(index, size);
                var r = Neighbor.Right != -1 ? Cells[Neighbor.Right] : "";
                var l = Neighbor.Left != -1 ? Cells[Neighbor.Left] : "";
                var t = Neighbor.Top != -1 ? Cells[Neighbor.Top] : "";
                var b = Neighbor.Bottom != -1 ? Cells[Neighbor.Bottom] : "";
                if (filter) {
                    if ((r != "" || l != "") && (t != "" || b != "")) {
                    }
                    else {
                        var x = free ? cell : "(" + cell + ")";
                        List.push({ Tiles: x, Index: index });
                    }
                }
                else {
                    var x = free ? cell : "(" + cell + ")";
                    List.push({ Tiles: x, Index: index });
                }
            }
            return List;
        };
        RegexEngineBase.prototype.GetSyllableList = function (Cells, size, fetchAll, filterEdges, asGroups) {
            var List = [];
            for (var index = 0; index < Cells.length; index++) {
                var cell = Cells[index];
                if (cell == "") {
                    continue;
                }
                var Neighbor = BoardUtil.FindNeighbors(index, size);
                var r = Neighbor.Right != -1 ? Cells[Neighbor.Right] : "";
                var l = Neighbor.Left != -1 ? Cells[Neighbor.Left] : "";
                var t = Neighbor.Top != -1 ? Cells[Neighbor.Top] : "";
                var b = Neighbor.Bottom != -1 ? Cells[Neighbor.Bottom] : "";
                if (!fetchAll) {
                    if ((r != "" || l != "") && (t != "" || b != "")) {
                        if (!filterEdges) {
                            var x = asGroups ? cell : "(" + cell + ")";
                            if (!List.Contains(x)) {
                                List.push(x);
                            }
                        }
                    }
                    else {
                        if (filterEdges) {
                            var x = asGroups ? cell : "(" + cell + ")";
                            if (!List.Contains(x)) {
                                List.push(x);
                            }
                        }
                    }
                }
                else {
                    var x = asGroups ? cell : "(" + cell + ")";
                    if (!List.Contains(x)) {
                        List.push(x);
                    }
                }
            }
            return List;
        };
        RegexEngineBase.GetSpecialSyllablePattern2 = function (CharSet, specialOptions) {
            if (U.Util.IsNullOrEmpty(specialOptions)) {
                return "";
            }
            var ret = "";
            {
                var temp = "";
                var Consos = [];
                var Vowels = [];
                RegexEngineBase.Classify2(CharSet, specialOptions, Consos, Vowels);
                if (Vowels.length > 0 && Consos.length > 0) {
                    for (var indx in Consos) {
                        var a = Consos[indx];
                        temp = temp + a;
                    }
                    temp = temp + "(?<Center>.*?)";
                    for (var indx in Vowels) {
                        var a = Vowels[indx];
                        temp = temp + a;
                    }
                    temp = "(?<Pre>.*?)" + temp + "(?<Post>.*?)";
                }
                else {
                    for (var indx in Consos) {
                        var a = Consos[indx];
                        temp = temp + a;
                    }
                    for (var indx in Vowels) {
                        var a = Vowels[indx];
                        temp = temp + a;
                    }
                    temp = "(?<Pre>.*?)" + temp + "(?<Post>.*?)";
                }
                ret = "^" + temp + "$";
            }
            return ret;
        };
        RegexEngineBase.GetSyllablePattern = function (CharSet, syllable, consoPatternNoComma, sunnaPattern, allPatternNoComma) {
            var temp = "";
            var Consos = [];
            var Vowels = [];
            RegexEngineBase.Classify(CharSet, syllable, Consos, Vowels);
            if (Vowels.length > 0 && Consos.length > 0) {
                var tempC = "";
                for (var indx in Consos) {
                    var a = Consos[indx];
                    tempC = tempC + a;
                }
                var tempA = "";
                for (var indx in Vowels) {
                    var a = Vowels[indx];
                    tempA = tempA + a;
                }
                temp = U.Util.Format("{0}{1}{2}{3}", [tempC, consoPatternNoComma, tempA, sunnaPattern]);
            }
            else {
                for (var indx in Consos) {
                    var a = Consos[indx];
                    temp = temp + a;
                }
                if (Vowels.length == 0) {
                    temp = U.Util.Format("{0}{1}", [temp, allPatternNoComma == "" ? "" : (allPatternNoComma)]);
                }
                for (var indx in Vowels) {
                    var a = Vowels[indx];
                    temp = temp + a;
                }
                if (Consos.length == 0) {
                    temp = U.Util.Format("{0}{1}", [temp, sunnaPattern]);
                }
                if (Vowels.length == 0 && Consos.length == 0) {
                    debugger;
                }
            }
            return temp;
        };
        RegexEngineBase.GetSyllablePattern2 = function (CharSet, syllable, consoPatternNoComma, prePattern, PostPattern) {
            var temp = "";
            var Consos = [];
            var Vowels = [];
            RegexEngineBase.Classify(CharSet, syllable, Consos, Vowels);
            if (Vowels.length > 0 && Consos.length > 0) {
                var tempC = "";
                for (var indx in Consos) {
                    var a = Consos[indx];
                    tempC = tempC + a;
                }
                var tempA = "";
                for (var indx in Vowels) {
                    var a = Vowels[indx];
                    tempA = tempA + a;
                }
                temp = U.Util.Format("({3}({0}{1}{2}){4})", [tempC, consoPatternNoComma, tempA, prePattern, PostPattern]);
            }
            else {
                for (var indx in Consos) {
                    var a = Consos[indx];
                    temp = temp + a;
                }
                for (var indx in Vowels) {
                    var a = Vowels[indx];
                    temp = temp + a;
                }
                temp = U.Util.Format("({1}{0}{2})", [temp, prePattern, PostPattern]);
            }
            return temp;
        };
        RegexEngineBase.Join = function (str, join) {
            var ret = "";
            for (var indx = 0; indx < str.length; indx++) {
                var ch = str[indx];
                ret = ret + ch + join;
            }
            ret = ret.TrimEnd(join);
            return ret;
        };
        RegexEngineBase.prototype.GetFlatList2 = function (inputs) {
            var list = inputs.Clone();
            list.sort();
            var X = [];
            for (var indx in list) {
                var input = list[indx];
                if (!X.Contains(input)) {
                    X.push(input);
                }
            }
            return this.GetFlatList(X, ' ').Replace(" ", "");
        };
        RegexEngineBase.prototype.GetFlatList = function (List, Seperator) {
            var ret = "";
            for (var indx in List) {
                var s = List[indx];
                ret = ret + s + Seperator;
            }
            ret = ret.TrimEnd(Seperator);
            return ret;
        };
        RegexEngineBase.prototype.GetFlatList3 = function (List, Seperator) {
            var ret = "";
            for (var indx in List) {
                var s = List[indx];
                ret = ret + s.Tiles + Seperator;
            }
            ret = ret.TrimEnd(Seperator);
            return ret;
        };
        RegexEngineBase.prototype.DistinctList = function (Set, Seperator) {
            var List = [];
            var arr = Set.split(Seperator);
            for (var indx in arr) {
                var s = arr[indx];
                if (U.Util.IsNullOrEmpty(s)) {
                    continue;
                }
                if (!List.Contains(s)) {
                    List.push(s);
                }
            }
            return List;
        };
        RegexEngineBase.prototype.GetCountDict2 = function (input) {
            var Dict = {};
            var arr = input.split(',');
            for (var indx in arr) {
                var s = arr[indx];
                for (var indx2 = 0; indx2 < s.length; indx2++) {
                    var c = s[indx2];
                    if (Dict.hasOwnProperty(c)) {
                        Dict[c]++;
                    }
                    else {
                        Dict[c] = 1;
                    }
                }
            }
            return Dict;
        };
        RegexEngineBase.prototype.GetCountDict = function (inputs) {
            if (inputs == null) {
                return null;
            }
            var Dict = {};
            for (var indx in inputs) {
                var input = inputs[indx];
                if (U.Util.IsNullOrEmpty(input)) {
                    continue;
                }
                if (Dict.hasOwnProperty(input)) {
                    Dict[input]++;
                }
                else {
                    Dict[input] = 1;
                }
            }
            return Dict;
        };
        RegexEngineBase.Classify = function (CharSet, syllable, Consos, Vowels) {
            var Sunna = [];
            var arr = syllable.split(',');
            for (var indx in arr) {
                var c = arr[indx];
                if (CharSet.SunnaSet.Contains(c)) {
                    Sunna.push(c);
                }
                else {
                    if (CharSet.Vowels.Contains(c)) {
                        Vowels.push(c);
                    }
                    else if (CharSet.Consonents.Contains(c)) {
                        Consos.push(c);
                    }
                    else {
                        debugger;
                    }
                }
            }
            Vowels = Vowels.concat(Sunna);
        };
        RegexEngineBase.Classify2 = function (CharSet, syllable, Consos, Vowels) {
            var Sunna = [];
            for (var indx = 0; indx < syllable.length; indx++) {
                var c = syllable[indx];
                if (CharSet.SunnaSet.Contains(c)) {
                    Sunna.push(c);
                }
                else {
                    if (CharSet.Vowels.Contains(c)) {
                        Vowels.push(c);
                    }
                    else if (CharSet.Consonents.Contains(c)) {
                        Consos.push(c);
                    }
                    else {
                        debugger;
                    }
                }
            }
            Vowels = Vowels.concat(Sunna);
        };
        RegexEngineBase.GenWordPattern = function (CharSet, word, consoPatternNoComma, sunnaPattern, allPatternNoComma, prePattern, postPattern, useSyllableIndex) {
            var temp = "";
            var arr = word.split('|');
            for (var i = 0; i < arr.length; i++) {
                var syllable = arr[i];
                var pattern = "";
                if (useSyllableIndex) {
                    pattern = RegexEngine.GetSyllablePattern(CharSet, syllable.Replace("(", "").Replace(")", ""), U.Util.Format(consoPatternNoComma, [i + 1]), U.Util.Format(sunnaPattern, [i + 1]), i == arr.length - 1 ? "" : U.Util.Format(allPatternNoComma, [i + 1]));
                }
                else {
                    pattern = RegexEngine.GetSyllablePattern(CharSet, syllable.Replace("(", "").Replace(")", ""), consoPatternNoComma, sunnaPattern, i == arr.length - 1 ? "" : allPatternNoComma);
                }
                temp = temp + pattern + ",";
            }
            temp = temp.TrimEnd(',');
            temp = prePattern + temp + postPattern;
            temp = U.Util.Format("({0})|", [temp]);
            return temp;
        };
        RegexEngineBase.prototype.GetSpecialDict = function (CharSet, SpecialList) {
            var SpeicalDict = {};
            for (var indx in SpecialList) {
                var sp = SpecialList[indx];
                var pattern = RegexEngine.GetSpecialSyllablePattern2(CharSet, sp);
                SpeicalDict[sp] = new RegExp(pattern);
            }
            return SpeicalDict;
        };
        RegexEngineBase.prototype.MaxWeightIndex = function (Weights) {
            var maxIndex = 0;
            var maxVal = 0;
            var index = 0;
            for (var indx in Weights) {
                var weight = Weights[index];
                if (weight > maxVal) {
                    maxVal = weight;
                    maxIndex = index;
                }
                index++;
            }
            return maxIndex;
        };
        return RegexEngineBase;
    }(EngineBase));
    exports.RegexEngineBase = RegexEngineBase;
    var RegexEngine = (function (_super) {
        __extends(RegexEngine, _super);
        function RegexEngine() {
            _super.apply(this, arguments);
        }
        RegexEngine.prototype.Probables = function (Board) {
            var Moves = [];
            if (Board == null) {
                return;
            }
            var bot = GameConfig.GetBot(Board.Bot);
            var board = GameConfig.GetBoard(Board.Name);
            if (board == null) {
                return;
            }
            var CharSet = GameConfig.GetCharSet(board.Language);
            var id = bot.Id + Board.Id;
            var size = board.Size;
            var weights = board.Weights;
            var tileWeights = board.TileWeights;
            var start = board.Star;
            var cells = Board.Cells;
            var vowels = Board.Vowels;
            var conso = Board.Conso;
            var special = Board.Special;
            var file = (bot == null) ? CharSet.Dictionary : bot.Dictionary;
            if (CharSet == null || cells == null || weights == null || U.Util.IsNullOrEmpty(file) ||
                (U.Util.IsNullOrEmpty(vowels) && U.Util.IsNullOrEmpty(conso) && U.Util.IsNullOrEmpty(special))) {
                return Moves;
            }
            if (cells.length != size * size || weights.length != size * size) {
                return Moves;
            }
            var All = [];
            var AllPattern = "";
            var Movables = (vowels + " " + conso + " " + special);
            var MovableList = Movables.Replace("(", " ").Replace(")", " ").Replace(",", "").split(' ');
            MovableList = MovableList.filter(function (x) { return x.length != 0; });
            var SpecialList = this.DistinctList(special.Replace("(", " ").Replace(")", " ").Replace(",", ""), ' ');
            var SpeicalDict = this.GetSpecialDict(CharSet, SpecialList);
            var EverySyllableOnBoard = this.GetSyllableList(cells, size, true, false, true);
            var NonCornerSyllables = this.GetSyllableList(cells, size, false, true, false);
            All = (this.GetFlatList(EverySyllableOnBoard, ',') + " " + Movables).Replace("(", " ").Replace(")", " ").Replace(",", " ").Replace("|", " ").split(' ');
            AllPattern = U.Util.Format("^(?<All>[{0},])*$", [this.GetFlatList2(All)]);
            var AllDict = this.GetCountDict(All);
            var WordsDictionary = WL.WordLoader.LoadWords(file, (bot == null));
            WordsDictionary = this.ShortList(WordsDictionary, AllPattern, AllDict);
            if (EverySyllableOnBoard.length > 0) {
                var NonCornerTiles = [];
                var NonCornerPattern = "";
                NonCornerTiles = (this.GetFlatList2(NonCornerSyllables) + " " + Movables).Replace("(", " ").Replace(")", " ").Replace(",", " ").Replace("|", " ").split(' ');
                NonCornerPattern = U.Util.Format("^(?<All>[{0},])*$", [this.GetFlatList2(NonCornerTiles)]);
                var NonCornerDict = this.GetCountDict(NonCornerTiles);
                var NonCornerProbables = this.ShortList(WordsDictionary, NonCornerPattern, NonCornerDict);
                Moves = Moves.concat(RegexEngine.SyllableExtensions(cells, size, CharSet, WordsDictionary, NonCornerProbables, MovableList, SpeicalDict));
                Moves = Moves.concat(RegexEngine.WordExtensions(cells, size, CharSet, WordsDictionary, MovableList, SpeicalDict));
            }
            else {
                Moves = Moves.concat(RegexEngine.EmptyExtensions(cells, size, CharSet, start, WordsDictionary, MovableList, SpeicalDict));
            }
            WordsDictionary = null;
            EngineBase.RefreshScores(Moves, weights, tileWeights, size);
            return Moves;
        };
        RegexEngine.EmptyExtensions = function (Cells, size, CharSet, startIndex, AllWords, Movables, SpeicalDict) {
            var Moves = [];
            {
                for (var indx in AllWords) {
                    var word = AllWords[indx];
                    var Pre = "";
                    var Center = "";
                    var Post = "";
                    var f = word.Tiles.indexOf(',');
                    Center = word.Tiles.substring(0, f);
                    Post = word.Tiles.substring(f + 1);
                    var Pres = Pre == "" ? [] : Pre.TrimEnd(',').split(',');
                    var Centers = Center.split(',');
                    var Posts = Post == "" ? [] : Post.TrimStart(',').split(',');
                    var Tiles = Movables.slice(0, Movables.length);
                    var res = RegexEngine.Resolve(Pres, Centers, Posts, Tiles, SpeicalDict);
                    if (!res) {
                        continue;
                    }
                    var totalCells = Pres.length + Centers.length + Posts.length;
                    var centroid = totalCells % 2 == 0 ? (Math.floor(totalCells / 2) - 1) : Math.floor(totalCells / 2);
                    var WH = EngineBase.TryHarizontal(0, startIndex, Cells, size, startIndex - centroid, 0, Pres, Centers, Posts);
                    var WV = EngineBase.TryVertical(0, startIndex, Cells, size, startIndex - centroid, 0, Pres, Centers, Posts);
                    var WHValid = RegexEngine.Validate3(WH, AllWords);
                    var WVValid = RegexEngine.Validate3(WV, AllWords);
                    if (WHValid) {
                        Moves.push(WH);
                    }
                    if (WVValid) {
                        Moves.push(WV);
                    }
                }
            }
            return Moves;
        };
        RegexEngine.SyllableExtensions = function (Cells, size, CharSet, AllWords, Probables, Movables, SpeicalDict) {
            var Moves = [];
            {
                var All = RegexEngine.GetSyllableList2(Cells, size, false, true);
                for (var indx in All) {
                    var syllable = All[indx];
                    var pattern = RegexEngine.GetSyllablePattern2(CharSet, syllable.Tiles.Replace("(", "").Replace(")", ""), "(?<Center>.*?)", "(?<Pre>.*?)", "(?<Post>.*?)");
                    pattern = U.Util.Format("^{0}$", [pattern]);
                    var R = new RegExp(pattern);
                    {
                        for (var indx2 in Probables) {
                            var probable = Probables[indx2];
                            if (!R.test(probable.Tiles)) {
                                continue;
                            }
                            var M = R.exec(probable.Tiles);
                            var Pre = RegexEngine.MatchedString(M.groups["Pre"], "");
                            var Center = RegexEngine.MatchedString(M.groups["Conso"], "");
                            var Post = RegexEngine.MatchedString(M.groups["Post"], "");
                            var Pres = Pre == "" ? [] : Pre.TrimEnd(',').split(',');
                            var Centers = Center == "" ? [] : Center.split(',');
                            var Posts = Post == "" ? [] : Post.TrimStart(',').split(',');
                            if (!Post.StartsWith(",") && Posts.length > 0) {
                                Centers = (Center + Posts[0]).split(',');
                                Posts = Posts.slice(1);
                            }
                            var Tiles = Movables.slice(0, Movables.length);
                            var res = RegexEngine.Resolve(Pres, Centers, Posts, Tiles, SpeicalDict);
                            if (!res) {
                                continue;
                            }
                            var WH = EngineBase.TryHarizontal(1, -1, Cells, size, syllable.Index, 0, Pres, Centers, Posts);
                            var WV = EngineBase.TryVertical(1, -1, Cells, size, syllable.Index, 0, Pres, Centers, Posts);
                            var WHValid = RegexEngine.Validate3(WH, AllWords);
                            var WVValid = RegexEngine.Validate3(WV, AllWords);
                            if (WHValid) {
                                Moves.push(WH);
                            }
                            if (WVValid) {
                                Moves.push(WV);
                            }
                        }
                    }
                }
            }
            return Moves;
        };
        RegexEngine.WordExtensions = function (Cells, size, CharSet, AllWords, Movables, SpeicalDict) {
            var Moves = [];
            {
                var WordsOnBoard = RegexEngine.GetWordsOnBoard(Cells, size, false);
                for (var indx in WordsOnBoard) {
                    var wordOnBoard = WordsOnBoard[indx];
                    var raw = wordOnBoard.Tiles.Replace("(", "").Replace(")", "").Replace(",", "").Replace("|", ",");
                    var len = raw.split(',').length;
                    var pattern = RegexEngine.GenWordPattern(CharSet, wordOnBoard.Tiles, "(?<Center{0}>.*?)", "", "(?<Center{0}>.*?)", "(?<Pre>.*?)", "(?<Post>.*?)", true);
                    pattern = U.Util.Format("^{0}$", [pattern.TrimEnd('|')]);
                    var R = new RegExp(pattern);
                    {
                        for (var indx2 in AllWords) {
                            var word = AllWords[indx2];
                            if (raw == word.Tiles) {
                                continue;
                            }
                            if (!R.test(word.Tiles)) {
                                continue;
                            }
                            var M = R.exec(word.Tiles);
                            var Pre = "";
                            var Post = "";
                            var Center = "";
                            Pre = RegexEngine.MatchedString(M.groups["Pre"], "");
                            for (var i = 0; i < word.Syllables; i++) {
                                Center = Center + RegexEngine.MatchedString(M.groups["Center" + (i + 1)], ",") + ":";
                            }
                            Center = Center.TrimEnd(':');
                            Post = RegexEngine.MatchedString(M.groups["Post"], "");
                            var Pres = Pre == "" ? [] : Pre.TrimEnd(',').split(',');
                            var Centers = Center.split(':');
                            var Posts = Post == "" ? [] : Post.TrimStart(',').split(',');
                            if (Centers.length != len) {
                                if (!Post.StartsWith(",") && Posts.length > 0) {
                                    Centers.push(Posts[0]);
                                    Posts = Posts.slice(1);
                                }
                            }
                            var Tiles = Movables.slice(0, Movables.length);
                            var res = RegexEngine.Resolve(Pres, Centers, Posts, Tiles, SpeicalDict);
                            if (!res) {
                                continue;
                            }
                            if (wordOnBoard.Position == "R") {
                                var WH = EngineBase.TryHarizontal(3, -1, Cells, size, wordOnBoard.Index, wordOnBoard.Syllables - 1, Pres, Centers, Posts);
                                var WHValid = RegexEngine.Validate3(WH, AllWords);
                                if (WHValid) {
                                    Moves.push(WH);
                                }
                            }
                            if (wordOnBoard.Position == "C") {
                                var WH = EngineBase.TryVertical(3, -1, Cells, size, wordOnBoard.Index, wordOnBoard.Syllables - 1, Pres, Centers, Posts);
                                var WHValid = RegexEngine.Validate3(WH, AllWords);
                                if (WHValid) {
                                    Moves.push(WH);
                                }
                            }
                        }
                    }
                }
            }
            return Moves;
        };
        RegexEngine.prototype.ShortList = function (Words, NonCornerPattern, Dict) {
            if (U.Util.IsNullOrEmpty(NonCornerPattern)) {
                return [];
            }
            var Matches = this.MatchedWords(Words, NonCornerPattern);
            var Shortlisted = [];
            {
                for (var indx in Matches) {
                    var word = Matches[indx];
                    if (word.Syllables == 1) {
                        continue;
                    }
                    var CharCount = this.GetCountDict2(word.Tiles);
                    var isValid = this.Validate(Dict, CharCount);
                    if (!isValid) {
                        continue;
                    }
                    Shortlisted.push(word);
                }
            }
            return Shortlisted;
        };
        RegexEngine.Validate3 = function (WV, AllWords) {
            WV.Words = ProbableWordComparer.Distinct(WV.Words);
            WV.WordsCount = WV.Words.length;
            if (WV.Words.length == 0 || WV.Moves.length == 0) {
                return false;
            }
            return RegexEngine.Validate2(WV.Words, AllWords);
        };
        RegexEngine.Validate2 = function (WV, AllWords) {
            for (var indx in WV) {
                var w = WV[indx];
                var v = AllWords.filter(function (x) { return x.Tiles == w.String; });
                if (v == null || v.length == 0) {
                    return false;
                }
            }
            return true;
        };
        return RegexEngine;
    }(RegexEngineBase));
    exports.RegexEngine = RegexEngine;
    var RegexV2Engine = (function (_super) {
        __extends(RegexV2Engine, _super);
        function RegexV2Engine() {
            _super.apply(this, arguments);
        }
        RegexV2Engine.prototype.Probables = function (Board) {
            var st = performance.now();
            var Moves = [];
            if (Board == null) {
                return;
            }
            var bot = GameConfig.GetBot(Board.Bot);
            var board = GameConfig.GetBoard(Board.Name);
            if (board == null) {
                return;
            }
            var CharSet = GameConfig.GetCharSet(board.Language);
            var id = (bot == null ? board.Name : bot.Id) + Board.Id;
            var size = board.Size;
            var weights = board.Weights;
            var tileWeights = board.TileWeights;
            var star = board.Star;
            var cells = Board.Cells;
            var vowels = Board.Vowels;
            var conso = Board.Conso;
            var special = Board.Special;
            var file = (bot == null) ? CharSet.Dictionary : bot.Dictionary;
            if (CharSet == null || cells == null || weights == null || U.Util.IsNullOrEmpty(file) ||
                (U.Util.IsNullOrEmpty(vowels) && U.Util.IsNullOrEmpty(conso) && U.Util.IsNullOrEmpty(special))) {
                return Moves;
            }
            if (cells.length != size * size || weights.length != size * size) {
                return Moves;
            }
            var All = [];
            var AllPattern = "";
            var Movables = (vowels + " " + conso + " " + special);
            var MovableTiles = Movables.Replace("(", " ").Replace(")", " ").Replace(",", "").split(' ');
            MovableTiles = MovableTiles.filter(function (x) { return x.length != 0; });
            var SpecialList = this.DistinctList(special.Replace("(", " ").Replace(")", " ").Replace(",", ""), ' ');
            var SpeicalDict = this.GetSpecialDict(CharSet, SpecialList);
            var EverySyllableOnBoard = this.GetSyllableList(cells, size, true, false, true);
            All = (this.GetFlatList(EverySyllableOnBoard, ',') + " " + Movables).Replace("(", " ").Replace(")", " ").Replace(",", " ").Replace("|", " ").split(' ');
            AllPattern = U.Util.Format("^(?<All>[{0},])*$", [this.GetFlatList2(All)]);
            var AllDict = this.GetCountDict(All);
            var WordsDictionary = WL.WordLoader.LoadWords(file, (bot == null));
            var ContextualList = [];
            if (RegexV2Engine.CL) {
                ContextualList = this.ShortList2(WordsDictionary, AllPattern, AllDict);
                if (ContextualList.length > WordsDictionary.length * RegexV2Engine.Threshlod) {
                    RegexV2Engine.CL = false;
                }
            }
            if (EverySyllableOnBoard.length > 0) {
                {
                    var NonCornerSyllables = this.GetSyllableList(cells, size, false, true, false);
                    var NonCornerTiles = [];
                    var NonCornerPattern = "";
                    var NonCornerDict = {};
                    NonCornerTiles = (this.GetFlatList2(NonCornerSyllables) + " " + Movables).Replace("(", " ").Replace(")", " ").Replace(",", " ").Replace("|", " ").split(' ');
                    NonCornerPattern = U.Util.Format("^(?<All>[{0},])*$", [this.GetFlatList2(NonCornerTiles)]);
                    NonCornerDict = this.GetCountDict(NonCornerTiles);
                    var NonCornerProbables = [];
                    if (RegexV2Engine.CL) {
                        NonCornerProbables = this.ShortList3(WordsDictionary, ContextualList, NonCornerPattern, NonCornerDict);
                    }
                    else {
                        NonCornerProbables = this.ShortList2(WordsDictionary, NonCornerPattern, NonCornerDict);
                    }
                    Moves = Moves.concat(RegexV2Engine.SyllableExtensions2(cells, size, CharSet, id, WordsDictionary, NonCornerProbables, MovableTiles, SpeicalDict));
                    NonCornerDict = null;
                    NonCornerProbables = null;
                    NonCornerTiles = null;
                }
                {
                    var CornerSyllables = this.GetSyllableList(cells, size, false, false, false);
                    var CornerTiles = [];
                    var CornerPattern = "";
                    var CornerDict = {};
                    CornerTiles = (this.GetFlatList2(CornerSyllables) + " " + Movables).Replace("(", " ").Replace(")", " ").Replace(",", " ").Replace("|", " ").split(' ');
                    CornerPattern = U.Util.Format("^(?<All>[{0},])*$", [this.GetFlatList2(CornerTiles)]);
                    CornerDict = this.GetCountDict(CornerTiles);
                    var CornerProbables = [];
                    if (RegexV2Engine.CL) {
                        CornerProbables = this.ShortList3(WordsDictionary, ContextualList, CornerPattern, CornerDict);
                    }
                    else {
                        CornerProbables = this.ShortList2(WordsDictionary, CornerPattern, CornerDict);
                    }
                    Moves = Moves.concat(RegexV2Engine.WordExtensions2(cells, size, CharSet, id, WordsDictionary, CornerProbables, MovableTiles, SpeicalDict));
                    CornerDict = null;
                    CornerProbables = null;
                    CornerTiles = null;
                }
            }
            else {
                Moves = Moves.concat(RegexV2Engine.EmptyExtensions2(cells, size, CharSet, star, WordsDictionary, ContextualList, MovableTiles, SpeicalDict));
            }
            WordsDictionary = null;
            EngineBase.RefreshScores(Moves, weights, tileWeights, size);
            if (console) {
                console.log(U.Util.Format("Moves: V2: {0}", [U.Util.ElapsedTime(performance.now() - st)]));
            }
            if (console && Moves.length > 0) {
                console.log(U.Util.Format("Mode: {0}", [Moves[0].Mode]));
            }
            if (console) {
                console.log("\t\t");
            }
            return Moves;
        };
        RegexV2Engine.prototype.ShortList2 = function (Words, Pattern, Dict) {
            if (U.Util.IsNullOrEmpty(Pattern)) {
                return [];
            }
            var st = performance.now();
            var R = RegExp(Pattern);
            var Matches = this.MatchedWords(Words, Pattern);
            var Shortlisted = [];
            {
                for (var indx in Matches) {
                    var word = Matches[indx];
                    if (word.Syllables == 1) {
                        continue;
                    }
                    var CharCount = this.GetCountDict2(word.Tiles);
                    var isValid = this.Validate(Dict, CharCount);
                    if (!isValid) {
                        continue;
                    }
                    Shortlisted.push(word.Index);
                }
            }
            if (console) {
                console.log(U.Util.Format("\tContextual: V2: {1} {0}", [U.Util.ElapsedTime(performance.now() - st), Shortlisted.length]));
            }
            return Shortlisted;
        };
        RegexV2Engine.prototype.ShortList3 = function (Words, Probables, NonCornerPattern, Dict) {
            if (U.Util.IsNullOrEmpty(NonCornerPattern)) {
                return [];
            }
            var st = performance.now();
            var R = RegExp(NonCornerPattern);
            var Shortlisted = [];
            {
                for (var indx in Probables) {
                    var wordIndx = Probables[indx];
                    var word = Words[wordIndx];
                    if (word.Syllables == 1) {
                        continue;
                    }
                    var isMatch = R.test(word.Tiles);
                    if (!isMatch) {
                        continue;
                    }
                    var CharCount = this.GetCountDict2(word.Tiles);
                    var isValid = this.Validate(Dict, CharCount);
                    if (!isValid) {
                        continue;
                    }
                    Shortlisted.push(word.Index);
                }
                if (console) {
                    console.log(U.Util.Format("\tShortlist: V2: {1} {0}", [U.Util.ElapsedTime(performance.now() - st), Shortlisted.length]));
                }
            }
            return Shortlisted;
        };
        RegexV2Engine.ShortList4 = function (r, words) {
            var List = words.filter(function (s) { return r.test(s.Tiles); });
            var Probables = [];
            for (var indx in List) {
                Probables.push(List[indx].Index);
            }
            List = null;
            return Probables;
        };
        RegexV2Engine.ShortList5 = function (block, key, R, AllWords, Probables) {
            var CachedList = EngineMemory.Memorize(block, key, R, AllWords, RegexV2Engine.ShortList4, RegexV2Engine.ShouldCache);
            var ShortListed = [];
            for (var indx in CachedList) {
                var probable = CachedList[indx];
                if (!Probables.Contains(probable)) {
                    continue;
                }
                ShortListed.push(probable);
            }
            return ShortListed;
        };
        RegexV2Engine.ShortList6 = function (r, words, Probables) {
            var List = Probables.filter(function (s) { return r.test(words[s].Tiles); });
            return List;
        };
        RegexV2Engine.ShouldCache = function (t1, t2) {
            return t1 < t2;
        };
        RegexV2Engine.EmptyExtensions2 = function (Cells, size, CharSet, startIndex, AllWords, Probables, Movables, SpeicalDict) {
            var Moves = [];
            {
                for (var indx in Probables) {
                    var wordIndx = Probables[indx];
                    var word = AllWords[wordIndx];
                    var Pre = "";
                    var Center = "";
                    var Post = "";
                    var f = word.Tiles.indexOf(',');
                    Center = word.Tiles.substring(0, f);
                    Post = word.Tiles.substring(f + 1);
                    var Pres = Pre == "" ? [] : Pre.TrimEnd(',').split(',');
                    var Centers = Center.split(',');
                    var Posts = Post == "" ? [] : Post.TrimStart(',').split(',');
                    var Tiles = Movables.slice(0, Movables.length);
                    var res = RegexEngine.Resolve(Pres, Centers, Posts, Tiles, SpeicalDict);
                    if (!res) {
                        continue;
                    }
                    var totalCells = Pres.length + Centers.length + Posts.length;
                    var centroid = totalCells % 2 == 0 ? (Math.floor(totalCells / 2) - 1) : Math.floor(totalCells / 2);
                    var WH = EngineBase.TryHarizontal(0, startIndex, Cells, size, startIndex - centroid, 0, Pres, Centers, Posts);
                    var WV = EngineBase.TryVertical(0, startIndex, Cells, size, startIndex - centroid, 0, Pres, Centers, Posts);
                    var WHValid = RegexV2Engine.Validate4(WH, AllWords, Probables);
                    var WVValid = RegexV2Engine.Validate4(WV, AllWords, Probables);
                    if (WHValid) {
                        Moves.push(WH);
                    }
                    if (WVValid) {
                        Moves.push(WV);
                    }
                }
            }
            return Moves;
        };
        RegexV2Engine.SyllableExtensions2 = function (Cells, size, CharSet, botId, AllWords, Probables, Movables, SpeicalDict) {
            var st = performance.now();
            var Moves = [];
            {
                var All = RegexEngine.GetSyllableList2(Cells, size, true, true);
                if (RegexV2Engine.SM) {
                    EngineMemory.RefreshCache(botId + ":S", All);
                }
                for (var indx in All) {
                    var st2 = performance.now();
                    var syllable = All[indx];
                    var pattern = RegexEngine.GetSyllablePattern2(CharSet, syllable.Tiles.Replace("(", "").Replace(")", ""), "(?<Center>.*?)", "(?<Pre>.*?)", "(?<Post>.*?)");
                    pattern = U.Util.Format("^{0}$", [pattern]);
                    var R = new RegExp(pattern);
                    {
                        var Probables2 = [];
                        if (RegexV2Engine.SM) {
                            Probables2 = RegexV2Engine.ShortList5(botId + ":S", syllable.Tiles, R, AllWords, Probables);
                        }
                        else {
                            Probables2 = RegexV2Engine.ShortList6(R, AllWords, Probables);
                        }
                        for (var indx2 in Probables2) {
                            var probableIndx = Probables2[indx2];
                            var probable = AllWords[probableIndx];
                            if (!R.test(probable.Tiles)) {
                                continue;
                            }
                            var M = R.exec(probable.Tiles);
                            var Pre = RegexEngine.MatchedString(M.groups["Pre"], "");
                            var Center = RegexEngine.MatchedString(M.groups["Conso"], "");
                            var Post = RegexEngine.MatchedString(M.groups["Post"], "");
                            var Pres = Pre == "" ? [] : Pre.TrimEnd(',').split(',');
                            var Centers = Center == "" ? [] : Center.split(',');
                            var Posts = Post == "" ? [] : Post.TrimStart(',').split(',');
                            if (!Post.StartsWith(",") && Posts.length > 0) {
                                Centers = (Center + Posts[0]).split(',');
                                Posts = Posts.slice(1);
                            }
                            var Tiles = Movables.slice(0, Movables.length);
                            var res = RegexEngine.Resolve(Pres, Centers, Posts, Tiles, SpeicalDict);
                            if (!res) {
                                continue;
                            }
                            var WH = EngineBase.TryHarizontal(1, -1, Cells, size, syllable.Index, 0, Pres, Centers, Posts);
                            var WV = EngineBase.TryVertical(1, -1, Cells, size, syllable.Index, 0, Pres, Centers, Posts);
                            var WHValid = RegexV2Engine.Validate4(WH, AllWords, Probables);
                            var WVValid = RegexV2Engine.Validate4(WV, AllWords, Probables);
                            if (WHValid) {
                                Moves.push(WH);
                            }
                            if (WVValid) {
                                Moves.push(WV);
                            }
                        }
                    }
                    if (console) {
                        console.log(U.Util.Format("\t\tSyllable Extension: {1}: {0}", [U.Util.ElapsedTime(performance.now() - st2), syllable.Tiles]));
                    }
                }
            }
            if (console) {
                console.log(U.Util.Format("\tSyllable Extensions: V2: {0}", [U.Util.ElapsedTime(performance.now() - st)]));
            }
            return Moves;
        };
        RegexV2Engine.WordExtensions2 = function (Cells, size, CharSet, botId, AllWords, Probables, Movables, SpeicalDict) {
            var st = performance.now();
            var Moves = [];
            {
                var WordsOnBoard = RegexEngineBase.GetWordsOnBoard(Cells, size, false);
                if (RegexV2Engine.WM) {
                    EngineMemory.RefreshCache(botId + ":W", WordsOnBoard);
                }
                for (var indx in WordsOnBoard) {
                    var st2 = performance.now();
                    var wordOnBoard = WordsOnBoard[indx];
                    var raw = wordOnBoard.Tiles.Replace("(", "").Replace(")", "").Replace(",", "").Replace("|", ",");
                    var len = raw.split(',').length;
                    var pattern = RegexEngineBase.GenWordPattern(CharSet, wordOnBoard.Tiles, "(?<Center{0}>.*?)", "", "(?<Center{0}>.*?)", "(?<Pre>.*?)", "(?<Post>.*?)", true);
                    pattern = U.Util.Format("^{0}$", [pattern.TrimEnd('|')]);
                    var R = new RegExp(pattern);
                    {
                        var Probables2 = [];
                        if (RegexV2Engine.WM && len > RegexV2Engine.WS) {
                            Probables2 = RegexV2Engine.ShortList5(botId + ":W", wordOnBoard.Tiles, R, AllWords, Probables);
                        }
                        else {
                            Probables2 = RegexV2Engine.ShortList6(R, AllWords, Probables);
                        }
                        for (var indx2 in Probables2) {
                            var wordIndx = Probables2[indx2];
                            var word = AllWords[wordIndx];
                            if (raw == word.Tiles) {
                                continue;
                            }
                            if (!R.test(word.Tiles)) {
                                continue;
                            }
                            var M = R.exec(word.Tiles);
                            var Pre = "";
                            var Post = "";
                            var Center = "";
                            Pre = RegexEngine.MatchedString(M.groups["Pre"], "");
                            for (var i = 0; i < word.Syllables; i++) {
                                Center = Center + RegexEngine.MatchedString(M.groups["Center" + (i + 1)], ",") + ":";
                            }
                            Center = Center.TrimEnd(':');
                            Post = RegexEngine.MatchedString(M.groups["Post"], "");
                            var Pres = Pre == "" ? [] : Pre.TrimEnd(',').split(',');
                            var Centers = Center.split(':');
                            var Posts = Post == "" ? [] : Post.TrimStart(',').split(',');
                            if (Centers.length != len) {
                                if (!Post.StartsWith(",") && Posts.length > 0) {
                                    Centers.push(Posts[0]);
                                    Posts = Posts.slice(1);
                                }
                            }
                            var Tiles = Movables.slice(0, Movables.length);
                            var res = RegexEngine.Resolve(Pres, Centers, Posts, Tiles, SpeicalDict);
                            if (!res) {
                                continue;
                            }
                            if (wordOnBoard.Position == "R") {
                                var WH = EngineBase.TryHarizontal(2, -1, Cells, size, wordOnBoard.Index, wordOnBoard.Syllables - 1, Pres, Centers, Posts);
                                var WHValid = RegexV2Engine.Validate4(WH, AllWords, Probables);
                                if (WHValid) {
                                    Moves.push(WH);
                                }
                            }
                            if (wordOnBoard.Position == "C") {
                                var WH = EngineBase.TryVertical(2, -1, Cells, size, wordOnBoard.Index, wordOnBoard.Syllables - 1, Pres, Centers, Posts);
                                var WHValid = RegexV2Engine.Validate4(WH, AllWords, Probables);
                                if (WHValid) {
                                    Moves.push(WH);
                                }
                            }
                        }
                    }
                    if (console) {
                        console.log(U.Util.Format("\t\tWord Extension: {1}: {0}", [U.Util.ElapsedTime(performance.now() - st2), wordOnBoard.Tiles]));
                    }
                }
            }
            if (console) {
                console.log(U.Util.Format("\tWord Extensions: V2: {0}", [U.Util.ElapsedTime(performance.now() - st)]));
            }
            return Moves;
        };
        RegexV2Engine.Validate4 = function (WV, AllWords, Probables) {
            WV.Words = ProbableWordComparer.Distinct(WV.Words);
            WV.WordsCount = WV.Words.length;
            if (WV.Words.length == 0 || WV.Moves.length == 0) {
                return false;
            }
            return RegexV2Engine.Validate5(WV.Words, AllWords, Probables);
        };
        RegexV2Engine.Validate5 = function (WV, AllWords, Probables) {
            for (var indx in WV) {
                var w = WV[indx];
                var v = Probables.filter(function (x) { return AllWords[x].Tiles == w.String; });
                if (v == null || v.length == 0) {
                    return false;
                }
            }
            return true;
        };
        RegexV2Engine.SM = false;
        RegexV2Engine.WM = true;
        RegexV2Engine.CL = true;
        RegexV2Engine.Threshlod = 0.33;
        RegexV2Engine.WS = 2;
        return RegexV2Engine;
    }(RegexEngineBase));
    exports.RegexV2Engine = RegexV2Engine;
    var EngineMemory = (function () {
        function EngineMemory() {
        }
        EngineMemory.Memorize = function (Block, Key, r, Words, Callback, CanCache) {
            var Dict = EngineMemory.Cache[Block];
            if (Dict == null) {
                Dict = {};
            }
            if (Dict[Key] != null) {
                return Dict[Key];
            }
            var obj = Callback(r, Words);
            Dict[Key] = obj;
            if (CanCache(obj.length, Words.length)) {
                EngineMemory.Cache[Block] = Dict;
            }
            return obj;
        };
        EngineMemory.Retrieve = function (Key) {
            var Val = EngineMemory.Cache[Key];
            if (Val == null) {
                return {};
            }
            return Val;
        };
        EngineMemory.RefreshCache = function (block, Items) {
            var Dict = EngineMemory.Retrieve(block);
            if (Dict == null) {
                return;
            }
            var RemoveList = [];
            for (var indx in Dict) {
                var KVP = Dict[indx];
                var found = false;
                for (var indx2 in Items) {
                    var word = Items[indx2];
                    if (word.Tiles == indx) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    RemoveList.push(indx);
                }
            }
            for (var indx3 in RemoveList) {
                var item = RemoveList[indx3];
                delete Dict[item];
            }
        };
        EngineMemory.Cache = {};
        return EngineMemory;
    }());
    exports.EngineMemory = EngineMemory;
    var GameConfig = (function () {
        function GameConfig() {
        }
        GameConfig.GetBot = function (bot) {
            var players = Config.Players;
            for (var i = 0; i < players.length; i++) {
                var player = players[i];
                var isBot = player.Bot != null;
                if (!isBot) {
                    continue;
                }
                if (player.Bot.Id == bot) {
                    return player.Bot;
                }
            }
            return null;
        };
        GameConfig.GetBoard = function (name) {
            if (Config.Board.TileWeights == null) {
                Config.Board.TileWeights = GameConfig.GetTileWeights(Config.Board.Trays);
            }
            return Config.Board;
        };
        GameConfig.GetCharSet = function (lang) {
            return Config.CharSet;
        };
        GameConfig.GetTileWeights = function (trays) {
            var Weights = {};
            for (var indx in trays) {
                var tray = trays[indx];
                for (var indx2 in tray.Set) {
                    var tiles = tray.Set[indx2];
                    for (var indx3 in tiles) {
                        var tile = tiles[indx3];
                        Weights[indx3] = tile.W;
                    }
                }
            }
            return Weights;
        };
        return GameConfig;
    }());
    exports.GameConfig = GameConfig;
});
define("Tile", ["require", "exports", "react"], function (require, exports, React) {
    "use strict";
    var Tile = (function (_super) {
        __extends(Tile, _super);
        function Tile(props) {
            _super.call(this, props);
            this.state = props;
        }
        Tile.prototype.render = function () {
            var _this = this;
            var childs = [];
            var classList = ["tile"];
            if (this.props.Remaining > 1) {
                childs.push(this.renderCount());
            }
            childs.push(this.renderContent());
            if (this.props.Weight == 1) {
                childs.push(this.renderEmpty());
            }
            else {
                childs.push(this.renderWeight());
            }
            if (this.props.Remaining == 0 || this.props.Remaining - this.props.OnBoard == 0) {
                classList.push("readonly");
            }
            var draggable = this.props.Remaining > 0;
            if (this.props.ReadOnly) {
                draggable = false;
            }
            if (draggable) {
                classList.push("draggable");
            }
            var className = classList.join(' ');
            var elem = React.createElement('span', {
                id: this.props.Id,
                ref: this.props.Id,
                className: className,
                title: this.props.Text,
                draggable: draggable,
                onDragStart: function (evt) { _this.OnDragStart(evt); },
                onClick: this.OnClick
            }, childs);
            return elem;
        };
        Tile.prototype.renderContent = function () {
            var contentId = "content_" + this.props.Id;
            var content = React.createElement('span', {
                id: contentId,
                ref: contentId,
                key: contentId,
                className: "content",
                title: this.props.Text,
            }, [], this.props.Text);
            return content;
        };
        Tile.prototype.renderWeight = function () {
            var countId = "weight_" + this.props.Id;
            var count = React.createElement('span', {
                id: countId,
                ref: countId,
                key: countId,
                className: "weight",
                title: this.props.Weight
            }, [], this.props.Weight);
            return count;
        };
        Tile.prototype.renderCount = function () {
            var countId = "count_" + this.props.Id;
            var count = React.createElement('span', {
                id: countId,
                ref: countId,
                key: countId,
                className: "count",
                title: this.props.Remaining
            }, [], this.props.Remaining - this.props.OnBoard);
            return count;
        };
        Tile.prototype.renderEmpty = function () {
            var blank = React.createElement('span', {
                key: "blank",
                className: "count",
            }, [], " ");
            return blank;
        };
        Tile.prototype.OnDragStart = function (ev) {
            var elem = ev.target;
            var data = {
                Src: this.props.Text,
                Origin: "Tile"
            };
            ev.dataTransfer.setData("text", JSON.stringify(data));
        };
        Tile.prototype.OnClick = function (ev) {
        };
        return Tile;
    }(React.Component));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Tile;
});
define("Tray", ["require", "exports", "react", "Tile"], function (require, exports, React, Tile) {
    "use strict";
    var Tray = (function (_super) {
        __extends(Tray, _super);
        function Tray(props) {
            _super.call(this, props);
            this.state = props;
        }
        Tray.prototype.render = function () {
            var childs = [];
            if (this.props.ShowLabel) {
                var label = React.createElement("span", { key: "label", className: "label" }, this.props.Title);
                childs.push(label);
            }
            for (var i = 0; i < this.props.Tiles.length; i++) {
                var tile = this.renderTile(this.props.Tiles[i], i + 1);
                childs.push(tile);
            }
            var className = this.props.className + (this.props.Show ? "" : " hide");
            var elem = React.createElement('div', {
                id: this.props.Id,
                key: this.props.Id,
                ref: this.props.Id,
                className: className,
                title: this.props.Title
            }, childs);
            return elem;
        };
        Tray.prototype.renderTile = function (tileProp, index) {
            var id = this.props.Id + "_" + (index);
            var tile = React.createElement(Tile.default, {
                Id: id,
                key: id,
                className: "",
                ReadOnly: tileProp.ReadOnly || this.props.ReadOnly,
                Show: true,
                Text: tileProp.Text,
                Remaining: tileProp.Remaining,
                OnBoard: tileProp.OnBoard,
                Total: tileProp.Total,
                Weight: tileProp.Weight,
                Index: tileProp.Index,
                TrayIndex: tileProp.TrayIndex
            });
            return tile;
        };
        return Tray;
    }(React.Component));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Tray;
});
define("TrayRack", ["require", "exports", "react", "Contracts", "GameStore"], function (require, exports, React, Contracts, GS) {
    "use strict";
    var TrayRack = (function (_super) {
        __extends(TrayRack, _super);
        function TrayRack(props) {
            _super.call(this, props);
            this.state = props;
        }
        TrayRack.prototype.render = function () {
            var _this = this;
            var TilesProp = this.props;
            var childs = [];
            var chkId = "chk_" + TilesProp.Id;
            var chkBox = React.createElement('input', {
                type: "checkbox",
                name: "TileGroup",
                id: chkId,
                key: chkId,
                ref: chkId,
                defaultChecked: TilesProp.Show,
                disabled: TilesProp.Disabled,
                onChange: function (evt) { _this.OpenClose(evt); }
            });
            var label = React.createElement('label', {
                htmlFor: "chk_" + TilesProp.Id,
                key: "lbl_" + TilesProp.Id
            }, TilesProp.Title);
            childs.push(chkBox);
            childs.push(label);
            var elem = React.createElement('span', null, childs);
            return elem;
        };
        TrayRack.prototype.OpenClose = function (evt) {
            GS.GameStore.Dispatch({
                type: Contracts.Actions.OpenOrClose,
                args: { TrayIndex: this.props.Index }
            });
        };
        return TrayRack;
    }(React.Component));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = TrayRack;
});
define("Cabinet", ["require", "exports", "react", "Contracts", "Tray", "TrayRack", "Util", "GameStore", "Messages"], function (require, exports, React, Contracts, Tray, TrayRack, Util, GS, M) {
    "use strict";
    var Cabinet = (function (_super) {
        __extends(Cabinet, _super);
        function Cabinet(props) {
            _super.call(this, props);
            this.state = props;
        }
        Cabinet.prototype.render = function () {
            var _this = this;
            var childs = [];
            var groupContainer = this.renderContainer();
            childs.push(groupContainer);
            for (var i = 0; i < this.props.Trays.length; i++) {
                var TilesProp = this.props.Trays[i];
                TilesProp.key = TilesProp.Id;
                var tray = React.createElement(Tray.default, Util.Util.Merge(TilesProp, { ShowLabel: true }));
                childs.push(tray);
            }
            var id = "cabinet";
            var className = "cabinet";
            if (!this.props.Show) {
                className += " hide";
            }
            var elem = React.createElement('div', {
                id: id,
                key: id,
                ref: id,
                className: className,
                title: M.Messages.Cabinet,
                onDragOver: this.OnDragOver,
                onDrop: function (evt) { _this.OnDrop(evt); },
            }, childs);
            return elem;
        };
        Cabinet.prototype.renderContainer = function () {
            var childs = [];
            for (var i = 0; i < this.props.Trays.length; i++) {
                var TilesProp = this.props.Trays[i];
                TilesProp.key = "G" + TilesProp.Id;
                var trayRack = React.createElement(TrayRack.default, TilesProp);
                childs.push(trayRack);
            }
            var remaining = React.createElement("span", { key: "remaining", className: "remaining" }, this.props.Remaining);
            childs.push(remaining);
            var id = "trayLabels";
            var groupContainer = React.createElement('div', {
                id: id,
                key: id,
                ref: id,
                className: "trayLabels",
                title: M.Messages.TrayLabels
            }, childs);
            return groupContainer;
        };
        Cabinet.prototype.OnDragOver = function (ev) {
            ev.preventDefault();
        };
        Cabinet.prototype.OnDrop = function (ev) {
            ev.preventDefault();
            var text = ev.dataTransfer.getData("text");
            var data = JSON.parse(text);
            GS.GameStore.Dispatch({
                type: Contracts.Actions.ToTray,
                args: { Origin: data.Origin, Src: data.Src, SrcCell: data.SrcCell }
            });
        };
        return Cabinet;
    }(React.Component));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Cabinet;
});
define("BoardCell", ["require", "exports", "react", "Contracts", "GameStore"], function (require, exports, React, Contracts, GS) {
    "use strict";
    var BoardCell = (function (_super) {
        __extends(BoardCell, _super);
        function BoardCell(props) {
            _super.call(this, props);
            this.state = props;
        }
        BoardCell.prototype.render = function () {
            var _this = this;
            var childs = [];
            var textId = "text_" + this.props.Id;
            var text = this.props.Current.length == 0 ? " " : this.props.Current;
            var textElem = React.createElement('span', {
                id: textId,
                ref: textId,
                key: textId,
                className: "text",
                title: text
            }, [], text);
            childs.push(this.renderWeight());
            childs.push(textElem);
            var cellId = "cell_" + this.props.Id;
            var container = React.createElement('div', {
                id: cellId,
                ref: cellId,
                key: cellId,
                className: "square",
                title: text
            }, childs);
            var className = this.getClass();
            var elem = React.createElement('td', {
                id: this.props.Id,
                ref: this.props.Id,
                className: className,
                title: this.props.Current,
                index: text,
                draggable: this.isDragable(),
                onDragStart: function (evt) { _this.OnDragStart(evt); },
                onDragOver: this.OnDragOver,
                onDrop: function (evt) { _this.OnDrop(evt); }
            }, container);
            return elem;
        };
        BoardCell.prototype.isDragable = function () {
            return this.props.Waiting.length != 0 && !this.props.ReadOnly;
        };
        BoardCell.prototype.getClass = function () {
            var classList = [];
            classList.push("cell");
            if (this.props.Waiting.length + this.props.Confirmed.length != 0) {
                classList.push("filled");
            }
            var covered = (this.props.Waiting.length + this.props.Confirmed.length != 0);
            var confirmed = (this.props.Waiting.length == 0 && this.props.Confirmed.length != 0);
            var draggable = this.isDragable();
            if (confirmed) {
                classList.push("confirmed");
            }
            if (draggable) {
                classList.push("draggable");
            }
            if (this.props.Star && !covered) {
                classList.push("star");
            }
            if (confirmed || this.props.Waiting.length != 0) {
                return classList.join(' ');
            }
            classList.push("w" + this.props.Weight);
            return classList.join(' ');
        };
        BoardCell.prototype.renderWeight = function () {
            var weightId = "weight_" + this.props.Id;
            var className = "weight";
            var text = this.props.Weight == 1 ? " " : this.props.Weight;
            var weight = React.createElement('span', {
                id: weightId,
                ref: weightId,
                key: weightId,
                className: className,
                title: this.props.Weight
            }, [], text);
            return weight;
        };
        BoardCell.prototype.OnDragOver = function (ev) {
            ev.preventDefault();
        };
        BoardCell.prototype.OnDrop = function (ev) {
            ev.preventDefault();
            var text = ev.dataTransfer.getData("text");
            var data = JSON.parse(text);
            GS.GameStore.Dispatch({
                type: Contracts.Actions.ToBoard,
                args: {
                    TargetCell: this.props.Index,
                    Src: data.Src,
                    SrcCell: data.SrcCell,
                    Origin: data.Origin
                }
            });
        };
        BoardCell.prototype.OnDragStart = function (ev) {
            var last = this.props.Waiting[this.props.Waiting.length - 1];
            var elem = ev.target;
            var data = {
                Src: last,
                Origin: "Cell",
                SrcCell: this.props.Index
            };
            ev.dataTransfer.setData("text", JSON.stringify(data));
        };
        return BoardCell;
    }(React.Component));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = BoardCell;
});
define("Board", ["require", "exports", "react", "BoardCell", "Util", "Messages"], function (require, exports, React, BoardCell, U, M) {
    "use strict";
    var Board = (function (_super) {
        __extends(Board, _super);
        function Board(props) {
            _super.call(this, props);
            this.state = props;
        }
        Board.prototype.render = function () {
            var index = 0;
            var rows = [];
            for (var i = 0; i < this.props.Size; i++) {
                var cells = [];
                for (var j = 0; j < this.props.Size; j++) {
                    var cell = React.createElement(BoardCell.default, U.Util.Merge(this.props.Cells[index], { ReadOnly: this.props.Cells[index].ReadOnly || this.props.ReadOnly }), {});
                    cells.push(cell);
                    index++;
                }
                var rowId = "tile_" + (i + 1);
                var row = React.createElement("tr", {
                    id: rowId,
                    key: rowId,
                    ref: rowId,
                    className: "row",
                    title: U.Util.Format(M.Messages.Row, [i + 1]),
                }, cells);
                rows.push(row);
            }
            var tbody = React.createElement("tbody", {}, rows);
            var table = React.createElement("table", {
                id: "table",
                key: "table",
                ref: "table",
                className: "table"
            }, tbody);
            var elem = React.createElement('div', {
                id: "board",
                key: "board",
                ref: "board",
                className: "board",
                title: M.Messages.Board,
            }, [table]);
            return elem;
        };
        return Board;
    }(React.Component));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Board;
});
define("GamePlayer", ["require", "exports", "react", "Messages"], function (require, exports, React, M) {
    "use strict";
    var GamePlayer = (function (_super) {
        __extends(GamePlayer, _super);
        function GamePlayer(props) {
            _super.call(this, props);
            this.state = props;
        }
        GamePlayer.prototype.render = function () {
            var classList = [];
            classList.push(this.props.CurrentTurn ? "currentTurn" : "noTurn");
            classList.push(this.props.Bot != null ? "bot" : "human");
            var childs = [];
            var id = "U" + this.props.Id;
            var elem = React.createElement('span', {
                id: id,
                ref: id,
                key: id,
                className: classList.join(" "),
                title: this.props.Name,
            }, this.props.Name);
            childs.push(elem);
            if (this.props.showScore) {
                var score = React.createElement("span", { key: "score", className: "score" }, this.props.Score);
                childs.push(score);
            }
            if (this.props.showWords) {
                var words = this.renderWords();
                childs.push(words);
            }
            var classList = ["player"];
            if (this.props.showWords && !this.hasWords() && !this.props.showScore) {
                classList.push("hide");
            }
            var id = "D_" + this.props.Id;
            var div = React.createElement('div', {
                id: id,
                ref: id,
                key: id,
                className: classList.join(" "),
                title: this.props.Name,
            }, childs);
            return div;
        };
        GamePlayer.prototype.renderWords = function () {
            var ol = this.renderWordsList();
            var className = this.hasWords() ? "words" : "hide";
            var _id = "w_" + (this.props.Id + 1);
            var div = React.createElement('div', {
                id: _id,
                key: _id,
                ref: _id,
                className: className,
                title: M.Messages.Words,
            }, [ol]);
            return div;
        };
        GamePlayer.prototype.renderWordsList = function () {
            var items = [];
            for (var j = 0; j < this.props.Awarded.length; j++) {
                var word = this.props.Awarded[j];
                var text = word.Text + "(" + word.Score + ")";
                var li = React.createElement("li", {
                    key: "wa" + j,
                    className: "cWord",
                    title: text
                }, text);
                items.push(li);
            }
            for (var j = 0; j < this.props.Claimed.length; j++) {
                var word = this.props.Claimed[j];
                var text = word.Text + "(" + word.Score + ") *";
                var li = React.createElement("li", {
                    key: "wc" + j,
                    className: "wWord",
                    title: text
                }, text);
                items.push(li);
            }
            var id = "ul_" + (this.props.Id + 1);
            var ol = React.createElement("ol", {
                id: id,
                key: id,
                ref: id,
                className: "wordsList",
                title: M.Messages.List
            }, items);
            return ol;
        };
        GamePlayer.prototype.hasWords = function () {
            return (this.props.Awarded.length + this.props.Claimed.length != 0);
        };
        return GamePlayer;
    }(React.Component));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GamePlayer;
});
define("InfoBar", ["require", "exports", "react", "react-dom", "Messages"], function (require, exports, React, ReactDOM, M) {
    "use strict";
    var InfoBar = (function (_super) {
        __extends(InfoBar, _super);
        function InfoBar(props) {
            _super.call(this, props);
            this.state = props;
        }
        InfoBar.prototype.componentDidUpdate = function () {
            if (this.refs["ul"] == null) {
                return;
            }
            ReactDOM.findDOMNode(this.refs["ul"]).scrollTop = 10000;
        };
        InfoBar.prototype.render = function () {
            var childs = [];
            if (this.props.Messages.length == 0) {
                var elem = React.createElement('div', {});
                return elem;
            }
            var h2 = React.createElement("span", { key: "h2", className: "h2" }, M.Messages.Messages);
            childs.push(h2);
            var items = [];
            for (var i = 0; i < this.props.Messages.length; i++) {
                var msg = this.props.Messages[i];
                var li = React.createElement("li", { key: "li" + i }, msg);
                items.push(li);
            }
            var id = "ul";
            var ul = React.createElement("ul", {
                id: id,
                key: id,
                ref: id,
                className: "ul",
                title: M.Messages.List
            }, items);
            childs.push(ul);
            var elem = React.createElement('div', {
                id: "infoBar",
                key: "infoBar",
                ref: "infoBar",
                className: "infoBar",
                title: M.Messages.Messages,
            }, childs);
            return elem;
        };
        return InfoBar;
    }(React.Component));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = InfoBar;
});
define("GamePlayers", ["require", "exports", "react", "GamePlayer", "Util", "Messages"], function (require, exports, React, GamePlayer, Util, M) {
    "use strict";
    var GamePlayers = (function (_super) {
        __extends(GamePlayers, _super);
        function GamePlayers(props) {
            _super.call(this, props);
            this.state = props;
        }
        GamePlayers.prototype.render = function () {
            var childs = [];
            for (var i = 0; i < this.props.Players.length; i++) {
                var player = React.createElement(GamePlayer.default, Util.Util.Merge(this.props.Players[i], {
                    showScore: this.props.showScores,
                    showWords: this.props.showWordsList
                }));
                childs.push(player);
            }
            if (this.props.showWordsList && this.props.HasClaims) {
                var label = React.createElement('span', {
                    key: "lbl",
                    className: "conditions",
                    title: M.Messages.Claimed
                }, M.Messages.Claimed);
                childs.push(label);
            }
            var className = "players";
            var elem = React.createElement('div', {
                id: this.props.Id,
                key: this.props.Id,
                ref: this.props.Id,
                className: className,
                title: M.Messages.Players,
            }, childs);
            return elem;
        };
        return GamePlayers;
    }(React.Component));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GamePlayers;
});
define("ActionBar", ["require", "exports", "react", "Contracts", "GameStore", "Messages"], function (require, exports, React, Contracts, GS, M) {
    "use strict";
    var ActionBar = (function (_super) {
        __extends(ActionBar, _super);
        function ActionBar(props) {
            _super.call(this, props);
            this.state = props;
        }
        ActionBar.prototype.render = function () {
            var childs = [];
            var id = "actionBar";
            var suggest = this.renderSuggest();
            var help = this.renderHelp();
            var elem = React.createElement('div', {
                id: id,
                key: id,
                ref: id,
                className: "actionBar",
                title: M.Messages.ActionBar,
            }, [suggest, help]);
            return elem;
        };
        ActionBar.prototype.renderHelp = function () {
            var id = "help";
            var help = React.createElement('button', {
                id: id,
                key: id,
                ref: id,
                className: "help",
                title: M.Messages.Help,
                disabled: false,
                onClick: this.OnHelp,
            }, [], M.Messages.Help);
            return help;
        };
        ActionBar.prototype.renderSuggest = function () {
            var id = "suggest";
            var help = React.createElement('button', {
                id: id,
                key: id,
                ref: id,
                className: "suggest",
                title: M.Messages.Suggest,
                style: { visibility: this.props.ReadOnly ? "hidden" : "visible" },
                onClick: this.OnAskSuggestion,
            }, [], M.Messages.Suggest);
            return help;
        };
        ActionBar.prototype.OnAskSuggestion = function (ev) {
            GS.GameStore.Dispatch({
                type: Contracts.Actions.RequestSuggestion,
                args: {}
            });
        };
        ActionBar.prototype.OnHelp = function (ev) {
            GS.GameStore.Dispatch({
                type: Contracts.Actions.AskHelp,
                args: {}
            });
        };
        return ActionBar;
    }(React.Component));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ActionBar;
});
define("GameTable", ["require", "exports", "react", "Contracts", "Tray", "Util", "GameStore", "Messages"], function (require, exports, React, Contracts, Tray, Util, GS, M) {
    "use strict";
    var GameTable = (function (_super) {
        __extends(GameTable, _super);
        function GameTable(props) {
            _super.call(this, props);
            this.state = props;
        }
        GameTable.prototype.render = function () {
            var _this = this;
            var childs = [];
            var message = this.renderMessage();
            var suggest = this.renderSuggest();
            var reDraw = this.renderReDraw();
            var pass = this.renderPass();
            var id = "actions";
            var actions = React.createElement('div', {
                id: id,
                key: id,
                ref: id,
                className: "actions",
                title: M.Messages.Actions,
            }, [message, suggest, reDraw, pass]);
            childs.push(actions);
            var vowelTray = React.createElement(Tray.default, Util.Util.Merge(this.props.VowelTray, { ShowLabel: false, ReadOnly: this.props.ReadOnly }));
            childs.push(vowelTray);
            var consoTray = React.createElement(Tray.default, Util.Util.Merge(this.props.ConsoTray, { ShowLabel: false, ReadOnly: this.props.ReadOnly }));
            childs.push(consoTray);
            var id = "GameTable";
            var elem = React.createElement('div', {
                id: id,
                key: id,
                ref: id,
                className: "gameTable",
                title: M.Messages.GameTable,
                onDragOver: this.OnDragOver,
                onDrop: function (evt) { _this.OnDrop(evt); },
            }, childs);
            return elem;
        };
        GameTable.prototype.renderMessage = function () {
            var id = "message";
            var pass = React.createElement('span', {
                id: id,
                key: id,
                ref: id,
                className: "message",
                title: this.props.Message
            }, [], this.props.Message);
            return pass;
        };
        GameTable.prototype.renderSuggest = function () {
            var id = "help";
            var help = React.createElement('button', {
                id: id,
                key: id,
                ref: id,
                className: "suggest",
                title: M.Messages.Suggest,
                disabled: this.props.ReadOnly,
                onClick: this.OnAskSuggestion,
            }, [], M.Messages.Suggest);
            return help;
        };
        GameTable.prototype.renderReDraw = function () {
            var id = "draw";
            var pass = React.createElement('button', {
                id: id,
                key: id,
                ref: id,
                className: "redraw",
                title: M.Messages.ReDraw,
                disabled: this.props.ReadOnly || !this.props.CanReDraw,
                onClick: this.OnReDraw,
            }, [], M.Messages.ReDraw);
            return pass;
        };
        GameTable.prototype.renderPass = function () {
            var id = "pass";
            var pass = React.createElement('button', {
                id: id,
                key: id,
                ref: id,
                className: "pass",
                title: M.Messages.Pass,
                onClick: this.OnPass,
                disabled: this.props.ReadOnly,
            }, [], M.Messages.Pass);
            return pass;
        };
        GameTable.prototype.OnPass = function (ev) {
            GS.GameStore.Dispatch({
                type: Contracts.Actions.Pass,
                args: {}
            });
        };
        GameTable.prototype.OnReDraw = function (ev) {
            GS.GameStore.Dispatch({
                type: Contracts.Actions.ReDraw,
                args: {}
            });
        };
        GameTable.prototype.OnAskSuggestion = function (ev) {
            GS.GameStore.Dispatch({
                type: Contracts.Actions.RequestSuggestion,
                args: {}
            });
        };
        GameTable.prototype.OnDragOver = function (ev) {
            ev.preventDefault();
        };
        GameTable.prototype.OnDrop = function (ev) {
            ev.preventDefault();
            var text = ev.dataTransfer.getData("text");
            var data = JSON.parse(text);
            GS.GameStore.Dispatch({
                type: Contracts.Actions.ToTray,
                args: { Origin: data.Origin, Src: data.Src, SrcCell: data.SrcCell }
            });
        };
        return GameTable;
    }(React.Component));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GameTable;
});
define("_ConfirmDialog", ["require", "exports", "react", "_OverlayDialog"], function (require, exports, React, OverlayDialog) {
    "use strict";
    var _ConfirmDialog = (function (_super) {
        __extends(_ConfirmDialog, _super);
        function _ConfirmDialog(props) {
            _super.call(this, props);
            this.state = props;
        }
        _ConfirmDialog.prototype.render = function () {
            var message = React.createElement('div', {
                key: "msg_" + this.props.Id,
                className: "oFContent"
            }, this.props.Message);
            return this.renderDialog(message);
        };
        return _ConfirmDialog;
    }(OverlayDialog.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = _ConfirmDialog;
});
define("ConfirmDialog", ["require", "exports", "react", "_ConfirmDialog", "Util", "Messages"], function (require, exports, React, _ConfirmDialog, Util, Messages) {
    "use strict";
    var ConfirmDialog = (function (_super) {
        __extends(ConfirmDialog, _super);
        function ConfirmDialog(props) {
            _super.call(this, props);
            this.state = props;
        }
        ConfirmDialog.prototype.render = function () {
            var id = "ConfrimDialog";
            return React.createElement(_ConfirmDialog.default, Util.Util.Merge(this.props, {
                Id: id,
                key: id,
                ref: id,
                className: id,
                Show: this.props.Show,
                ReadOnly: false,
                ConfirmText: Messages.Messages.Yes, ShowConfirm: true,
                CancelText: Messages.Messages.No, ShowClose: true,
                OnConfirm: this.props.OnConfirm,
                OnCancel: this.props.OnDismiss,
            }));
        };
        return ConfirmDialog;
    }(React.Component));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ConfirmDialog;
});
define("ConsentForm", ["require", "exports", "react", "Contracts", "ConfirmDialog", "Util", "Messages", "GameStore"], function (require, exports, React, Contracts, Confirm, Util, Messages, GS) {
    "use strict";
    var ConsentForm = (function (_super) {
        __extends(ConsentForm, _super);
        function ConsentForm(props) {
            _super.call(this, props);
            this.state = props;
        }
        ConsentForm.prototype.render = function () {
            var childs = [];
            if (this.props.Pending.length > 0) {
                var word = this.props.Pending[this.props.Pending.length - 1].Readble;
                var dialog = React.createElement(Confirm.default, Util.Util.Merge({}, {
                    Show: true,
                    key: "_" + this.props.Id,
                    OnConfirm: ConsentForm.Resolve,
                    OnDismiss: ConsentForm.Reject,
                    Title: Messages.Messages.Referee,
                    Message: Util.Util.Format(Messages.Messages.ResolveWord, [word])
                }));
                childs.push(dialog);
            }
            var elem = React.createElement('div', {
                key: this.props.Id,
            }, childs);
            return elem;
        };
        ConsentForm.Resolve = function () {
            GS.GameStore.Dispatch({
                type: Contracts.Actions.WordResolved,
                args: {}
            });
        };
        ConsentForm.Reject = function () {
            GS.GameStore.Dispatch({
                type: Contracts.Actions.WordRejected,
                args: {}
            });
        };
        return ConsentForm;
    }(React.Component));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ConsentForm;
});
define("GameRoom", ["require", "exports", "react", "Cabinet", "Board", "InfoBar", "GamePlayers", "ActionBar", "GameTable", "AlertDialog", "SuggestionForm", "Util", "GenericActions", "ConsentForm", "Messages"], function (require, exports, React, Cabinet, Board, InfoBar, GamePlayers, ActionBar, GameTable, Alert, Suggest, Util, GA, ConsentForm, M) {
    "use strict";
    var GameRoom = (function (_super) {
        __extends(GameRoom, _super);
        function GameRoom(props) {
            _super.call(this, props);
            this.state = props;
        }
        GameRoom.prototype.render = function () {
            var childs = [];
            var gameTable = React.createElement(GameTable.default, Util.Util.Merge(this.props.GameTable, { ReadOnly: this.props.GameTable.ReadOnly || this.props.ReadOnly }));
            childs.push(gameTable);
            var board = React.createElement(Board.default, Util.Util.Merge(this.props.Board, { ReadOnly: this.props.Board.ReadOnly || this.props.ReadOnly }));
            childs.push(board);
            var actionBar = React.createElement(ActionBar.default, Util.Util.Merge(this.props.Stats, { key: "actionBar", ReadOnly: this.props.ReadOnly }));
            childs.push(actionBar);
            var words = React.createElement(GamePlayers.default, Util.Util.Merge(this.props.Players, { key: "words", Id: "WordBoard", showScores: true, showWordsList: true, ReadOnly: this.props.ReadOnly }));
            childs.push(words);
            var cabinet = React.createElement(Cabinet.default, Util.Util.Merge(this.props.Cabinet, { ReadOnly: this.props.Cabinet.ReadOnly || this.props.ReadOnly }));
            childs.push(cabinet);
            var info = React.createElement(InfoBar.default, this.props.InfoBar);
            childs.push(info);
            var dialog = React.createElement(Alert.default, Util.Util.Merge(this.props.Dialog, { OnConfirm: GA.GenericActions.OnDismissDialog }));
            childs.push(dialog);
            var consent = React.createElement(ConsentForm.default, this.props.Consent);
            childs.push(consent);
            var suggest = React.createElement(Suggest.default, this.props.Suggestion);
            childs.push(suggest);
            var block = React.createElement('div', {
                id: this.props.Id,
                key: this.props.Id,
                ref: this.props.Id,
                className: "game",
                title: M.Messages.Brand
            }, childs);
            return block;
        };
        return GameRoom;
    }(React.Component));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GameRoom;
});
define("AskReferee", ["require", "exports", "Contracts", "Messages", "Util", "AskBot", "Indic", "GameActions"], function (require, exports, C, M, U, AskServer, Indic, GA) {
    "use strict";
    var AskReferee = (function () {
        function AskReferee() {
        }
        AskReferee.Validate = function (state, args) {
            var errorCode = AskReferee.ValidateMove(state.Board);
            if (errorCode > 0) {
                AskReferee.Announce(state, (errorCode == 1) ? M.Messages.CrossCells : M.Messages.NoGap);
                return;
            }
            var hasOrphans = AskReferee.HasOrphans(state);
            if (hasOrphans) {
                AskReferee.Announce(state, M.Messages.HasOraphans);
                return;
            }
            var hasClusters = AskReferee.HasClusters(state);
            if (hasClusters) {
                AskReferee.Announce(state, M.Messages.HasIslands);
                return;
            }
            var hasMoves = AskReferee.HasMoves(state);
            if (hasMoves) {
                var isCovered = AskReferee.IsStarCovered(state);
                if (!isCovered) {
                    AskReferee.Announce(state, M.Messages.IsStarCovered);
                    return;
                }
            }
            var player = state.Players.Players[state.Players.Current];
            state.GameTable.Message = U.Util.Format(M.Messages.LookupDict, [player.Name]);
            state.ReadOnly = true;
            setTimeout(AskServer.AskServer.Validate, C.Settings.RefreeWait);
        };
        AskReferee.HasMoves = function (state) {
            var Board = state.Board;
            var first = AskReferee.FirstNonEmpty(Board.Cells, [], Board.Size);
            return (first != -1);
        };
        AskReferee.IsStarCovered = function (state) {
            var C = state.Board.Cells[state.Board.Star];
            return (C.Waiting.length + C.Confirmed.length != 0);
        };
        AskReferee.Announce = function (state, message) {
            state.InfoBar.Messages.push(M.Messages.HasIslands);
            state.Dialog.Title = M.Messages.Name;
            state.Dialog.Message = message;
            state.Dialog.Show = true;
        };
        AskReferee.ValidateMove = function (Board) {
            var Cells = Board.Cells;
            var size = Board.Size;
            var Waiting = [];
            for (var i = 0; i < size * size; i++) {
                var C = Cells[i];
                if (C.Waiting.length == 0) {
                    continue;
                }
                Waiting.push(i);
            }
            if (Waiting.length == 0) {
                return 0;
            }
            var First = U.Util.Position(Waiting[0], size);
            var Last = {};
            var rows = 0;
            var columns = 0;
            for (var indx in Waiting) {
                var Current = U.Util.Position(Waiting[indx], size);
                if (Current.X != First.X) {
                    rows++;
                }
                if (Current.Y != First.Y) {
                    columns++;
                }
                if (rows != 0 && columns != 0) {
                    return 1;
                }
                Last = Current;
            }
            for (var i = ((rows == 0) ? First.Y : First.X); i < ((rows == 0) ? Last.Y : Last.X); i++) {
                var _i = U.Util.Abs((rows == 0) ? First.X : i, (rows == 0) ? i : First.Y, size);
                var C = Cells[_i];
                if (C.Confirmed.length + C.Waiting.length == 0) {
                    return 2;
                }
            }
            return 0;
        };
        AskReferee.HasOrphans = function (state) {
            var orphans = AskReferee.OrphanCells(state.Board);
            for (var i = 0; i < orphans.length; i++) {
                var orphan = orphans[i];
                var P = U.Util.Position(orphan, state.Board.Size);
                var N = state.Board.Cells[orphan];
                state.InfoBar.Messages.push(U.Util.Format(M.Messages.OrphanCell, [(P.X + 1), (P.Y + 1), N.Current]));
            }
            return orphans.length > 0;
        };
        AskReferee.OrphanCells = function (Board) {
            var oraphans = [];
            for (var i = 0; i < Board.Cells.length; i++) {
                var Cell = Board.Cells[i];
                if (Cell.Waiting.length + Cell.Confirmed.length == 0) {
                    continue;
                }
                var neighors = U.Util.FindNeighbors(i, Board.Size);
                var valid = false;
                for (var j = 0; j < neighors.length; j++) {
                    var neighbor = neighors[j];
                    var N = Board.Cells[neighbor];
                    if (N.Waiting.length + N.Confirmed.length != 0) {
                        valid = true;
                    }
                }
                if (!valid) {
                    if (oraphans.indexOf(i) >= 0) {
                        continue;
                    }
                    oraphans.push(i);
                }
            }
            return oraphans;
        };
        AskReferee.HasClusters = function (state) {
            var Board = state.Board;
            var Clustered = [];
            var clusters = 0;
            while (true) {
                var first = AskReferee.FirstNonEmpty(Board.Cells, Clustered, Board.Size);
                if (first == -1) {
                    break;
                }
                var List = AskReferee.ClusterCells(Board.Cells, first, Board.Size);
                Clustered = Clustered.concat(List);
                clusters++;
            }
            return (clusters > 1);
        };
        AskReferee.ClusterCells = function (Cells, first, size) {
            var List = [];
            List.push(first);
            {
                var P = U.Util.Position(first, size);
                var C = Cells[first];
            }
            var curr = 0;
            while (curr < List.length) {
                var neighors = U.Util.FindNeighbors(List[curr], size);
                for (var i = 0; i < neighors.length; i++) {
                    var neighbor = neighors[i];
                    if (List.indexOf(neighbor) >= 0) {
                        continue;
                    }
                    var C = Cells[neighbor];
                    if (C.Confirmed.length + C.Waiting.length == 0) {
                        continue;
                    }
                    var P = U.Util.Position(neighbor, size);
                    List.push(neighbor);
                }
                curr++;
            }
            return List;
        };
        AskReferee.FirstNonEmpty = function (Cells, Clustered, size) {
            var first = -1;
            for (var i = 0; i < size * size; i++) {
                if (Clustered.indexOf(i) >= 0) {
                    continue;
                }
                if (Cells[i].Confirmed.length + Cells[i].Waiting.length == 0) {
                    continue;
                }
                first = i;
                break;
            }
            return first;
        };
        AskReferee.ExtractWords = function (board) {
            var Words = GA.GameActions.WordsOnBoard(board, true, true);
            var sWords = [];
            for (var indx in Words) {
                var word = Words[indx].Text;
                word = Indic.Indic.ToScrabble(word);
                sWords.push(word);
            }
            return sWords;
        };
        return AskReferee;
    }());
    exports.AskReferee = AskReferee;
});
define("GameActions", ["require", "exports", "react", "react-dom", "Contracts", "Messages", "Indic", "Util", "AskBot", "GameStore", "GameRoom", "WordLoader", "AskReferee"], function (require, exports, React, ReactDOM, Contracts, Messages, Indic, Util, AskBot, GS, Game, WL, AskReferee) {
    "use strict";
    var GameActions = (function () {
        function GameActions() {
        }
        GameActions.Init = function (state, args) {
            GameActions.Render();
            var players = state.Players.Players;
            var current = state.Players.Current;
            state.GameTable.Message = Util.Util.Format(Messages.Messages.YourTurn, [players[current].Name]);
            PubSub.Subscribe(Contracts.Events.GameOver, GameActions.GameOver);
            setTimeout(GameActions.PinchPlayer, Contracts.Settings.PinchWait);
        };
        GameActions.PinchPlayer = function () {
            GS.GameStore.Dispatch({
                type: Contracts.Actions.PunchAndPick,
                args: {}
            });
        };
        GameActions.PunchAndPick = function (state, args) {
            if (state.GameOver) {
                return;
            }
            var players = state.Players.Players;
            var currentPlayer = state.Players.Current;
            var isBot = players[currentPlayer].Bot !== null;
            state.ReadOnly = isBot;
            if (!isBot) {
                return;
            }
            state.GameTable.Message = Util.Util.Format(Messages.Messages.Thinking, [players[currentPlayer].Name]);
            setTimeout(AskBot.AskServer.NextMove, Contracts.Settings.BotWait);
        };
        GameActions.Render = function () {
            var rootEl = document.getElementById('root');
            var state = GS.GameStore.GetState();
            var left = React.createElement(Game.default, state);
            return ReactDOM.render(left, rootEl);
        };
        GameActions.RequestSuggestion = function (state, args) {
            state.Suggestion.Loaded = false;
            state.Suggestion.Show = true;
            var post = GameActions.PostInfo(state);
            AskBot.AskServer.Suggest(post);
        };
        GameActions.ReciveSuggestion = function (state, response) {
            state.Suggestion.Loaded = true;
            state.Suggestion.Moves = [response.Result];
        };
        GameActions.DismissSuggestion = function (state, args) {
            state.Suggestion.Loaded = false;
            state.Suggestion.Moves = [];
            state.Suggestion.Show = false;
        };
        GameActions.Pass = function (state, args) {
            AskReferee.AskReferee.Validate(state, args);
        };
        GameActions.TakeConsent = function (state, words) {
            state.Consent.Pending = GameActions.BuildWordPairs(words);
            state.Consent.UnResolved = [];
            state.ReadOnly = true;
            var player = state.Players.Players[state.Players.Current];
            state.GameTable.Message = Util.Util.Format(Messages.Messages.YourTurn, [player.Name]);
        };
        GameActions.ResolveWord = function (state, args) {
            var word = state.Consent.Pending.pop();
            WL.WordLoader.AddWord(word.Scrabble);
            GameActions.ConsentRecieved(state, args);
        };
        GameActions.RejectWord = function (state, args) {
            if (state.Consent.Pending.length > 0) {
                var word = state.Consent.Pending.pop();
                state.Consent.UnResolved.push(word);
            }
            GameActions.ConsentRecieved(state, args);
        };
        GameActions.ConsentRecieved = function (state, args) {
            state.ReadOnly = false;
            if (state.Consent.Pending.length == 0) {
                if (state.Consent.UnResolved.length == 0) {
                    GameActions.Award(state, args);
                    return;
                }
            }
        };
        GameActions.BuildWordPairs = function (words) {
            var list = [];
            for (var indx in words) {
                var readable = Indic.Indic.ToWord(words[indx].split(','));
                list.push({ Scrabble: words[indx], Readble: readable });
            }
            return list;
        };
        GameActions.ResolveWords = function (state, args) {
            var player = state.Players.Players[state.Players.Current];
            if (player.Bot != null) {
                GameActions.Award(state, args);
            }
            else {
                var words = AskReferee.AskReferee.ExtractWords(state.Board);
                AskBot.AskServer.Resolve(words);
            }
        };
        GameActions.Award = function (state, args) {
            GameActions.ResetTable(state);
            GameActions.AwardClaims(state);
            GameActions.SetScores(state);
            GameActions.SaveBoard(state);
            GameActions.SwitchTurn(state);
            GameActions.Refresh(state);
            GameActions.SetStats(state);
            if (state.GameOver) {
                GameActions.SetWinner(state);
                PubSub.Publish(Contracts.Events.GameOver, state);
                return;
            }
            setTimeout(GameActions.PinchPlayer, Contracts.Settings.PinchWait);
        };
        GameActions.SetWinner = function (state) {
            state.ReadOnly = true;
            var winner = GameActions.FindWinner(state);
            if (winner == null) {
                state.GameTable.Message = Messages.Messages.MatchTied;
            }
            else {
                state.GameTable.Message = Util.Util.Format(Messages.Messages.Winner, [winner.Name]);
            }
            state.Dialog.Title = Messages.Messages.Name;
            state.Dialog.Message = state.GameTable.Message;
            state.Dialog.Show = true;
            state.InfoBar.Messages.push(Util.Util.Format(Messages.Messages.Stats, [state.Stats.EmptyCells, state.Stats.Occupancy.toFixed(2), state.Stats.TotalWords, state.Stats.UnUsed.toFixed(2)]));
            state.InfoBar.Messages.push(Messages.Messages.GameOver);
            state.InfoBar.Messages.push(state.GameTable.Message);
        };
        GameActions.SetStats = function (state) {
            var stats = {
                EmptyCells: 0,
                Occupancy: 0,
                TotalWords: 0,
                UnUsed: 0
            };
            stats.TotalWords = GameActions.GetTotalWords(state.Players);
            stats.EmptyCells = GameActions.GetEmptyCells(state.Board);
            stats.Occupancy = (state.Board.Cells.length - stats.EmptyCells) * 100.00 / state.Board.Cells.length;
            stats.UnUsed = state.Cabinet.Remaining * 100.00 / state.Cabinet.Total;
            state.Stats = stats;
        };
        GameActions.GetEmptyCells = function (board) {
            var tot = 0;
            for (var i = 0; i < board.Cells.length; i++) {
                var tiles = board.Cells[i].Confirmed.length;
                if (tiles == 0) {
                    tot++;
                }
            }
            return tot;
        };
        GameActions.GetTotalWords = function (players) {
            var tot = 0;
            for (var i = 0; i < players.Players.length; i++) {
                var player = players.Players[i];
                tot = tot + player.Awarded.length;
            }
            return tot;
        };
        GameActions.FindWinner = function (state) {
            var maxScore = -1;
            var winnerIndex = 0;
            for (var i = 0; i < state.Players.Players.length; i++) {
                var player = state.Players.Players[i];
                if (player.Score == maxScore) {
                    return null;
                }
                if (player.Score > maxScore) {
                    maxScore = player.Score;
                    winnerIndex = i;
                }
            }
            return state.Players.Players[winnerIndex];
        };
        GameActions.BotMoveResponse = function (state, response) {
            var result = response.Result;
            var player = state.Players.Players[state.Players.Current];
            if (result == null) {
                state.InfoBar.Messages.push(Util.Util.Format(Messages.Messages.BotNoWords, [response.Effort, player.Name]));
                GameActions.ReDraw(state, {});
                GameActions.Pass(state, {});
                return;
            }
            state.InfoBar.Messages.push(Util.Util.Format(result.WordsCount == 1 ? Messages.Messages.BotEffort : Messages.Messages.BotEffort2, [response.Effort, player.Name, result.WordsCount]));
            for (var i in result.Moves) {
                var Move = result.Moves[i];
                var tiles = Move.Tiles.split(',');
                for (var j in tiles) {
                    var tile = tiles[j];
                    if (tile == "") {
                        debugger;
                        continue;
                    }
                    if (Indic.Indic.HasSyllableSynonym(tile)) {
                        tile = Indic.Indic.GetSyllableSynonym(tile);
                    }
                    GameActions.ToBoard(state, {
                        Origin: "Tile",
                        Src: tile,
                        TargetCell: Move.Index
                    });
                }
            }
            GameActions.Pass(state, {});
        };
        GameActions.BotMove = function (state, args) {
            var post = GameActions.PostInfo(state);
            AskBot.AskServer.BotMove(post);
        };
        GameActions.PostInfo = function (state) {
            var Cells = [];
            for (var i in state.Board.Cells) {
                var Cell = state.Board.Cells[i];
                var arr = [];
                for (var indx in Cell.Confirmed) {
                    var c = Cell.Confirmed[indx];
                    if (Indic.Indic.IsSpecialSyllable(c)) {
                        arr = arr.concat(Indic.Indic.GetSyllableTiles(c));
                        continue;
                    }
                    if (Indic.Indic.IsSpecialSet(c)) {
                        arr.push(Indic.Indic.GetSynonym(c));
                        continue;
                    }
                    arr.push(c);
                }
                Cells.push(arr.join(','));
            }
            var Vowels = [];
            var Cosos = [];
            var Special = [];
            for (var i in state.GameTable.VowelTray.Tiles) {
                var Tile = state.GameTable.VowelTray.Tiles[i];
                Vowels.push(Tile.Text);
            }
            for (var i in state.GameTable.ConsoTray.Tiles) {
                var Tile = state.GameTable.ConsoTray.Tiles[i];
                if (Tile.Text.length > 1) {
                    Special.push("(" + Indic.Indic.GetSyllableTiles(Tile.Text).join(',') + ") ");
                    continue;
                }
                Cosos.push(Tile.Text);
            }
            var myScore = state.Players.Players[state.Players.Current].Score;
            var oppScore = state.Players.Players[state.Players.Current == 1 ? 0 : 1].Score;
            var Name = state.Board.Name;
            var players = state.Players.Players;
            var currentPlayer = state.Players.Current;
            var bot = players[currentPlayer].Bot;
            var BotName = bot == null ? null : bot.Id;
            var reference = Math.floor(Math.random() * 1000).toString();
            var board = {
                "Reference": reference,
                "Name": Name,
                "Bot": BotName,
                "Id": state.GameId,
                "Cells": Cells,
                "Vowels": Vowels.join(' '),
                "Conso": Cosos.join(' '),
                "Special": Special.join(' ')
            };
            var scores = { "MyScore": myScore, "OppScore": oppScore };
            return { "Board": board, "Scores": scores };
        };
        GameActions.SaveBoard = function (state) {
            for (var i = 0; i < state.Board.Cells.length; i++) {
                var Cell = state.Board.Cells[i];
                Cell.Confirmed = Cell.Confirmed.concat(Cell.Waiting);
                Cell.Waiting = [];
            }
        };
        GameActions.Refresh = function (state) {
            GameActions.RefreshTrays(state.Cabinet.Trays, state.Cache);
            GameActions.RefreshCabinet(state.Cabinet, state.Cache);
            GameActions.RefreshClaims(state);
        };
        GameActions.RefreshClaims = function (state) {
            var Claims = GameActions.WordsOnBoard(state.Board, true, false);
            var playerId = state.Players.Current;
            var player = state.Players.Players[playerId];
            player.Claimed = Claims;
            state.Players.HasClaims = Claims.length > 0;
            state.GameTable.CanReDraw = !GameActions.HasWaiting(state.Board);
        };
        GameActions.HasWaiting = function (board) {
            var res = false;
            for (var i = 0; i < board.Cells.length; i++) {
                var cell = board.Cells[i];
                if (cell.Waiting.length > 0) {
                    res = true;
                    break;
                }
            }
            return res;
        };
        GameActions.RefreshCabinet = function (cabinet, cache) {
            var remaining = 0;
            var total = 0;
            for (var key in cache) {
                remaining = remaining + cache[key].Remaining;
                total = total + cache[key].Total;
            }
            cabinet.Remaining = remaining;
            cabinet.Total = total;
            for (var i = 0; i < cabinet.Trays.length; i++) {
                var item = cabinet.Trays[i];
                for (var j = 0; j < item.Tiles.length; j++) {
                    var tile = item.Tiles[j];
                    tile.OnBoard = cache[tile.Text].OnBoard;
                    tile.Remaining = cache[tile.Text].Remaining;
                }
            }
        };
        GameActions.RefreshTrays = function (trays, cache) {
            for (var i = 0; i < trays.length; i++) {
                var tray = trays[i];
                GameActions.RefreshTray(tray, cache);
            }
        };
        GameActions.RefreshTray = function (tray, cache) {
            for (var j = 0; j < tray.Tiles.length; j++) {
                var tile = tray.Tiles[j];
                var text = tile.Text;
                if (cache[text] == null) {
                    var synm = Indic.Indic.GetSynonym(text);
                    tile.Remaining = cache[synm].Remaining;
                    tile.Total = cache[synm].Remaining;
                    tile.OnBoard = cache[synm].OnBoard;
                    continue;
                }
                {
                    tile.Remaining = cache[text].Remaining;
                    tile.Total = cache[text].Remaining;
                    tile.OnBoard = cache[text].OnBoard;
                }
            }
        };
        GameActions.AwardClaims = function (state) {
            var Claims = GameActions.WordsOnBoard(state.Board, true, false);
            var playerId = state.Players.Current;
            var player = state.Players.Players[playerId];
            player.Awarded = player.Awarded.concat(Claims);
            player.Claimed = [];
        };
        GameActions.AwardedWords = function (state) {
            var Words = [];
            for (var i = 0; i < state.Players.Players.length; i++) {
                var player = state.Players.Players[i];
                Words = Words.concat(player.Awarded);
            }
            return Words;
        };
        GameActions.SetScores = function (state) {
            for (var i = 0; i < state.Players.Players.length; i++) {
                var player = state.Players.Players[i];
                var score = 0;
                for (var w = 0; w < player.Awarded.length; w++) {
                    score += player.Awarded[w].Score;
                }
                if (player.CurrentTurn) {
                    if (player.Score == score) {
                        player.NoWords++;
                        state.InfoBar.Messages.push(Util.Util.Format(Messages.Messages.NoWordsAdded, [player.Name, player.NoWords]));
                    }
                    else {
                        player.NoWords = 0;
                    }
                }
                player.Score = score;
                if (player.NoWords >= Contracts.Settings.NoWords) {
                    state.InfoBar.Messages.push(Util.Util.Format(Messages.Messages.WhyGameOver, [player.Name, player.NoWords]));
                    state.GameOver = true;
                }
            }
        };
        GameActions.SwitchTurn = function (state) {
            for (var i = 0; i < state.Players.Players.length; i++) {
                var player = state.Players.Players[i];
                player.CurrentTurn = !player.CurrentTurn;
                if (player.CurrentTurn) {
                    state.Players.Current = i;
                    state.GameTable.Message = Util.Util.Format(Messages.Messages.YourTurn, [player.Name]);
                }
            }
        };
        GameActions.ToTray = function (state, args) {
            if (args.SrcCell == null) {
                return;
            }
            var cell = state.Board.Cells[args.SrcCell];
            if (cell.Waiting.length == 0) {
                return;
            }
            if (cell.Waiting.length > 0) {
                var toRemove = cell.Waiting[cell.Waiting.length - 1];
                cell.Waiting.pop();
                cell.Current = Indic.Indic.ToString(cell.Confirmed.concat(cell.Waiting));
                GameActions.Play(state.GameTable, toRemove, 1, true);
            }
            GameActions.Refresh(state);
        };
        GameActions.ToBoardInternal = function (state, args, useSynonyms) {
            var src = args.Src;
            var tray;
            var tile;
            if (args.Origin == "Tile") {
                var remaining = GameActions.GetRemaining(state, src);
                if (remaining == 0) {
                    return;
                }
            }
            var cell = state.Board.Cells[args.TargetCell];
            var list = cell.Confirmed.concat(cell.Waiting);
            list.push(src);
            var isValid = Indic.Indic.IsValid(list);
            if (!isValid) {
                if (!useSynonyms) {
                    return;
                }
                var synonym = Indic.Indic.GetSynonym(src);
                if (synonym == null) {
                    return;
                }
                var iPos = {};
                iPos.Src = synonym;
                iPos.TargetCell = args.TargetCell;
                iPos.Origin = args.Origin;
                iPos.SrcCell = args.SrcCell;
                GameActions.ToBoardInternal(state, iPos, false);
                return;
            }
            cell.Waiting.push(src);
            list = cell.Confirmed.concat(cell.Waiting);
            cell.Current = Indic.Indic.ToString(list);
            if (args.Origin == "Tile") {
                GameActions.Play(state.GameTable, src, 0, true);
            }
            if (args.Origin == "Cell") {
                var srcCell = state.Board.Cells[args.SrcCell];
                srcCell.Waiting.pop();
                list = srcCell.Confirmed.concat(srcCell.Waiting);
                srcCell.Current = Indic.Indic.ToString(list);
            }
            GameActions.Refresh(state);
        };
        GameActions.Play = function (gameTable, src, val, useSynonym) {
            GameActions.PlayInternal(gameTable.VowelTray, src, val, true);
            GameActions.PlayInternal(gameTable.ConsoTray, src, val, true);
        };
        GameActions.PlayInternal = function (tray, src, val, useSynonym) {
            var indx = -1;
            for (var i = 0; i < tray.Tiles.length; i++) {
                var tile = tray.Tiles[i];
                if (tile.Text != src) {
                    continue;
                }
                if (tile.Remaining == val || tile.Total == val) {
                    continue;
                }
                tile.Remaining = val;
                tile.Total = val;
                indx = i;
                break;
            }
            if (indx == -1 && useSynonym) {
                var synonym = Indic.Indic.GetSynonym(src);
                if (synonym == null) {
                    return;
                }
                GameActions.PlayInternal(tray, synonym, val, false);
            }
        };
        GameActions.ToBoard = function (state, args) {
            GameActions.ToBoardInternal(state, args, true);
        };
        GameActions.GetRemaining = function (state, char) {
            var cabinet = state.Cabinet;
            var cache = state.Cache;
            if (cache[char] == null) {
                var synonym = Indic.Indic.GetSynonym(char);
                return cache[synonym].Remaining;
            }
            return cache[char].Remaining;
        };
        GameActions.OpenClose = function (state, args) {
            var tray = state.Cabinet.Trays[args.TrayIndex];
            tray.Show = !tray.Show;
            var cnt = 0;
            var last = -1;
            for (var i = 0; i < state.Cabinet.Trays.length; i++) {
                if (cnt > 1) {
                    break;
                }
                if (state.Cabinet.Trays[i].Show) {
                    cnt++;
                    last = i;
                }
            }
            if (cnt == 1) {
                state.Cabinet.Trays[last].Disabled = true;
            }
            else {
                for (var i = 0; i < state.Cabinet.Trays.length; i++) {
                    state.Cabinet.Trays[i].Disabled = false;
                }
            }
        };
        GameActions.SetRemaining = function (cache, text, incBy) {
            if (cache[text] != null) {
                cache[text].Remaining = cache[text].Remaining + incBy;
                cache[text].OnBoard = cache[text].OnBoard + incBy;
                return;
            }
            var synonym = Indic.Indic.GetSynonym(text);
            cache[synonym].Remaining = cache[synonym].Remaining + incBy;
            cache[text].OnBoard = cache[text].OnBoard + incBy;
        };
        GameActions.WordsOnColumn = function (Board, i, claimsOnly, asSyllables) {
            return GameActions.FindWords(Board, 'C', i, claimsOnly, asSyllables);
        };
        GameActions.WordsOnRow = function (Board, i, claimsOnly, asSyllables) {
            return GameActions.FindWords(Board, 'R', i, claimsOnly, asSyllables);
        };
        GameActions.FindWords = function (Board, option, r, claimsOnly, asSyllables) {
            var Words = [];
            var pending = "";
            var cnt = 0;
            var waiting = false;
            var score = 0;
            var seperator = asSyllables ? "," : "";
            for (var i = 0; i < Board.Size; i++) {
                var index = -1;
                switch (option) {
                    case 'R':
                        index = Util.Util.Abs(r, i, Board.Size);
                        break;
                    case 'C':
                        index = Util.Util.Abs(i, r, Board.Size);
                        break;
                }
                var cell = Board.Cells[index];
                if (cell.Waiting.length + cell.Confirmed.length != 0) {
                    pending += cell.Current + seperator;
                    cnt++;
                    if (cell.Waiting.length > 0) {
                        waiting = true;
                    }
                    for (var x in cell.Waiting) {
                        score += Board.TileWeights[cell.Waiting[x]];
                    }
                    for (var x in cell.Confirmed) {
                        score += Board.TileWeights[cell.Confirmed[x]];
                    }
                    score += cell.Weight;
                    continue;
                }
                if (pending != "" && cell.Waiting.length + cell.Confirmed.length == 0) {
                    if (cnt > 1) {
                        var word = (pending + seperator + cell.Current);
                        word = word.TrimEnd(' ').TrimEnd(seperator);
                        var W = { Text: word, Waiting: waiting, Score: score };
                        if ((claimsOnly && waiting) || !claimsOnly) {
                            Words.push(W);
                        }
                    }
                    pending = "";
                    cnt = 0;
                    waiting = false;
                    score = 0;
                    continue;
                }
            }
            if (cnt > 1) {
                var word = pending;
                word = word.TrimEnd(' ').TrimEnd(seperator);
                var W = { Text: word, Waiting: waiting, Score: score };
                if ((claimsOnly && waiting) || !claimsOnly) {
                    Words.push(W);
                }
            }
            return Words;
        };
        GameActions.WordsOnBoard = function (Board, claimsOnly, asSyllables) {
            var Words = [];
            for (var i = 0; i < Board.Size; i++) {
                var R = GameActions.WordsOnRow(Board, i, claimsOnly, asSyllables);
                var C = GameActions.WordsOnColumn(Board, i, claimsOnly, asSyllables);
                Words = Words.concat(R);
                Words = Words.concat(C);
            }
            return Words;
        };
        GameActions.ReDraw = function (state, args) {
            GameActions.ResetOnBoard(state.Cache);
            {
                var available = GameActions.DrawVowelTiles(state.Cache, {}, state.GameTable.MaxVowels);
                var tray = GameActions.SetTableTray(available, state.Board.TileWeights, "Vowels");
                state.GameTable.VowelTray = tray;
                GameActions.SetOnBoard(state.Cache, available);
            }
            {
                var available = GameActions.DrawConsoTiles(state.Cache, {}, state.GameTable.MaxOnTable - state.GameTable.MaxVowels);
                var tray = GameActions.SetTableTray(available, state.Board.TileWeights, "Conso");
                state.GameTable.ConsoTray = tray;
                GameActions.SetOnBoard(state.Cache, available);
            }
            GameActions.RefreshCabinet(state.Cabinet, state.Cache);
        };
        GameActions.ResetOnBoard = function (cache) {
            for (var prop in cache) {
                cache[prop].OnBoard = 0;
            }
        };
        GameActions.SetOnBoard = function (cache, available) {
            for (var item in available) {
                cache[available[item]].OnBoard++;
            }
        };
        GameActions.ResetVowelsTray = function (state) {
            var gameTable = state.GameTable;
            var vtray = state.GameTable.VowelTray;
            var movedTiles = GameActions.CountTiles(vtray, true);
            for (var indx in movedTiles) {
                var toRemove = movedTiles[indx];
                GameActions.SetRemaining(state.Cache, toRemove, -1);
            }
            var unMovedTiles = GameActions.CountTiles(vtray, false);
            var vCount = 0;
            var unMoved = {};
            for (var i = 0; i < unMovedTiles.length; i++) {
                var prop = unMovedTiles[i];
                if (Indic.Indic.IsVowel(prop) || Indic.Indic.IsSunnaSet(prop)) {
                    vCount++;
                    unMoved[prop] = (unMoved[prop] == null) ? 1 : (unMoved[prop] + 1);
                }
            }
            var fresh = GameActions.DrawVowelTiles(state.Cache, unMoved, gameTable.MaxVowels - vCount);
            var available = unMovedTiles.concat(fresh);
            available.sort();
            state.GameTable.VowelTray = GameActions.SetTableTray(available, state.Board.TileWeights, "Vowels");
        };
        GameActions.ResetConsoTray = function (state) {
            var gameTable = state.GameTable;
            var ctray = state.GameTable.ConsoTray;
            var movedTiles = GameActions.CountTiles(ctray, true);
            for (var indx in movedTiles) {
                var toRemove = movedTiles[indx];
                GameActions.SetRemaining(state.Cache, toRemove, -1);
            }
            var unMovedTiles = GameActions.CountTiles(ctray, false);
            var vCount = 0;
            var unMoved = {};
            for (var i = 0; i < unMovedTiles.length; i++) {
                var prop = unMovedTiles[i];
                if (Indic.Indic.IsConsonent(prop)) {
                    vCount++;
                    unMoved[prop] = (unMoved[prop] == null) ? 1 : (unMoved[prop] + 1);
                }
            }
            var fresh = GameActions.DrawConsoTiles(state.Cache, unMoved, (gameTable.MaxOnTable - gameTable.MaxVowels) - vCount);
            var available = unMovedTiles.concat(fresh);
            available.sort();
            state.GameTable.ConsoTray = GameActions.SetTableTray(available, state.Board.TileWeights, "Conso");
        };
        GameActions.ResetTable = function (state) {
            GameActions.ResetVowelsTray(state);
            GameActions.ResetConsoTray(state);
        };
        GameActions.CountTiles = function (tray, moved) {
            var set = [];
            for (var i = 0; i < tray.Tiles.length; i++) {
                if ((moved && tray.Tiles[i].Remaining == 0) ||
                    (!moved && tray.Tiles[i].Remaining != 0)) {
                    set.push(tray.Tiles[i].Text);
                }
            }
            return set;
        };
        GameActions.SetTableTray = function (picked, tileWeights, id) {
            var tray = {};
            tray.Id = id;
            tray.key = tray.Id;
            tray.className = "tray";
            tray.Title = "Game Table";
            tray.Show = true;
            tray.Disabled = false;
            tray.ReadOnly = false;
            tray.Index = -1;
            tray.Tiles = [];
            var index = 0;
            for (var j = 0; j < picked.length; j++) {
                var prop = {};
                prop.Id = "S_" + (index + 1).toString();
                prop.key = prop.Id;
                prop.Text = picked[j];
                prop.Remaining = 1;
                prop.Total = 1;
                prop.Weight = tileWeights[picked[j]];
                prop.Index = j;
                prop.TrayIndex = -1;
                prop.ReadOnly = false;
                tray.Tiles.push(prop);
                index++;
            }
            return tray;
        };
        GameActions.AvailableVowels = function (cache, unMoved) {
            var available = [];
            for (var prop in cache) {
                var pending = unMoved[prop] == null ? 0 : unMoved[prop];
                if ((Indic.Indic.IsVowel(prop) || Indic.Indic.IsSunnaSet(prop)) && (cache[prop].Remaining - cache[prop].OnBoard - pending > 0)) {
                    for (var i = 0; i < cache[prop].Remaining - cache[prop].OnBoard; i++) {
                        available.push(prop);
                    }
                }
            }
            return available;
        };
        GameActions.AvailableConso = function (cache, unMoved) {
            var available = [];
            for (var prop in cache) {
                var pending = unMoved[prop] == null ? 0 : unMoved[prop];
                if (Indic.Indic.IsConsonent(prop) && (cache[prop].Remaining - cache[prop].OnBoard - pending > 0)) {
                    for (var i = 0; i < cache[prop].Remaining - cache[prop].OnBoard; i++) {
                        available.push(prop);
                    }
                }
            }
            return available;
        };
        GameActions.DrawVowelTiles = function (cache, unMoved, maxVowels) {
            var vowels = GameActions.AvailableVowels(cache, unMoved);
            var pickedVowels = Util.Util.Draw(vowels, maxVowels);
            return pickedVowels;
        };
        GameActions.DrawConsoTiles = function (cache, unMoved, maxConsos) {
            var conso = GameActions.AvailableConso(cache, unMoved);
            var pickedConso = Util.Util.Draw(conso, maxConsos);
            return pickedConso;
        };
        GameActions.GameOver = function (state) {
            GameActions.Post(state);
            GameActions.Dispose(state);
        };
        GameActions.Post = function (state) {
            GameActions.PostMetrics(state);
            WL.WordLoader.Post(state.GameId);
        };
        GameActions.PostMetrics = function (state) {
            var players = [];
            for (var indx in state.Players.Players) {
                var Player = state.Players.Players[indx];
                var p = { id: Player.Bot == null ? "player" : Player.Bot.Id, score: Player.Score, words: Player.Awarded.length };
                players.push(p);
            }
            var winner = GameActions.FindWinner(state);
            var stats = { "EC": state.Stats.EmptyCells, "TW": state.Stats.TotalWords, "UU": Math.round(state.Stats.UnUsed * 100) / 100, "O": Math.round(state.Stats.Occupancy * 100) / 100 };
            var metrics = {};
            metrics["I"] = state.GameId;
            metrics["L"] = state.Board.Language;
            metrics["W"] = winner.Bot == null ? "player" : winner.Bot.Id;
            metrics["P"] = players;
            metrics["S"] = stats;
            AskBot.AskServer.SendMetrics(metrics);
        };
        GameActions.Dispose = function (staste) {
            WL.WordLoader.Dispose();
        };
        return GameActions;
    }());
    exports.GameActions = GameActions;
    var PubSub = (function () {
        function PubSub() {
        }
        PubSub.Subscribe = function (eventId, handler) {
            if (!PubSub.Events.hasOwnProperty(eventId.toString())) {
                PubSub.Events[eventId] = [];
            }
            var token = (++PubSub.Counter);
            PubSub.Events[eventId].push({ id: token, handler: handler });
            return token;
        };
        PubSub.UnSubscribe = function (eventId) {
            for (var m in PubSub.Events) {
                if (!PubSub.Events.hasOwnProperty(m)) {
                    continue;
                }
                for (var i = 0, j = PubSub.Events[m].length; i < j; i++) {
                    if (PubSub.Events[m][i].id != eventId) {
                        continue;
                    }
                    PubSub.Events[m].splice(i, 1);
                    return;
                }
            }
        };
        PubSub.Publish = function (eventId, args) {
            if (!PubSub.Events.hasOwnProperty(eventId.toString())) {
                return;
            }
            setTimeout(function () { PubSub.Notify(eventId, args); }, 0);
            return;
        };
        PubSub.Notify = function (eventId, args) {
            var subscribers = PubSub.Events[eventId];
            for (var i = 0, j = subscribers.length; i < j; i++) {
                try {
                    subscribers[i].handler(args);
                }
                catch (e) {
                    setTimeout(function () { throw e; }, 0);
                }
            }
        };
        ;
        PubSub.Counter = -1;
        PubSub.Events = {};
        return PubSub;
    }());
    exports.PubSub = PubSub;
});
define("GameLoader", ["require", "exports", "AksharaSets", "Messages", "DragDropTouch", "GameActions", "GameStore", "WordLoader"], function (require, exports, Sets, M, DragDropTouch, GA, GS, WL) {
    "use strict";
    var GameLoader = (function () {
        function GameLoader() {
        }
        GameLoader.ConfigGame = function () {
            for (var key in Sets.AksharaSets) {
                Sets.AksharaSets[key] = Config.CharSet[key];
            }
            for (var key in M.Messages) {
                M.Messages[key] = Config.Localization[key];
            }
        };
        GameLoader.Init = function () {
            DragDropTouch.DragDropTouch._instance;
            GameLoader.ConfigGame();
            GS.GameStore.CreateStore();
            GS.GameStore.Subscribe(GA.GameActions.Render);
            GameLoader.Prepare();
        };
        GameLoader.Prepare = function () {
            var list = GameLoader.Vocabularies(Config.Players);
            if (list.length == 0) {
                list.push(Config.CharSet.Dictionary);
            }
            WL.WordLoader.Prepare(list);
        };
        GameLoader.Vocabularies = function (players) {
            var dicts = [];
            for (var i = 0; i < players.length; i++) {
                var player = players[i];
                var IsBot = player.Bot != null;
                if (!IsBot) {
                    continue;
                }
                if (dicts.Contains(player.Bot.Dictionary)) {
                    continue;
                }
                dicts.push(player.Bot.Dictionary);
            }
            return dicts;
        };
        return GameLoader;
    }());
    exports.GameLoader = GameLoader;
});
define("AlertDialog", ["require", "exports", "react", "_AlertDialog", "Util", "Messages"], function (require, exports, React, _AlertDialog, Util, Messages) {
    "use strict";
    var AlertDialog = (function (_super) {
        __extends(AlertDialog, _super);
        function AlertDialog(props) {
            _super.call(this, props);
            this.state = props;
        }
        AlertDialog.prototype.render = function () {
            var id = "AlertDialog";
            return React.createElement(_AlertDialog.default, Util.Util.Merge(this.props, {
                Id: id,
                key: id,
                ref: id,
                className: id,
                ReadOnly: false,
                ShowClose: false,
                ConfirmText: Messages.Messages.OK, ShowConfirm: true,
                OnConfirm: this.props.OnConfirm,
            }));
        };
        return AlertDialog;
    }(React.Component));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = AlertDialog;
});
define("_SuggestionDialog", ["require", "exports", "react", "Messages", "_OverlayDialog"], function (require, exports, React, Messages, OverlayDialog) {
    "use strict";
    var _SuggestionDialog = (function (_super) {
        __extends(_SuggestionDialog, _super);
        function _SuggestionDialog(props) {
            _super.call(this, props);
            this.state = props;
        }
        _SuggestionDialog.prototype.render = function () {
            var childs = [];
            if (!this.props.Loaded) {
                var content = React.createElement('div', {
                    key: "suggest_" + this.props.Id,
                    className: "oFContent"
                }, Messages.Messages.SuggestLoading);
                childs.push(content);
            }
            else {
                var items = [];
                var hasMoves = this.props.Moves.length != 0;
                for (var i = 0; i < this.props.Moves.length; i++) {
                    var move = this.props.Moves[i];
                    {
                        var li = React.createElement("li", { key: "li" + i }, "Direction: " + move.Direction);
                        items.push(li);
                    }
                    hasMoves = move.Moves.length != 0;
                    for (var indx in move.Moves) {
                        var li = React.createElement("li", { key: "li" + i + indx }, move.Moves[indx].Tiles + "  at " + move.Moves[indx].Index);
                        items.push(li);
                    }
                }
                if (!hasMoves) {
                    var li = React.createElement("li", { key: "li" + i }, Messages.Messages.NoSuggestions);
                    items.push(li);
                }
                var id = "ul";
                var ul = React.createElement("ul", {
                    id: id,
                    key: id,
                    ref: id,
                    className: "ul",
                    title: ""
                }, items);
                childs.push(ul);
            }
            var content = React.createElement('div', {
                key: "suggest_" + this.props.Id,
                className: "oFContent"
            }, childs);
            return this.renderDialog(content);
        };
        return _SuggestionDialog;
    }(OverlayDialog.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = _SuggestionDialog;
});
define("SuggestionForm", ["require", "exports", "react", "Contracts", "_SuggestionDialog", "Util", "Messages", "GameStore"], function (require, exports, React, Contracts, _SuggestionDialog, Util, Messages, GS) {
    "use strict";
    var SuggestionForm = (function (_super) {
        __extends(SuggestionForm, _super);
        function SuggestionForm(props) {
            _super.call(this, props);
            this.state = props;
        }
        SuggestionForm.prototype.render = function () {
            var id = "SuggestDialog";
            return React.createElement(_SuggestionDialog.default, Util.Util.Merge(this.props, {
                Id: id,
                key: id,
                ref: id,
                className: id,
                ReadOnly: false,
                ShowClose: false,
                ConfirmText: Messages.Messages.OK, ShowConfirm: true,
                Title: Messages.Messages.Suggest,
                OnConfirm: SuggestionForm.Dismiss,
            }));
        };
        SuggestionForm.Dismiss = function () {
            GS.GameStore.Dispatch({
                type: Contracts.Actions.DismissSuggestion,
                args: {}
            });
        };
        return SuggestionForm;
    }(React.Component));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = SuggestionForm;
});
define("Index", ["require", "exports", "Util"], function (require, exports, Util) {
    "use strict";
    var Index = (function () {
        function Index() {
        }
        Index.Play = function (lang) {
            var player1 = Util.DOMUtil.SelectedValue(lang + ".player1");
            var player2 = Util.DOMUtil.SelectedValue(lang + ".player2");
            var board = Util.DOMUtil.SelectedValue("boards");
            window.location.href = Util.Util.Format("Scrabble.aspx?{0}-{1}:{2},{3}", [lang, board, player1, player2]);
        };
        Index.Register = function () {
            Util.DOMUtil.ApplyTemplate("list", 'langTemplate', Config);
            for (var indx in Config.Langs) {
                var lang = Config.Langs[indx];
                Util.DOMUtil.RegisterClick(lang + '.Play', function (e) {
                    var lang = e.currentTarget.getAttribute("-lang");
                    Index.Play(lang);
                });
            }
        };
        return Index;
    }());
    exports.Index = Index;
    Index.Register();
});
define("Game", ["require", "exports", "GameLoader"], function (require, exports, GameLoader) {
    "use strict";
    GameLoader.GameLoader.Init();
});
