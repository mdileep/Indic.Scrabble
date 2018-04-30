var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "react", 'Cabinet', 'Board', 'InfoBar', 'GamePlayers', 'GameTable', 'AlertDialog', 'Util'], function (require, exports, React, Cabinet, Board, InfoBar, GamePlayers, GameTable, Alert, Util) {
    "use strict";
    var GameRoom = (function (_super) {
        __extends(GameRoom, _super);
        function GameRoom(props) {
            _super.call(this, props);
            this.state = props;
        }
        GameRoom.prototype.render = function () {
            var scores = React.createElement(GamePlayers.default, Util.Util.Merge(this.props.Players, { key: "scores", showScores: true, showWordsList: false }));
            var words = React.createElement(GamePlayers.default, Util.Util.Merge(this.props.Players, { key: "words", Id: "WordBoard", showScores: false, showWordsList: true }));
            var gameTable = React.createElement(GameTable.default, this.props.GameTable);
            var cabinet = React.createElement(Cabinet.default, this.props.Cabinet);
            var board = React.createElement(Board.default, this.props.Board);
            var info = React.createElement(InfoBar.default, this.props.InfoBar);
            var alert = React.createElement(Alert.default, Util.Util.Merge(this.props.Alert, { OnConfirm: Alert.default.OnConfirm }));
            var block = React.createElement('div', {
                id: this.props.Id,
                key: this.props.Id,
                ref: this.props.Id,
                className: "game",
                title: "Scrabble",
            }, [scores, gameTable, board, words, cabinet, info, alert]);
            return block;
        };
        return GameRoom;
    }(React.Component));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GameRoom;
});
