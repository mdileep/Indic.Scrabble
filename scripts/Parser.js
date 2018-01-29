define(["require", "exports"], function (require, exports) {
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
