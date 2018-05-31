define(["require", "exports", 'Contracts', 'AksharaSets', 'Messages', 'DragDropTouch', 'GameActions', 'GameStore', 'WordLoader'], function (require, exports, Contracts, Sets, M, DragDropTouch, GA, GS, WL) {
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
            GameLoader.Prepare();
        };
        GameLoader.Prepare = function () {
            var list = GameLoader.Vocabularies(Config.Players);
            if (list.length == 0) {
                list.push(Config.CharSet.Dictionary);
            }
            WL.WordLoader.Total = list.length;
            if (list.length == 0) {
                GS.GameStore.Dispatch({
                    type: Contracts.Actions.Init,
                    args: {}
                });
                return;
            }
            GameLoader.LoadVocabularies(list);
        };
        GameLoader.LoadVocabularies = function (list) {
            for (var indx in list) {
                WL.WordLoader.Init(list[indx]);
            }
        };
        GameLoader.Vocabularies = function (players) {
            var dicts = [];
            for (var i = 0; i < players.length; i++) {
                var player = players[i];
                var IsBot = player.Bot != null;
                if (!IsBot) {
                    continue;
                }
                if (dicts.Contains(player.Bot.Dictionary)) {
                    continue;
                }
                dicts.push(player.Bot.Dictionary);
            }
            return dicts;
        };
        return GameLoader;
    }());
    exports.GameLoader = GameLoader;
});
