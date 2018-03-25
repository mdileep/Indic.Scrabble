var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "react", 'Contracts', 'GameLoader', 'Tray', 'Util'], function (require, exports, React, Contracts, GameLoader, Tray, Util) {
    "use strict";
    var GameTable = (function (_super) {
        __extends(GameTable, _super);
        function GameTable(props) {
            _super.call(this, props);
            this.state = props;
        }
        GameTable.prototype.render = function () {
            var _this = this;
            var childs = [];
            var message = this.renderMessage();
            var reDraw = this.renderReDraw();
            var pass = this.renderPass();
            var id = "actions";
            var actions = React.createElement('div', {
                id: id,
                key: id,
                ref: id,
                className: "actions",
                title: "Actions",
            }, [message, reDraw, pass]);
            childs.push(actions);
            var vowelTray = React.createElement(Tray.default, Util.Util.Merge(this.props.VowelTray, { ShowLabel: false, ReadOnly: this.props.ReadOnly }));
            childs.push(vowelTray);
            var consoTray = React.createElement(Tray.default, Util.Util.Merge(this.props.ConsoTray, { ShowLabel: false, ReadOnly: this.props.ReadOnly }));
            childs.push(consoTray);
            var id = "GameTable";
            var elem = React.createElement('div', {
                id: id,
                key: id,
                ref: id,
                className: "gameTable",
                title: "GameTable",
                onDragOver: this.OnDragOver,
                onDrop: function (evt) { _this.OnDrop(evt); },
            }, childs);
            return elem;
        };
        GameTable.prototype.renderMessage = function () {
            var id = "message";
            var pass = React.createElement('span', {
                id: id,
                key: id,
                ref: id,
                className: "message",
                title: this.props.Message
            }, [], this.props.Message);
            return pass;
        };
        GameTable.prototype.renderReDraw = function () {
            var id = "draw";
            var pass = React.createElement('button', {
                id: id,
                key: id,
                ref: id,
                className: "redraw",
                title: "Re-Draw",
                disabled: this.props.ReadOnly || !this.props.CanReDraw,
                onClick: this.OnReDraw,
            }, [], "Re-Draw");
            return pass;
        };
        GameTable.prototype.renderPass = function () {
            var id = "pass";
            var pass = React.createElement('button', {
                id: id,
                key: id,
                ref: id,
                className: "pass",
                title: "Pass",
                onClick: this.OnPass,
                disabled: this.props.ReadOnly,
            }, [], "Pass");
            return pass;
        };
        GameTable.prototype.OnPass = function (ev) {
            GameLoader.GameLoader.store.dispatch({
                type: Contracts.Actions.Pass,
                args: {}
            });
        };
        GameTable.prototype.OnReDraw = function (ev) {
            GameLoader.GameLoader.store.dispatch({
                type: Contracts.Actions.ReDraw,
                args: {}
            });
        };
        GameTable.prototype.OnDragOver = function (ev) {
            ev.preventDefault();
        };
        GameTable.prototype.OnDrop = function (ev) {
            ev.preventDefault();
            var text = ev.dataTransfer.getData("text");
            var data = JSON.parse(text);
            GameLoader.GameLoader.store.dispatch({
                type: Contracts.Actions.ToTray,
                args: { Origin: data.Origin, Src: data.Src, SrcCell: data.SrcCell }
            });
        };
        return GameTable;
    }(React.Component));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GameTable;
});
