var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "react", '_OverlayDialog'], function (require, exports, React, OverlayDialog) {
    "use strict";
    var _ConfirmDialog = (function (_super) {
        __extends(_ConfirmDialog, _super);
        function _ConfirmDialog(props) {
            _super.call(this, props);
            this.state = props;
        }
        _ConfirmDialog.prototype.render = function () {
            var message = React.createElement('div', {
                key: "msg_" + this.props.Id,
                className: "oFContent"
            }, this.props.Message);
            return this.renderDialog(message);
        };
        return _ConfirmDialog;
    }(OverlayDialog.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = _ConfirmDialog;
});
