var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "react"], function (require, exports, React) {
    "use strict";
    var ScoreBoard = (function (_super) {
        __extends(ScoreBoard, _super);
        function ScoreBoard(props) {
            _super.call(this, props);
            this.state = props;
        }
        ScoreBoard.prototype.render = function () {
            var available = React.createElement("span", { key: "available", className: "span" }, this.props.Available);
            var blocks = React.createElement('div', {
                id: "scoreBoard",
                key: "scoreBoard",
                ref: "scoreBoard",
                className: "scoreBoard",
                title: "Information",
            }, [available, available]);
            return blocks;
        };
        return ScoreBoard;
    }(React.Component));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ScoreBoard;
});
