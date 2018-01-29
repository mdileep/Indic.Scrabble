var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define("Contracts", ["require", "exports"], function (require, exports) {
    "use strict";
});
define("Parser", ["require", "exports"], function (require, exports) {
    "use strict";
    var Parser = (function () {
        function Parser() {
        }
        Parser.Parse = function (JSON) {
            if (console)
                console.log("Parse");
            var left = Parser.ParseLeft(JSON.Left);
            var center = Parser.ParseCenter(JSON.Center);
            var right = Parser.ParseRight(JSON.Right);
            var gameState = {
                id: JSON.id,
                key: JSON.id,
                Left: left,
                Right: right,
                Center: center
            };
            return gameState;
        };
        Parser.ParseLeft = function (JSON) {
            var raw = {};
            raw.key = "Left";
            raw.items = [];
            var index = 0;
            for (var i = 0; i < JSON.Items.length; i++) {
                var item = JSON.Items[i];
                var props = {};
                props.id = item.Id;
                props.key = item.Id;
                props.className = item.Id;
                props.title = item.Title;
                props.show = item.Show;
                props.disabled = false;
                props.index = i;
                props.items = [];
                for (var j = 0; j < item.Set.length; j++) {
                    var prop = {};
                    prop.id = "T_" + (index + 1).toString();
                    prop.key = prop.id;
                    prop.text = item.Set[j];
                    prop.count = item.Count;
                    prop.index = j;
                    prop.groupIndex = i;
                    props.items.push(prop);
                    index++;
                }
                raw.items.push(props);
            }
            return raw;
        };
        Parser.ParseRight = function (JSON) {
            var raw = {};
            return raw;
        };
        Parser.ParseCenter = function (JSON) {
            var raw = {};
            raw.key = "Center";
            raw.size = JSON.Size;
            raw.Cells = [];
            var index = 0;
            for (var i = 0; i < JSON.Size; i++) {
                for (var j = 0; j < JSON.Size; j++) {
                    var cell = {};
                    cell.id = "C_" + (index + 1).toString();
                    cell.key = cell.id;
                    cell.weight = JSON.Weights[index];
                    cell.current = " ";
                    cell.index = index;
                    cell.last = "";
                    cell.waiting = [];
                    cell.confirmed = [];
                    raw.Cells.push(cell);
                    index++;
                }
            }
            return raw;
        };
        return Parser;
    }());
    exports.Parser = Parser;
});
define("GameRules", ["require", "exports"], function (require, exports) {
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
            var isValid = Indic.IsValidSyllable(list);
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
        Indic.IsValidSyllable = function (arr) {
            if (arr.length == 1 && Indic.IsFullSpecialSet(arr[0])) {
                return false;
            }
            var res = false;
            var special = 0;
            var hasConso = false;
            var hasVowel = false;
            for (var i = 0; i < arr.length; i++) {
                if (Indic.IsFullSpecialSet(arr[i])) {
                    special++;
                }
                hasConso = Indic.IsConsonent(arr[i]);
                hasVowel = Indic.IsVowel(arr[i]);
                res = true;
            }
            if (hasConso && hasVowel) {
                return false;
            }
            if (special > 1) {
                return false;
            }
            return res;
        };
        Indic.Merge = function (arr) {
            var res = "";
            var pending = "";
            var isConso = false;
            debugger;
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
define("GameState", ["require", "exports", "Parser", "GameRules"], function (require, exports, Parser, GameRules) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = function (state, action) {
        if (state === void 0) { state = Parser.Parser.Parse(InitialState); }
        var args = action.args;
        switch (action.type) {
            default:
                return state;
            case "MOVE":
                if (console)
                    console.log("Moving Tile from Tray to Board.");
                GameRules.GameRules.ToBoard(state, args);
                return state;
            case "TOGGLE_GRP":
                if (console)
                    console.log("Opening Tray");
                GameRules.GameRules.GroupsDisplay(state, args);
                return state;
            case "TO_TRAY":
                if (console)
                    console.log("Moving back to Tray.");
                GameRules.GameRules.ToTray(state, args);
                return state;
        }
    };
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
            if (this.props.count > 0) {
                childs.push(this.renderCount());
            }
            childs.push(this.renderContent());
            if (this.props.count > 0) {
                childs.push(this.renderEmpty());
            }
            var className = this.props.count > 0 ? "span" : "span readonly";
            var draggable = this.props.count > 0;
            if (draggable) {
                className += " draggable";
            }
            var elem = React.createElement('span', {
                id: this.props.id,
                ref: this.props.id,
                className: className,
                title: this.props.text,
                draggable: draggable,
                onDragStart: function (evt) { _this.OnDragStart(evt); },
                onClick: this.OnClick
            }, childs);
            return elem;
        };
        Tile.prototype.renderContent = function () {
            var contentId = "content_" + this.props.id;
            var content = React.createElement('span', {
                id: contentId,
                ref: contentId,
                key: contentId,
                className: "content",
                title: this.props.text,
            }, [], this.props.text);
            return content;
        };
        Tile.prototype.renderCount = function () {
            var countId = "count_" + this.props.id;
            var count = React.createElement('span', {
                id: countId,
                ref: countId,
                key: countId,
                className: "count",
                title: this.props.count
            }, [], this.props.count);
            return count;
        };
        Tile.prototype.renderEmpty = function () {
            var blank = React.createElement('span', {
                key: "",
                className: "count",
            }, [], " ");
            return blank;
        };
        Tile.prototype.OnDragStart = function (ev) {
            if (console)
                console.log("OnDragStart");
            var elem = ev.target;
            var data = {
                groupIndex: this.props.groupIndex,
                tileIndex: this.props.index,
                text: this.props.text
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
define("Tiles", ["require", "exports", "react", "Tile"], function (require, exports, React, Tile) {
    "use strict";
    var Tiles = (function (_super) {
        __extends(Tiles, _super);
        function Tiles(props) {
            _super.call(this, props);
            this.state = props;
        }
        Tiles.prototype.render = function () {
            var tiles = [];
            for (var i = 0; i < this.props.items.length; i++) {
                var tileProp = this.props.items[i];
                var id = this.props.id + "_" + (i + 1);
                var tile = React.createElement(Tile.default, {
                    id: id,
                    key: id,
                    text: tileProp.text,
                    count: tileProp.count,
                    index: tileProp.index,
                    groupIndex: tileProp.groupIndex
                });
                tiles.push(tile);
            }
            var className = this.props.className + " block" + (this.props.show ? "" : " hide");
            var blocks = React.createElement('div', {
                id: this.props.id,
                key: this.props.id,
                ref: this.props.id,
                className: className,
                title: this.props.title
            }, tiles);
            return blocks;
        };
        return Tiles;
    }(React.Component));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Tiles;
});
define("Selection", ["require", "exports", "react", "GameEvents"], function (require, exports, React, GameEvents) {
    "use strict";
    var GrpoupSelection = (function (_super) {
        __extends(GrpoupSelection, _super);
        function GrpoupSelection(props) {
            _super.call(this, props);
            this.state = props;
        }
        GrpoupSelection.prototype.render = function () {
            var _this = this;
            var TilesProp = this.props;
            var childs = [];
            var chkId = "chk_" + TilesProp.id;
            var chkBox = React.createElement('input', {
                type: "checkbox",
                name: "TileGroup",
                id: chkId,
                key: chkId,
                ref: chkId,
                defaultChecked: TilesProp.show,
                disabled: TilesProp.disabled,
                onChange: function (evt) { _this.ToggleGroup(evt); }
            });
            var label = React.createElement('label', {
                htmlFor: "chk_" + TilesProp.id,
                key: "lbl_" + TilesProp.id
            }, TilesProp.title);
            childs.push(chkBox);
            childs.push(label);
            var blocks = React.createElement('span', null, childs);
            return blocks;
        };
        GrpoupSelection.prototype.ToggleGroup = function (evt) {
            GameEvents.GameEvents.store.dispatch({
                type: 'TOGGLE_GRP', args: { groupIndex: this.props.index }
            });
        };
        return GrpoupSelection;
    }(React.Component));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GrpoupSelection;
});
define("InputArea", ["require", "exports", "react", "Tiles", "Selection", "GameEvents"], function (require, exports, React, Tiles, GrpoupSelection, GameEvents) {
    "use strict";
    var InputArea = (function (_super) {
        __extends(InputArea, _super);
        function InputArea(props) {
            _super.call(this, props);
            this.state = props;
        }
        InputArea.prototype.render = function () {
            var _this = this;
            if (console)
                console.log("InputArea");
            var childs = [];
            for (var i = 0; i < this.props.items.length; i++) {
                var TilesProp = this.props.items[i];
                TilesProp.key = "G" + TilesProp.id;
                var Group = React.createElement(GrpoupSelection.default, TilesProp);
                childs.push(Group);
            }
            for (var i = 0; i < this.props.items.length; i++) {
                var TilesProp = this.props.items[i];
                TilesProp.key = TilesProp.id;
                var Group = React.createElement(Tiles.default, TilesProp);
                childs.push(Group);
            }
            var blocks = React.createElement('div', {
                id: "inputs",
                key: "inputs",
                ref: "inputs",
                className: "area",
                title: "Input Area",
                onDragOver: this.OnDragOver,
                onDrop: function (evt) { _this.OnDrop(evt); },
            }, childs);
            return blocks;
        };
        InputArea.prototype.OnDragOver = function (ev) {
            ev.preventDefault();
        };
        InputArea.prototype.OnDrop = function (ev) {
            ev.preventDefault();
            var text = ev.dataTransfer.getData("text");
            var data = JSON.parse(text);
            GameEvents.GameEvents.store.dispatch({
                type: 'TO_TRAY', args: {
                    index: data.tileIndex
                }
            });
        };
        return InputArea;
    }(React.Component));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = InputArea;
});
define("BoardArea", ["require", "exports", "react", "BoardCell"], function (require, exports, React, BoardCell) {
    "use strict";
    var BoardArea = (function (_super) {
        __extends(BoardArea, _super);
        function BoardArea(props) {
            _super.call(this, props);
            this.state = props;
        }
        BoardArea.prototype.render = function () {
            var index = 0;
            var rows = [];
            for (var i = 0; i < this.props.size; i++) {
                var cells = [];
                for (var j = 0; j < this.props.size; j++) {
                    var cell = React.createElement(BoardCell.default, this.props.Cells[index], {});
                    cells.push(cell);
                    index++;
                }
                var rowId = "tile_" + (i + 1);
                var row = React.createElement("tr", {
                    id: rowId,
                    key: rowId,
                    ref: rowId,
                    className: "row",
                    title: "Row",
                }, cells);
                rows.push(row);
            }
            var tbody = React.createElement("tbody", {}, rows);
            var table = React.createElement("table", {
                id: "table",
                key: "table",
                ref: "table",
                className: "table",
                title: "Table",
            }, tbody);
            var blocks = React.createElement('div', {
                id: "board",
                key: "board",
                ref: "board",
                className: "board",
                title: "Board Area",
            }, [table]);
            return blocks;
        };
        return BoardArea;
    }(React.Component));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = BoardArea;
});
define("ScrabbleGame", ["require", "exports", "react", "InputArea", "BoardArea"], function (require, exports, React, InputArea, BoardArea) {
    "use strict";
    var ScrabbleGame = (function (_super) {
        __extends(ScrabbleGame, _super);
        function ScrabbleGame(props) {
            _super.call(this, props);
            this.state = props;
        }
        ScrabbleGame.prototype.render = function () {
            var left = React.createElement(InputArea.default, this.props.Left);
            var center = React.createElement(BoardArea.default, this.props.Center);
            var right = React.createElement("span", {
                className: "trash span",
                key: "right"
            });
            var block = React.createElement('div', {
                id: this.props.id,
                ref: this.props.id,
                className: "game",
                title: "Scrabble",
            }, [left, center, right]);
            return block;
        };
        return ScrabbleGame;
    }(React.Component));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ScrabbleGame;
});
define("GameEvents", ["require", "exports", "react", "react-dom", 'redux', "GameState", "ScrabbleGame"], function (require, exports, React, ReactDOM, Redux, GameState_1, Game) {
    "use strict";
    var GameEvents = (function () {
        function GameEvents() {
        }
        GameEvents.OnDragOver = function (ev) {
            ev.preventDefault();
        };
        GameEvents.OnGameRender = function () {
            if (console) {
                console.log("OnGameRender");
            }
            var state = GameEvents.store.getState();
            var left = React.createElement(Game.default, state);
            return ReactDOM.render(left, GameEvents.rootEl);
        };
        GameEvents.Init = function () {
            GameEvents.store = Redux.createStore(GameState_1.default);
            GameEvents.rootEl = document.getElementById('root');
            GameEvents.OnGameRender();
            GameEvents.store.subscribe(GameEvents.OnGameRender);
        };
        return GameEvents;
    }());
    exports.GameEvents = GameEvents;
});
define("BoardCell", ["require", "exports", "react", "GameEvents"], function (require, exports, React, GameEvents) {
    "use strict";
    var BoardCell = (function (_super) {
        __extends(BoardCell, _super);
        function BoardCell(props) {
            _super.call(this, props);
            this.state = props;
        }
        BoardCell.prototype.render = function () {
            var _this = this;
            var className = this.props.current.trim().length == 0 ? "td" : "td filled";
            var draggable = (this.props.current.trim().length > 0 || (this.props.last != null && this.props.last != this.props.current));
            if (draggable) {
                className += " draggable";
            }
            var block = React.createElement('td', {
                id: this.props.id,
                ref: this.props.id,
                className: className,
                title: this.props.current,
                index: this.props.index,
                draggable: draggable,
                onDragStart: function (evt) { _this.OnDragStart(evt); },
                onDragOver: this.OnDragOver,
                onDrop: function (evt) { _this.OnDrop(evt); }
            }, [], this.props.current);
            return block;
        };
        BoardCell.prototype.OnDragOver = function (ev) {
            ev.preventDefault();
        };
        BoardCell.prototype.OnDrop = function (ev) {
            ev.preventDefault();
            var text = ev.dataTransfer.getData("text");
            var data = JSON.parse(text);
            GameEvents.GameEvents.store.dispatch({
                type: 'MOVE', args: {
                    cellIndex: this.props.index,
                    tileIndex: data.tileIndex,
                    groupIndex: data.groupIndex,
                    src: data.text
                }
            });
        };
        BoardCell.prototype.OnDragStart = function (ev) {
            if (console)
                console.log("OnDragStart");
            var elem = ev.target;
            var data = {
                tileIndex: this.props.index
            };
            ev.dataTransfer.setData("text", JSON.stringify(data));
        };
        return BoardCell;
    }(React.Component));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = BoardCell;
});
define("Index", ["require", "exports", "GameEvents"], function (require, exports, GameEvents) {
    "use strict";
    GameEvents.GameEvents.Init();
});
var InitialState = {
    id: "Telugu",
    Left: {
        Items: [
            {
                Id: "Vowels",
                Title: "అచ్చులు",
                Count: 5,
                Show: true,
                Set: ["అ", "ఆ",
                    "ఇ", "ఈ",
                    "ఉ", "ఊ",
                    "ఎ", "ఏ", "ఐ",
                    "ఒ", "ఓ", "ఔ",
                    "ఋ", "ౠ"]
            },
            {
                Id: "SuperScripts",
                Title: "గుణింతాలు",
                Count: 20,
                Show: true,
                Set: ["ా",
                    "ి", "ీ",
                    "ు", "ూ",
                    "ృ", "ౄ",
                    "ె", "ే",
                    "ై",
                    "ొ", "ో",
                    "ౌ", "్",
                    "ం", "ః"]
            },
            {
                Id: "Consonants",
                Title: "హల్లులు",
                Count: 5,
                Show: true,
                Set: ["క", "ఖ", "గ", "ఘ", "ఙ",
                    "చ", "ఛ", "జ", "ఝ", "ఞ",
                    "ట", "ఠ", "డ", "ఢ", "ణ",
                    "త", "థ", "ద", "ధ", "న",
                    "ప", "ఫ", "బ", "భ", "మ",
                    "య", "ర", "ల", "వ",
                    "శ", "ష", "స",
                    "హ", "ళ", "ఱ",
                    "క్ష"]
            }
        ]
    },
    Center: {
        Size: 10,
        Weights: [
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        ]
    },
    Right: {}
};
