var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "react", 'Contracts', 'GameStore'], function (require, exports, React, Contracts, GS) {
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
            var elem = React.createElement('div', {
                id: id,
                key: id,
                ref: id,
                className: "actionBar",
                title: "Action Bar",
            }, [suggest]);
            return elem;
        };
        ActionBar.prototype.renderSuggest = function () {
            var id = "help";
            var help = React.createElement('button', {
                id: id,
                key: id,
                ref: id,
                className: "suggest",
                title: "Suggest",
                disabled: this.props.ReadOnly,
                onClick: this.OnAskSuggestion,
            }, [], "Suggest");
            return help;
        };
        ActionBar.prototype.OnAskSuggestion = function (ev) {
            GS.GameStore.Dispatch({
                type: Contracts.Actions.RequestSuggestion,
                args: {}
            });
        };
        return ActionBar;
    }(React.Component));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ActionBar;
});
