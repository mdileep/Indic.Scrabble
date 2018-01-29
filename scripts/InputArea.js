var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "react", 'Tiles', 'Selection', 'GameEvents'], function (require, exports, React, Tiles, GrpoupSelection, GameEvents) {
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
