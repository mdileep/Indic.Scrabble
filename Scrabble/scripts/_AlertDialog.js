var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "react", '_OverlayDialog'], function (require, exports, React, OverlayDialog) {
    "use strict";
    var _AlertDialog = (function (_super) {
        __extends(_AlertDialog, _super);
        function _AlertDialog(props) {
            _super.call(this, props);
            this.state = props;
        }
        _AlertDialog.prototype.render = function () {
            var message = React.createElement('div', {
                key: "msg_" + this.props.Id,
                className: "oFContent"
            }, this.props.Message);
            return this.renderDialog(message);
        };
        return _AlertDialog;
    }(OverlayDialog.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = _AlertDialog;
});
