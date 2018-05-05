var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "react", 'Contracts', 'ConfirmDialog', 'Util', 'Messages', 'GameStore'], function (require, exports, React, Contracts, Confirm, Util, Messages, GS) {
    "use strict";
    var ConsentForm = (function (_super) {
        __extends(ConsentForm, _super);
        function ConsentForm(props) {
            _super.call(this, props);
            this.state = props;
        }
        ConsentForm.prototype.render = function () {
            var childs = [];
            if (this.props.Pending.length > 0) {
                var word = this.props.Pending[this.props.Pending.length - 1].Readble;
                var dialog = React.createElement(Confirm.default, Util.Util.Merge({}, {
                    Show: true,
                    key: "_" + this.props.Id,
                    OnConfirm: ConsentForm.Resolve,
                    OnDismiss: ConsentForm.Reject,
                    Title: Messages.Messages.Referee,
                    Message: Util.Util.Format(Messages.Messages.ResolveWord, [word])
                }));
                childs.push(dialog);
            }
            var elem = React.createElement('div', {
                key: this.props.Id,
            }, childs);
            return elem;
        };
        ConsentForm.Resolve = function () {
            GS.GameStore.Dispatch({
                type: Contracts.Actions.WordResolved,
                args: {}
            });
        };
        ConsentForm.Reject = function () {
            GS.GameStore.Dispatch({
                type: Contracts.Actions.WordRejected,
                args: {}
            });
        };
        return ConsentForm;
    }(React.Component));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ConsentForm;
});
