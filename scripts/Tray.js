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
            var tiles = [];
            for (var i = 0; i < this.props.Tiles.length; i++) {
                var tileProp = this.props.Tiles[i];
                var id = this.props.Id + "_" + (i + 1);
                var tile = React.createElement(Tile.default, {
                    Id: id,
                    key: id,
                    className: "",
                    Text: tileProp.Text,
                    Remaining: tileProp.Remaining,
                    Total: tileProp.Total,
                    Index: tileProp.Index,
                    TrayIndex: tileProp.TrayIndex
                });
                tiles.push(tile);
            }
            var label = React.createElement("span", { key: "label", className: "label" }, this.props.Title);
            var className = this.props.className + " block" + (this.props.Show ? "" : " hide");
            var blocks = React.createElement('div', {
                id: this.props.Id,
                key: this.props.Id,
                ref: this.props.Id,
                className: className,
                title: this.props.Title
            }, [label, tiles]);
            return blocks;
        };
        return Tray;
    }(React.Component));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Tray;
});
