var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "react", '_ConfirmDialog', 'Util', 'Messages'], function (require, exports, React, _ConfirmDialog, Util, Messages) {
    "use strict";
    var ConfirmDialog = (function (_super) {
        __extends(ConfirmDialog, _super);
        function ConfirmDialog(props) {
            _super.call(this, props);
            this.state = props;
        }
        ConfirmDialog.prototype.render = function () {
            var id = "ConfrimDialog";
            return React.createElement(_ConfirmDialog.default, Util.Util.Merge(this.props, {
                Id: id,
                key: id,
                ref: id,
                className: id,
                Show: this.props.Show,
                ReadOnly: false,
                ConfirmText: Messages.Messages.Yes, ShowConfirm: true,
                CancelText: Messages.Messages.No, ShowClose: true,
                OnConfirm: this.props.OnConfirm,
                OnDismiss: this.props.OnDismiss,
            }));
        };
        return ConfirmDialog;
    }(React.Component));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ConfirmDialog;
});
