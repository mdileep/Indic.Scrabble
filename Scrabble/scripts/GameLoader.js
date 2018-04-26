define(["require", "exports", "react", "react-dom", 'redux', 'GameState', 'Contracts', 'GameRoom', 'AksharaSets', 'Messages', 'DragDropTouch', 'AskBot'], function (require, exports, React, ReactDOM, Redux, GameState_1, Contracts, Game, Sets, M, DragDropTouch, AskBot) {
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
        GameLoader.OnDragOver = function (ev) {
            ev.preventDefault();
        };
        GameLoader.OnGameRender = function () {
            if (console) {
                console.log("OnGameRender");
            }
            var state = GameLoader.store.getState();
            var left = React.createElement(Game.default, state);
            return ReactDOM.render(left, GameLoader.rootEl);
        };
        GameLoader.Init = function () {
            DragDropTouch.DragDropTouch._instance;
            GameLoader.ConfigGame();
            GameLoader.LoadBots(Config.Players);
        };
        GameLoader.LoadBots = function (players) {
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
            for (var indx in bots) {
                AskBot.WordLoader.Init(bots[indx]);
            }
        };
        GameLoader.BotLoaded = function (file) {
            var players = Config.Players;
            var cnt = 0;
            for (var i = 0; i < players.length; i++) {
                var player = players[i];
                if (player.IsBot == null || !player.IsBot || player.BotLoaded) {
                    cnt++;
                    continue;
                }
                if (player.Dictionary == file) {
                    player.BotLoaded = true;
                    cnt++;
                }
            }
            if (cnt != players.length) {
                return;
            }
            GameLoader.store = Redux.createStore(GameState_1.default);
            GameLoader.rootEl = document.getElementById('root');
            GameLoader.OnGameRender();
            GameLoader.store.subscribe(GameLoader.OnGameRender);
            GameLoader.store.dispatch({
                type: Contracts.Actions.Init,
                args: {}
            });
        };
        return GameLoader;
    }());
    exports.GameLoader = GameLoader;
});
