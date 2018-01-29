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
