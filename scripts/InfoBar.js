var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "react", "react-dom", "Indic"], function (require, exports, React, ReactDOM, Indic) {
    "use strict";
    var MessageBar = (function (_super) {
        __extends(MessageBar, _super);
        function MessageBar(props) {
            _super.call(this, props);
            this.state = props;
        }
        MessageBar.prototype.componentDidUpdate = function () {
            if (this.refs["ul"] == null) {
                return;
            }
            ReactDOM.findDOMNode(this.refs["ul"]).scrollTop = 10000;
        };
        MessageBar.prototype.render = function () {
            var childs = [];
            if (this.props.Messages.length == 0) {
                var blocks = React.createElement('div', {});
                return blocks;
            }
            var h2 = React.createElement("h2", { key: "h2", className: "h2" }, Indic.Messages.Messages);
            childs.push(h2);
            var items = [];
            for (var i = 0; i < this.props.Messages.length; i++) {
                var msg = this.props.Messages[i];
                var li = React.createElement("li", { key: "li" + i }, msg);
                items.push(li);
            }
            var ul = React.createElement("ul", {
                id: "ul",
                key: "ul",
                ref: "ul",
                className: "ul",
                title: "List"
            }, items);
            childs.push(ul);
            var blocks = React.createElement('div', {
                id: "infoBar",
                key: "infoBar",
                ref: "infoBar",
                className: "infoBar",
                title: "Messages",
            }, childs);
            return blocks;
        };
        return MessageBar;
    }(React.Component));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = MessageBar;
});
