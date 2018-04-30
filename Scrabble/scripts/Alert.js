var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "react", 'OverlayDialog', 'Util'], function (require, exports, React, OverlayDialog, Util) {
    "use strict";
    var AlertDialog = (function (_super) {
        __extends(AlertDialog, _super);
        function AlertDialog(props) {
            props = Util.Util.Merge(props, {
                ShowClose: false,
                ConfirmText: "OK", ShowConfirm: true,
                OnConfirm: AlertDialog.OnDismiss
            });
            _super.call(this, props);
            this.props = props;
            this.state = props;
        }
        AlertDialog.prototype.render = function () {
            var message = React.createElement('div', {
                key: "msg_" + this.props.Id,
                className: "oFContent"
            }, this.props.Message);
            return this.renderDialog(message);
        };
        AlertDialog.OnDismiss = function () {
            debugger;
        };
        return AlertDialog;
    }(OverlayDialog.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = AlertDialog;
});
