var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "react", 'Contracts', 'GameLoader'], function (require, exports, React, Contracts, GameLoader) {
    "use strict";
    var BoardCell = (function (_super) {
        __extends(BoardCell, _super);
        function BoardCell(props) {
            _super.call(this, props);
            this.state = props;
        }
        BoardCell.prototype.render = function () {
            var _this = this;
            var className = this.props.Current.trim().length == 0 ? "td" : "td filled";
            var confirmed = (this.props.Waiting.length == 0 && this.props.Confirmed.length != 0);
            var draggable = this.props.Waiting.length != 0;
            if (confirmed) {
                className += " confirmed";
            }
            if (draggable) {
                className += " draggable";
            }
            var block = React.createElement('td', {
                id: this.props.Id,
                ref: this.props.Id,
                className: className,
                title: this.props.Current,
                index: this.props.Index,
                draggable: draggable,
                onDragStart: function (evt) { _this.OnDragStart(evt); },
                onDragOver: this.OnDragOver,
                onDrop: function (evt) { _this.OnDrop(evt); }
            }, [], this.props.Current);
            return block;
        };
        BoardCell.prototype.OnDragOver = function (ev) {
            ev.preventDefault();
        };
        BoardCell.prototype.OnDrop = function (ev) {
            ev.preventDefault();
            var text = ev.dataTransfer.getData("text");
            var data = JSON.parse(text);
            GameLoader.GameLoader.store.dispatch({
                type: Contracts.Actions.ToBoard,
                args: {
                    CellIndex: this.props.Index,
                    TileIndex: data.tileIndex,
                    TrayIndex: data.trayIndex,
                    Src: data.text
                }
            });
        };
        BoardCell.prototype.OnDragStart = function (ev) {
            if (console) {
                console.log("Attempting to Move a Tile back to Tray");
            }
            var elem = ev.target;
            var data = {
                tileIndex: this.props.Index
            };
            ev.dataTransfer.setData("text", JSON.stringify(data));
        };
        return BoardCell;
    }(React.Component));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = BoardCell;
});
