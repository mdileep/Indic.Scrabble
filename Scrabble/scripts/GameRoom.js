var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "react", 'Cabinet', 'Board', 'InfoBar', 'GamePlayers', 'ActionBar', 'GameTable', 'AlertDialog', 'Util', 'GenericActions', 'ConsentForm', 'Messages'], function (require, exports, React, Cabinet, Board, InfoBar, GamePlayers, ActionBar, GameTable, Alert, Util, GA, ConsentForm, M) {
    "use strict";
    var GameRoom = (function (_super) {
        __extends(GameRoom, _super);
        function GameRoom(props) {
            _super.call(this, props);
            this.state = props;
        }
        GameRoom.prototype.render = function () {
            var childs = [];
            var gameTable = React.createElement(GameTable.default, Util.Util.Merge(this.props.GameTable, { ReadOnly: this.props.GameTable.ReadOnly || this.props.ReadOnly }));
            childs.push(gameTable);
            var board = React.createElement(Board.default, this.props.Board);
            childs.push(board);
            var actionBar = React.createElement(ActionBar.default, Util.Util.Merge(this.props.Stats, { key: "actionBar", ReadOnly: this.props.ReadOnly }));
            childs.push(actionBar);
            var words = React.createElement(GamePlayers.default, Util.Util.Merge(this.props.Players, { key: "words", Id: "WordBoard", showScores: true, showWordsList: true, ReadOnly: this.props.ReadOnly }));
            childs.push(words);
            var cabinet = React.createElement(Cabinet.default, Util.Util.Merge(this.props.Cabinet, { ReadOnly: this.props.Cabinet.ReadOnly || this.props.ReadOnly }));
            childs.push(cabinet);
            var info = React.createElement(InfoBar.default, this.props.InfoBar);
            childs.push(info);
            var dialog = React.createElement(Alert.default, Util.Util.Merge(this.props.Dialog, { OnConfirm: GA.GenericActions.OnDismissDialog }));
            childs.push(dialog);
            var consent = React.createElement(ConsentForm.default, this.props.Consent);
            childs.push(consent);
            var block = React.createElement('div', {
                id: this.props.Id,
                key: this.props.Id,
                ref: this.props.Id,
                className: "game",
                title: M.Messages.Brand
            }, childs);
            return block;
        };
        return GameRoom;
    }(React.Component));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GameRoom;
});
