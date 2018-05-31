var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "react", 'Contracts', '_SuggestionDialog', 'Util', 'Messages', 'GameStore'], function (require, exports, React, Contracts, _SuggestionDialog, Util, Messages, GS) {
    "use strict";
    var SuggestionForm = (function (_super) {
        __extends(SuggestionForm, _super);
        function SuggestionForm(props) {
            _super.call(this, props);
            this.state = props;
        }
        SuggestionForm.prototype.render = function () {
            var id = "SuggestDialog";
            return React.createElement(_SuggestionDialog.default, Util.Util.Merge(this.props, {
                Id: id,
                key: id,
                ref: id,
                className: id,
                ReadOnly: false,
                ShowClose: false,
                ConfirmText: Messages.Messages.OK, ShowConfirm: true,
                Title: Messages.Messages.Suggest,
                OnConfirm: SuggestionForm.Dismiss,
            }));
        };
        SuggestionForm.Dismiss = function () {
            GS.GameStore.Dispatch({
                type: Contracts.Actions.DismissSuggestion,
                args: {}
            });
        };
        return SuggestionForm;
    }(React.Component));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = SuggestionForm;
});
