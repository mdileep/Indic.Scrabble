var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "react", 'GamePlayer', 'Indic'], function (require, exports, React, GamePlayer, Indic) {
    "use strict";
    var GamePlayers = (function (_super) {
        __extends(GamePlayers, _super);
        function GamePlayers(props) {
            _super.call(this, props);
            this.state = props;
        }
        GamePlayers.prototype.render = function () {
            var players = [];
            for (var i = 0; i < this.props.Players.length; i++) {
                var player = React.createElement(GamePlayer.default, Indic.Util.Merge(this.props.Players[i], { showScore: this.props.showScores, showWords: this.props.showWordsList }));
                players.push(player);
            }
            var blocks = React.createElement('div', {
                id: this.props.Id,
                key: this.props.Id,
                ref: this.props.Id,
                className: "scoreBoard",
                title: "Information",
            }, players);
            return blocks;
        };
        return GamePlayers;
    }(React.Component));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GamePlayers;
});
