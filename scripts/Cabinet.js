var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "react", 'Contracts', 'Tray', 'TrayRack', 'GameLoader'], function (require, exports, React, Contracts, Tray, TrayRack, GameLoader) {
    "use strict";
    var Cabinet = (function (_super) {
        __extends(Cabinet, _super);
        function Cabinet(props) {
            _super.call(this, props);
            this.state = props;
        }
        Cabinet.prototype.render = function () {
            var _this = this;
            if (console) {
                console.log("Rendering Cabinet");
            }
            var childs = [];
            for (var i = 0; i < this.props.Trays.length; i++) {
                var TilesProp = this.props.Trays[i];
                TilesProp.key = "G" + TilesProp.Id;
                var Group = React.createElement(TrayRack.default, TilesProp);
                childs.push(Group);
            }
            var remaining = React.createElement("span", { key: "remaining", className: "remaining" }, this.props.Remaining);
            childs.push(remaining);
            for (var i = 0; i < this.props.Trays.length; i++) {
                var TilesProp = this.props.Trays[i];
                TilesProp.key = TilesProp.Id;
                var Group = React.createElement(Tray.default, TilesProp);
                childs.push(Group);
            }
            var blocks = React.createElement('div', {
                id: "inputs",
                key: "inputs",
                ref: "inputs",
                className: "area",
                title: "Input Area",
                onDragOver: this.OnDragOver,
                onDrop: function (evt) { _this.OnDrop(evt); },
            }, childs);
            return blocks;
        };
        Cabinet.prototype.OnDragOver = function (ev) {
            ev.preventDefault();
        };
        Cabinet.prototype.OnDrop = function (ev) {
            ev.preventDefault();
            var text = ev.dataTransfer.getData("text");
            var data = JSON.parse(text);
            GameLoader.GameLoader.store.dispatch({
                type: Contracts.Actions.ToTray,
                args: { Index: data.tileIndex }
            });
        };
        return Cabinet;
    }(React.Component));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Cabinet;
});
