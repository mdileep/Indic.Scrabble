var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "react", 'GameEvents'], function (require, exports, React, GameEvents) {
    "use strict";
    var GrpoupSelection = (function (_super) {
        __extends(GrpoupSelection, _super);
        function GrpoupSelection(props) {
            _super.call(this, props);
            this.state = props;
        }
        GrpoupSelection.prototype.render = function () {
            var _this = this;
            var TilesProp = this.props;
            var childs = [];
            var chkId = "chk_" + TilesProp.id;
            var chkBox = React.createElement('input', {
                type: "checkbox",
                name: "TileGroup",
                id: chkId,
                key: chkId,
                ref: chkId,
                defaultChecked: TilesProp.show,
                disabled: TilesProp.disabled,
                onChange: function (evt) { _this.ToggleGroup(evt); }
            });
            var label = React.createElement('label', {
                htmlFor: "chk_" + TilesProp.id,
                key: "lbl_" + TilesProp.id
            }, TilesProp.title);
            childs.push(chkBox);
            childs.push(label);
            var blocks = React.createElement('span', null, childs);
            return blocks;
        };
        GrpoupSelection.prototype.ToggleGroup = function (evt) {
            GameEvents.GameEvents.store.dispatch({
                type: 'TOGGLE_GRP', args: { groupIndex: this.props.index }
            });
        };
        return GrpoupSelection;
    }(React.Component));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GrpoupSelection;
});
