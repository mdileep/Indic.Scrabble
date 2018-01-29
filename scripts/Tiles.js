var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "react", 'Tile'], function (require, exports, React, Tile) {
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
