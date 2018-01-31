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
                var id = this.props.id + "_" + (i + 1);
                var tile = React.createElement(Tile.default, {
                    Id: id,
                    key: id,
                    Text: tileProp.Text,
                    Remaining: tileProp.Remaining,
                    Total: tileProp.Total,
                    Index: tileProp.Index,
                    TrayIndex: tileProp.TrayIndex
                });
                tiles.push(tile);
            }
            var className = this.props.className + " block" + (this.props.Show ? "" : " hide");
            var blocks = React.createElement('div', {
                id: this.props.id,
                key: this.props.id,
                ref: this.props.id,
                className: className,
                title: this.props.Title
            }, tiles);
            return blocks;
        };
        return Tray;
    }(React.Component));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Tray;
});
