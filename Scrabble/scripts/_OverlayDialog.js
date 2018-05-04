var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "react"], function (require, exports, React) {
    "use strict";
    var _OverlayDialog = (function (_super) {
        __extends(_OverlayDialog, _super);
        function _OverlayDialog(props) {
            _super.call(this, props);
            this.state = props;
            this.OnConfirm = this.OnConfirm.bind(this);
            this.OnDismiss = this.OnDismiss.bind(this);
        }
        _OverlayDialog.prototype.render = function () {
            return this.renderDialog(null);
        };
        _OverlayDialog.prototype.renderDialog = function (content) {
            var childs = [];
            if (this.props.Show) {
                var bg = this.renderBackground();
                var fg = this.renderForeground(content);
                childs.push(bg);
                childs.push(fg);
            }
            var elem = React.createElement('div', {
                key: this.props.Id,
                className: "olDialog"
            }, childs);
            return elem;
        };
        _OverlayDialog.prototype.renderForeground = function (content) {
            var childs = [];
            var title = React.createElement('h2', {
                key: "title_" + this.props.Id,
                className: "h2 oFTitle"
            }, this.props.Title);
            childs.push(title);
            if (content != null) {
                childs.push(content);
            }
            var buttons = this.renderActions();
            childs.push(buttons);
            return React.createElement('div', {
                key: "fg_" + this.props.Id,
                className: "oForeGround"
            }, childs);
        };
        _OverlayDialog.prototype.renderActions = function () {
            var childs = [];
            if (this.props.ShowConfirm) {
                var ok = React.createElement('button', {
                    key: "ok_" + this.props.Id,
                    className: "oOK",
                    onClick: this.OnConfirm
                }, [], this.props.ConfirmText);
                childs.push(ok);
            }
            if (this.props.ShowClose) {
                var cancel = React.createElement('button', {
                    key: "cancel_" + this.props.Id,
                    className: "oCancel",
                    onClick: this.OnDismiss
                }, [], this.props.CancelText);
                childs.push(cancel);
            }
            return React.createElement('div', {
                key: "actions_" + this.props.Id,
                className: "oFButtonHolder"
            }, childs);
        };
        _OverlayDialog.prototype.renderBackground = function () {
            return React.createElement('div', {
                key: "bg_" + this.props.Id,
                className: "oBackGround"
            });
        };
        _OverlayDialog.prototype.OnConfirm = function (ev) {
            if (this.props.OnConfirm == null) {
                return;
            }
            this.props.OnConfirm();
        };
        _OverlayDialog.prototype.OnDismiss = function (ev) {
            if (this.props.OnDismiss == null) {
                return;
            }
            this.props.OnDismiss();
        };
        return _OverlayDialog;
    }(React.Component));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = _OverlayDialog;
});
