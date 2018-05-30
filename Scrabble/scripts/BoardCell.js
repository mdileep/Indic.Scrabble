var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "react", 'Contracts', 'GameStore'], function (require, exports, React, Contracts, GS) {
    "use strict";
    var BoardCell = (function (_super) {
        __extends(BoardCell, _super);
        function BoardCell(props) {
            _super.call(this, props);
            this.state = props;
        }
        BoardCell.prototype.render = function () {
            var _this = this;
            var childs = [];
            var textId = "text_" + this.props.Id;
            var text = this.props.Current.length == 0 ? " " : this.props.Current;
            var textElem = React.createElement('span', {
                id: textId,
                ref: textId,
                key: textId,
                className: "text",
                title: text
            }, [], text);
            childs.push(this.renderWeight());
            childs.push(textElem);
            var cellId = "cell_" + this.props.Id;
            var container = React.createElement('div', {
                id: cellId,
                ref: cellId,
                key: cellId,
                className: "square",
                title: text
            }, childs);
            var className = this.getClass();
            var elem = React.createElement('td', {
                id: this.props.Id,
                ref: this.props.Id,
                className: className,
                title: this.props.Current,
                index: text,
                draggable: this.isDragable(),
                onDragStart: function (evt) { _this.OnDragStart(evt); },
                onDragOver: this.OnDragOver,
                onDrop: function (evt) { _this.OnDrop(evt); }
            }, container);
            return elem;
        };
        BoardCell.prototype.isDragable = function () {
            return this.props.Waiting.length != 0 && !this.props.ReadOnly;
        };
        BoardCell.prototype.getClass = function () {
            var classList = [];
            classList.push("cell");
            if (this.props.Waiting.length + this.props.Confirmed.length != 0) {
                classList.push("filled");
            }
            var covered = (this.props.Waiting.length + this.props.Confirmed.length != 0);
            var confirmed = (this.props.Waiting.length == 0 && this.props.Confirmed.length != 0);
            var draggable = this.isDragable();
            if (confirmed) {
                classList.push("confirmed");
            }
            if (draggable) {
                classList.push("draggable");
            }
            if (this.props.Star && !covered) {
                classList.push("star");
            }
            if (confirmed || this.props.Waiting.length != 0) {
                return classList.join(' ');
            }
            classList.push("w" + this.props.Weight);
            return classList.join(' ');
        };
        BoardCell.prototype.renderWeight = function () {
            var weightId = "weight_" + this.props.Id;
            var className = "weight";
            var text = this.props.Weight == 1 ? " " : this.props.Weight;
            var weight = React.createElement('span', {
                id: weightId,
                ref: weightId,
                key: weightId,
                className: className,
                title: this.props.Weight
            }, [], text);
            return weight;
        };
        BoardCell.prototype.OnDragOver = function (ev) {
            ev.preventDefault();
        };
        BoardCell.prototype.OnDrop = function (ev) {
            ev.preventDefault();
            var text = ev.dataTransfer.getData("text");
            var data = JSON.parse(text);
            GS.GameStore.Dispatch({
                type: Contracts.Actions.ToBoard,
                args: {
                    TargetCell: this.props.Index,
                    Src: data.Src,
                    SrcCell: data.SrcCell,
                    Origin: data.Origin
                }
            });
        };
        BoardCell.prototype.OnDragStart = function (ev) {
            var last = this.props.Waiting[this.props.Waiting.length - 1];
            var elem = ev.target;
            var data = {
                Src: last,
                Origin: "Cell",
                SrcCell: this.props.Index
            };
            ev.dataTransfer.setData("text", JSON.stringify(data));
        };
        return BoardCell;
    }(React.Component));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = BoardCell;
});
