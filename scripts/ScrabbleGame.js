var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "react", 'InputArea', 'BoardArea'], function (require, exports, React, InputArea, BoardArea) {
    "use strict";
    var ScrabbleGame = (function (_super) {
        __extends(ScrabbleGame, _super);
        function ScrabbleGame(props) {
            _super.call(this, props);
            this.state = props;
        }
        ScrabbleGame.prototype.render = function () {
            var left = React.createElement(InputArea.default, this.props.Left);
            var center = React.createElement(BoardArea.default, this.props.Center);
            var right = React.createElement("span", {
                className: "trash span",
                key: "right"
            });
            var block = React.createElement('div', {
                id: this.props.id,
                ref: this.props.id,
                className: "game",
                title: "Scrabble",
            }, [left, center, right]);
            return block;
        };
        return ScrabbleGame;
    }(React.Component));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ScrabbleGame;
});
