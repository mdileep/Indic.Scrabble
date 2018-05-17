var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "react", 'Contracts', 'Tray', 'TrayRack', 'Util', 'GameStore', 'Messages'], function (require, exports, React, Contracts, Tray, TrayRack, Util, GS, M) {
    "use strict";
    var Cabinet = (function (_super) {
        __extends(Cabinet, _super);
        function Cabinet(props) {
            _super.call(this, props);
            this.state = props;
        }
        Cabinet.prototype.render = function () {
            var _this = this;
            var childs = [];
            var groupContainer = this.renderContainer();
            childs.push(groupContainer);
            for (var i = 0; i < this.props.Trays.length; i++) {
                var TilesProp = this.props.Trays[i];
                TilesProp.key = TilesProp.Id;
                var tray = React.createElement(Tray.default, Util.Util.Merge(TilesProp, { ShowLabel: true }));
                childs.push(tray);
            }
            var id = "cabinet";
            var className = "cabinet";
            if (!this.props.Show) {
                className += " hide";
            }
            var elem = React.createElement('div', {
                id: id,
                key: id,
                ref: id,
                className: className,
                title: M.Messages.Cabinet,
                onDragOver: this.OnDragOver,
                onDrop: function (evt) { _this.OnDrop(evt); },
            }, childs);
            return elem;
        };
        Cabinet.prototype.renderContainer = function () {
            var childs = [];
            for (var i = 0; i < this.props.Trays.length; i++) {
                var TilesProp = this.props.Trays[i];
                TilesProp.key = "G" + TilesProp.Id;
                var trayRack = React.createElement(TrayRack.default, TilesProp);
                childs.push(trayRack);
            }
            var remaining = React.createElement("span", { key: "remaining", className: "remaining" }, this.props.Remaining);
            childs.push(remaining);
            var id = "trayLabels";
            var groupContainer = React.createElement('div', {
                id: id,
                key: id,
                ref: id,
                className: "trayLabels",
                title: M.Messages.TrayLabels
            }, childs);
            return groupContainer;
        };
        Cabinet.prototype.OnDragOver = function (ev) {
            ev.preventDefault();
        };
        Cabinet.prototype.OnDrop = function (ev) {
            ev.preventDefault();
            var text = ev.dataTransfer.getData("text");
            var data = JSON.parse(text);
            GS.GameStore.Dispatch({
                type: Contracts.Actions.ToTray,
                args: { Origin: data.Origin, Src: data.Src, SrcCell: data.SrcCell }
            });
        };
        return Cabinet;
    }(React.Component));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Cabinet;
});
