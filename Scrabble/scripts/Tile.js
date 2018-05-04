var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "react"], function (require, exports, React) {
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
            if (this.props.Remaining > 1) {
                childs.push(this.renderCount());
            }
            childs.push(this.renderContent());
            if (this.props.Remaining > 1) {
                childs.push(this.renderEmpty());
            }
            var className = this.props.Remaining > 0 ? "tile" : "tile readonly";
            var draggable = this.props.Remaining > 0;
            if (this.props.ReadOnly) {
                draggable = false;
            }
            if (draggable) {
                className += " draggable";
            }
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
        Tile.prototype.renderCount = function () {
            var countId = "count_" + this.props.Id;
            var count = React.createElement('span', {
                id: countId,
                ref: countId,
                key: countId,
                className: "count",
                title: this.props.Remaining
            }, [], this.props.Remaining);
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
