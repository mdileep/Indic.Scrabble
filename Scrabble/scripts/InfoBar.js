var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "react", "react-dom", "Messages"], function (require, exports, React, ReactDOM, Messages) {
    "use strict";
    var InfoBar = (function (_super) {
        __extends(InfoBar, _super);
        function InfoBar(props) {
            _super.call(this, props);
            this.state = props;
        }
        InfoBar.prototype.componentDidUpdate = function () {
            if (this.refs["ul"] == null) {
                return;
            }
            ReactDOM.findDOMNode(this.refs["ul"]).scrollTop = 10000;
        };
        InfoBar.prototype.render = function () {
            var childs = [];
            if (this.props.Messages.length == 0) {
                var elem = React.createElement('div', {});
                return elem;
            }
            var h2 = React.createElement("span", { key: "h2", className: "h2" }, Messages.Messages.Messages);
            childs.push(h2);
            var items = [];
            for (var i = 0; i < this.props.Messages.length; i++) {
                var msg = this.props.Messages[i];
                var li = React.createElement("li", { key: "li" + i }, msg);
                items.push(li);
            }
            var id = "ul";
            var ul = React.createElement("ul", {
                id: id,
                key: id,
                ref: id,
                className: "ul",
                title: "List"
            }, items);
            childs.push(ul);
            var elem = React.createElement('div', {
                id: "infoBar",
                key: "infoBar",
                ref: "infoBar",
                className: "infoBar",
                title: "Messages",
            }, childs);
            return elem;
        };
        return InfoBar;
    }(React.Component));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = InfoBar;
});
