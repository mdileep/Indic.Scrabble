var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "react", 'Cabinet', 'Board', 'InfoBar', 'GamePlayers', 'GameTable', 'AlertDialog', 'Util', 'GenericActions', 'ConsentForm'], function (require, exports, React, Cabinet, Board, InfoBar, GamePlayers, GameTable, Alert, Util, GA, ConsentForm) {
    "use strict";
    var GameRoom = (function (_super) {
        __extends(GameRoom, _super);
        function GameRoom(props) {
            _super.call(this, props);
            this.state = props;
        }
        GameRoom.prototype.render = function () {
            var childs = [];
            var scores = React.createElement(GamePlayers.default, Util.Util.Merge(this.props.Players, { key: "scores", showScores: true, showWordsList: false }));
            childs.push(scores);
            var gameTable = React.createElement(GameTable.default, this.props.GameTable);
            childs.push(gameTable);
            var board = React.createElement(Board.default, this.props.Board);
            childs.push(board);
            var words = React.createElement(GamePlayers.default, Util.Util.Merge(this.props.Players, { key: "words", Id: "WordBoard", showScores: false, showWordsList: true }));
            childs.push(words);
            var cabinet = React.createElement(Cabinet.default, this.props.Cabinet);
            childs.push(cabinet);
            var info = React.createElement(InfoBar.default, this.props.InfoBar);
            childs.push(info);
            var dialog = React.createElement(Alert.default, Util.Util.Merge(this.props.Dialog, {
                OnConfirm: GA.GenericActions.OnDismissDialog,
            }));
            childs.push(dialog);
            var consent = React.createElement(ConsentForm.default, this.props.Consent);
            childs.push(consent);
            var block = React.createElement('div', {
                id: this.props.Id,
                key: this.props.Id,
                ref: this.props.Id,
                className: "game",
                title: "Scrabble",
            }, childs);
            return block;
        };
        return GameRoom;
    }(React.Component));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GameRoom;
});
