var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "react", 'Cabinet', 'Board', 'InfoBar', 'GamePlayers', 'RaiseHand', 'Indic'], function (require, exports, React, Cabinet, Board, InfoBar, GamePlayers, RaiseHand, Indic) {
    "use strict";
    var GameRoom = (function (_super) {
        __extends(GameRoom, _super);
        function GameRoom(props) {
            _super.call(this, props);
            this.state = props;
        }
        GameRoom.prototype.render = function () {
            var scores = React.createElement(GamePlayers.default, Indic.Util.Merge(this.props.Players, { key: "scores", showScores: true, showWordsList: false }));
            var words = React.createElement(GamePlayers.default, Indic.Util.Merge(this.props.Players, { key: "words", Id: "WordBoard", showScores: false, showWordsList: true }));
            var raiseHand = React.createElement(RaiseHand.default, { key: "raiseHand" });
            var cabinet = React.createElement(Cabinet.default, this.props.Cabinet);
            var board = React.createElement(Board.default, this.props.Board);
            var info = React.createElement(InfoBar.default, this.props.InfoBar);
            var block = React.createElement('div', {
                id: this.props.Id,
                ref: this.props.Id,
                className: "game",
                title: "Scrabble",
            }, [raiseHand, cabinet, board, scores, words, info]);
            return block;
        };
        return GameRoom;
    }(React.Component));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GameRoom;
});
