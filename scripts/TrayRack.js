var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "react", 'Contracts', 'GameLoader'], function (require, exports, React, Contracts, GameLoader) {
    "use strict";
    var TrayRack = (function (_super) {
        __extends(TrayRack, _super);
        function TrayRack(props) {
            _super.call(this, props);
            this.state = props;
        }
        TrayRack.prototype.render = function () {
            var _this = this;
            var TilesProp = this.props;
            var childs = [];
            var chkId = "chk_" + TilesProp.Id;
            var chkBox = React.createElement('input', {
                type: "checkbox",
                name: "TileGroup",
                id: chkId,
                key: chkId,
                ref: chkId,
                defaultChecked: TilesProp.Show,
                disabled: TilesProp.Disabled,
                onChange: function (evt) { _this.OpenClose(evt); }
            });
            var label = React.createElement('label', {
                htmlFor: "chk_" + TilesProp.Id,
                key: "lbl_" + TilesProp.Id
            }, TilesProp.Title);
            childs.push(chkBox);
            childs.push(label);
            var blocks = React.createElement('span', null, childs);
            return blocks;
        };
        TrayRack.prototype.OpenClose = function (evt) {
            GameLoader.GameLoader.store.dispatch({
                type: Contracts.Actions.OpenOrClose,
                args: { TrayIndex: this.props.Index }
            });
        };
        return TrayRack;
    }(React.Component));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = TrayRack;
});
