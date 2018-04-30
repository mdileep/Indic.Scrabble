var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "react", 'Contracts', '_AlertDialog', 'Util', 'GameLoader'], function (require, exports, React, Contracts, _AlertDialog, Util, GameLoader) {
    "use strict";
    var AlertDialog = (function (_super) {
        __extends(AlertDialog, _super);
        function AlertDialog(props) {
            _super.call(this, props);
            this.state = props;
        }
        AlertDialog.prototype.render = function () {
            var id = "AlertDialog";
            return React.createElement(_AlertDialog.default, Util.Util.Merge(this.props, {
                Id: id,
                key: id,
                ref: id,
                className: id,
                Show: this.props.Show,
                ReadOnly: false,
                ShowClose: false,
                ConfirmText: "OK", ShowConfirm: true,
                OnConfirm: this.props.OnConfirm,
            }));
        };
        AlertDialog.OnConfirm = function () {
            GameLoader.GameLoader.store.dispatch({
                type: Contracts.Actions.AlertDismiss,
                args: {}
            });
        };
        return AlertDialog;
    }(React.Component));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = AlertDialog;
});
