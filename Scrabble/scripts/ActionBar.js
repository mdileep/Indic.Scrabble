var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "react", 'Contracts', 'GameStore', 'Messages'], function (require, exports, React, Contracts, GS, M) {
    "use strict";
    var ActionBar = (function (_super) {
        __extends(ActionBar, _super);
        function ActionBar(props) {
            _super.call(this, props);
            this.state = props;
        }
        ActionBar.prototype.render = function () {
            var childs = [];
            var id = "actionBar";
            var suggest = this.renderSuggest();
            var help = this.renderHelp();
            var elem = React.createElement('div', {
                id: id,
                key: id,
                ref: id,
                className: "actionBar",
                title: M.Messages.ActionBar,
            }, [suggest, help]);
            return elem;
        };
        ActionBar.prototype.renderHelp = function () {
            var id = "help";
            var help = React.createElement('button', {
                id: id,
                key: id,
                ref: id,
                className: "help",
                title: M.Messages.Help,
                disabled: false,
                onClick: this.OnHelp,
            }, [], M.Messages.Help);
            return help;
        };
        ActionBar.prototype.renderSuggest = function () {
            var id = "suggest";
            var help = React.createElement('button', {
                id: id,
                key: id,
                ref: id,
                className: "suggest",
                title: M.Messages.Suggest,
                disabled: this.props.ReadOnly,
                onClick: this.OnAskSuggestion,
            }, [], M.Messages.Suggest);
            return help;
        };
        ActionBar.prototype.OnAskSuggestion = function (ev) {
            GS.GameStore.Dispatch({
                type: Contracts.Actions.RequestSuggestion,
                args: {}
            });
        };
        ActionBar.prototype.OnHelp = function (ev) {
            GS.GameStore.Dispatch({
                type: Contracts.Actions.AskHelp,
                args: {}
            });
        };
        return ActionBar;
    }(React.Component));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ActionBar;
});
