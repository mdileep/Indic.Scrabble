define(["require", "exports", 'axios', 'GameLoader', 'Contracts'], function (require, exports, axios, GameLoader, Contracts) {
    "use strict";
    var AskServer = (function () {
        function AskServer() {
        }
        AskServer.NextMove = function () {
            GameLoader.GameLoader.store.dispatch({
                type: Contracts.Actions.BotMove,
                args: {}
            });
        };
        AskServer.BotMove = function (post) {
            axios
                .post("/API.ashx?nextmove", post)
                .then(function (response) {
                GameLoader.GameLoader.store.dispatch({
                    type: Contracts.Actions.BotMoveResponse,
                    args: response.data
                });
            })
                .catch(function (error) { });
        };
        return AskServer;
    }());
    exports.AskServer = AskServer;
});
