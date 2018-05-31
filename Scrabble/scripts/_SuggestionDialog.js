var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "react", 'Messages', '_OverlayDialog'], function (require, exports, React, Messages, OverlayDialog) {
    "use strict";
    var _SuggestionDialog = (function (_super) {
        __extends(_SuggestionDialog, _super);
        function _SuggestionDialog(props) {
            _super.call(this, props);
            this.state = props;
        }
        _SuggestionDialog.prototype.render = function () {
            var childs = [];
            if (!this.props.Loaded) {
                var content = React.createElement('div', {
                    key: "suggest_" + this.props.Id,
                    className: "oFContent"
                }, Messages.Messages.Suggest);
                childs.push(content);
            }
            else {
                var items = [];
                for (var i = 0; i < this.props.Moves.length; i++) {
                    var move = this.props.Moves[i];
                    {
                        var li = React.createElement("li", { key: "li" + i }, "Direction: " + move.Direction);
                        items.push(li);
                    }
                    for (var indx in move.Moves) {
                        {
                            var li = React.createElement("li", { key: "li" + i + indx }, move.Moves[indx].Tiles + "  at " + move.Moves[indx].Index);
                            items.push(li);
                        }
                    }
                }
                if (this.props.Moves.length == 0) {
                    var li = React.createElement("li", { key: "li" + i }, "No Suggestions Available ");
                    items.push(li);
                }
                var id = "ul";
                var ul = React.createElement("ul", {
                    id: id,
                    key: id,
                    ref: id,
                    className: "ul",
                    title: ""
                }, items);
                childs.push(ul);
            }
            var content = React.createElement('div', {
                key: "suggest_" + this.props.Id,
                className: "oFContent"
            }, childs);
            return this.renderDialog(content);
        };
        return _SuggestionDialog;
    }(OverlayDialog.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = _SuggestionDialog;
});
