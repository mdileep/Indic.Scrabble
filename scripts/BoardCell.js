var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "react", 'GameEvents'], function (require, exports, React, GameEvents) {
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
