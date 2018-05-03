define(["require", "exports", 'Contracts', 'AksharaSets', 'Messages', 'DragDropTouch', 'GameActions', 'GameStore', 'AskBot'], function (require, exports, Contracts, Sets, M, DragDropTouch, GA, GS, AskBot) {
    "use strict";
    var GameLoader = (function () {
        function GameLoader() {
        }
        GameLoader.ConfigGame = function () {
            for (var key in Sets.AksharaSets) {
                Sets.AksharaSets[key] = Config.CharSet[key];
            }
            for (var key in M.Messages) {
                M.Messages[key] = Config.Localization[key];
            }
        };
        GameLoader.Init = function () {
            DragDropTouch.DragDropTouch._instance;
            GameLoader.ConfigGame();
            GS.GameStore.CreateStore();
            GS.GameStore.Subscribe(GA.GameActions.Render);
            GameLoader.PreparePlayers();
        };
        GameLoader.PreparePlayers = function () {
            var bots = GameLoader.GetBots(Config.Players);
            if (bots.length == 0) {
                GS.GameStore.Dispatch({
                    type: Contracts.Actions.Init,
                    args: {}
                });
                return;
            }
            GameLoader.LoadBots(bots);
        };
        GameLoader.LoadBots = function (bots) {
            for (var indx in bots) {
                AskBot.WordLoader.Init(bots[indx]);
            }
        };
        GameLoader.GetBots = function (players) {
            var bots = [];
            for (var i = 0; i < players.length; i++) {
                var player = players[i];
                if (player.IsBot == null || !player.IsBot) {
                    continue;
                }
                if (bots.Contains(player.Dictionary)) {
                    continue;
                }
                bots.push(player.Dictionary);
            }
            return bots;
        };
        return GameLoader;
    }());
    exports.GameLoader = GameLoader;
});
