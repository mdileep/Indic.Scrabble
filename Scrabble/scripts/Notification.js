var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "react"], function (require, exports, React) {
    "use strict";
    var OverLayDialog = (function (_super) {
        __extends(OverLayDialog, _super);
        function OverLayDialog(props) {
            _super.call(this, props);
            this.state = props;
            this.OnOK = this.OnOK.bind(this);
            this.OnCancel = this.OnCancel.bind(this);
        }
        OverLayDialog.prototype.render = function () {
            return this.renderDialog(null);
        };
        OverLayDialog.prototype.renderDialog = function (content) {
            var childs = [];
            if (this.props.Show) {
                var bg = this.renderBackground();
                var fg = this.renderForeground(content);
                childs.push(bg);
                childs.push(fg);
            }
            var elem = React.createElement('div', {
                key: this.props.Id,
                className: "Notification"
            }, childs);
            return elem;
        };
        OverLayDialog.prototype.renderForeground = function (content) {
            var childs = [];
            var title = React.createElement('h1', {
                key: "title_" + this.props.Id,
                className: "oFTitle"
            }, this.props.Title);
            childs.push(title);
            if (message != null) {
                var message = React.createElement('div', {
                    key: "msg_" + this.props.Id,
                    className: "oFContent"
                }, this.props.Message);
                childs.push(message);
            }
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
        OverLayDialog.prototype.renderActions = function () {
            var childs = [];
            var ok = React.createElement('button', {
                key: "ok_" + this.props.Id,
                className: "oOK",
                onClick: this.OnOK
            }, [], this.props.ConfirmText);
            childs.push(ok);
            var cancel = React.createElement('button', {
                key: "cancel_" + this.props.Id,
                className: "oCancel",
                onClick: this.OnCancel
            }, [], this.props.CancelText);
            childs.push(cancel);
            return React.createElement('div', {
                key: "actions_" + this.props.Id,
                className: "oFButtonHolder"
            }, childs);
        };
        OverLayDialog.prototype.renderBackground = function () {
            return React.createElement('div', {
                key: "bg_" + this.props.Id,
                className: "oBackGround"
            });
        };
        OverLayDialog.prototype.OnOK = function (ev) {
            if (this.props.OnConfirm == null) {
                this.state.Show = false;
                return;
            }
            this.props.OnConfirm();
        };
        OverLayDialog.prototype.OnCancel = function (ev) {
            if (this.props.OnCancel == null) {
                this.state.Show = false;
                return;
            }
            this.props.OnCancel();
        };
        return OverLayDialog;
    }(React.Component));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = OverLayDialog;
});
