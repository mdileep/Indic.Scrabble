var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "react", 'GamePlayer', 'Util', 'Messages'], function (require, exports, React, GamePlayer, Util, Messages) {
    "use strict";
    var GamePlayers = (function (_super) {
        __extends(GamePlayers, _super);
        function GamePlayers(props) {
            _super.call(this, props);
            this.state = props;
        }
        GamePlayers.prototype.render = function () {
            var childs = [];
            for (var i = 0; i < this.props.Players.length; i++) {
                var player = React.createElement(GamePlayer.default, Util.Util.Merge(this.props.Players[i], {
                    showScore: this.props.showScores,
                    showWords: this.props.showWordsList
                }));
                childs.push(player);
            }
            if (this.props.showWordsList && this.props.HasClaims) {
                var label = React.createElement('span', {
                    key: "lbl",
                    className: "conditions",
                    title: Messages.Messages.Claimed
                }, Messages.Messages.Claimed);
                childs.push(label);
            }
            var className = "players";
            var elem = React.createElement('div', {
                id: this.props.Id,
                key: this.props.Id,
                ref: this.props.Id,
                className: className,
                title: "Players",
            }, childs);
            return elem;
        };
        return GamePlayers;
    }(React.Component));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GamePlayers;
});
