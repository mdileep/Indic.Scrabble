var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "react"], function (require, exports, React) {
    "use strict";
    var GameUser = (function (_super) {
        __extends(GameUser, _super);
        function GameUser(props) {
            _super.call(this, props);
            this.state = props;
        }
        GameUser.prototype.render = function () {
            var className = this.props.Playing ? "player" : "opponent";
            var name = this.props.Playing ? "→ " + this.props.Name + " ←" : this.props.Name;
            var id = "U" + this.props.Id;
            var elem = React.createElement('span', {
                id: id,
                ref: id,
                key: id,
                className: className,
                title: this.props.Name,
            }, name);
            var items = [];
            var e2 = React.createElement("span", { key: "2", className: "score" }, this.props.Score);
            items.push(e2);
            var div = React.createElement('div', {
                id: this.props.Id,
                ref: this.props.Id,
                key: this.props.Id,
                className: "user",
                title: this.props.Name,
            }, [elem, e2]);
            return div;
        };
        return GameUser;
    }(React.Component));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GameUser;
});
