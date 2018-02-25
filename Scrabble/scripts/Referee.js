var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "react", 'Contracts', 'GameLoader', 'Tray', 'Util'], function (require, exports, React, Contracts, GameLoader, Tray, Util) {
    "use strict";
    var Referee = (function (_super) {
        __extends(Referee, _super);
        function Referee(props) {
            _super.call(this, props);
            this.state = props;
        }
        Referee.prototype.render = function () {
            var _this = this;
            var childs = [];
            var tray = React.createElement(Tray.default, Util.Util.Merge(this.props.Tray, { ShowLabel: false }));
            childs.push(tray);
            var id = "pass";
            var pass = React.createElement('button', {
                id: id,
                key: id,
                ref: id,
                className: "pass",
                title: "Pass",
                onClick: this.OnPass,
            }, [], "Pass");
            childs.push(pass);
            var elem = React.createElement('div', {
                id: "referee",
                key: "referee",
                ref: "referee",
                className: "referee",
                title: "Referee",
                onDragOver: this.OnDragOver,
                onDrop: function (evt) { _this.OnDrop(evt); },
            }, childs);
            return elem;
        };
        Referee.prototype.OnPass = function (ev) {
            GameLoader.GameLoader.store.dispatch({
                type: Contracts.Actions.Pass,
                args: {}
            });
        };
        Referee.prototype.OnDragOver = function (ev) {
            ev.preventDefault();
        };
        Referee.prototype.OnDrop = function (ev) {
            ev.preventDefault();
            var text = ev.dataTransfer.getData("text");
            var data = JSON.parse(text);
            GameLoader.GameLoader.store.dispatch({
                type: Contracts.Actions.ToTray,
                args: { Origin: data.Origin, Src: data.Src, SrcCell: data.SrcCell }
            });
        };
        return Referee;
    }(React.Component));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Referee;
});
