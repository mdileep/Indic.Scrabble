var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "react", "react-dom", 'Contracts', 'GameUser', 'GameLoader'], function (require, exports, React, ReactDOM, Contracts, GameUser, GameLoader) {
    "use strict";
    var ScoreBoard = (function (_super) {
        __extends(ScoreBoard, _super);
        function ScoreBoard(props) {
            _super.call(this, props);
            this.state = props;
        }
        ScoreBoard.prototype.componentDidUpdate = function () {
            ReactDOM.findDOMNode(this.refs["ul"]).scrollTop = 10000;
        };
        ScoreBoard.prototype.render = function () {
            var childs = [];
            var pass = React.createElement('button', {
                id: "pass",
                key: "pass",
                ref: "pass",
                className: "pass",
                title: "Pass",
                onClick: this.OnPass
            }, [], "Pass");
            childs.push(pass);
            var users = [];
            for (var i = 0; i < this.props.Users.length; i++) {
                var user = React.createElement(GameUser.default, this.props.Users[i], {});
                users.push(user);
            }
            childs.push(users);
            if (this.props.Messages.length > 0) {
                var h2 = React.createElement("h2", { key: "h2", className: "h2" }, "Information");
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
            }
            var blocks = React.createElement('div', {
                id: "scoreBoard",
                key: "scoreBoard",
                ref: "scoreBoard",
                className: "scoreBoard",
                title: "Information",
            }, childs);
            return blocks;
        };
        ScoreBoard.prototype.OnPass = function (ev) {
            GameLoader.GameLoader.store.dispatch({
                type: Contracts.Actions.Pass,
                args: {}
            });
        };
        return ScoreBoard;
    }(React.Component));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ScoreBoard;
});
