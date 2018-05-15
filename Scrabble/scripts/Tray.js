var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "react", 'Tile'], function (require, exports, React, Tile) {
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
