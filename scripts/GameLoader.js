define(["require", "exports", "react", "react-dom", 'redux', 'GameState', 'GameRoom', 'AksharaSets', 'Messages', 'DragDropTouch'], function (require, exports, React, ReactDOM, Redux, GameState_1, Game, Sets, M, DragDropTouch) {
    "use strict";
    var GameLoader = (function () {
        function GameLoader() {
        }
        GameLoader.ConfigGame = function () {
            for (var key in Sets.AksharaSets) {
                Sets.AksharaSets[key] = Configuration[key];
            }
            for (var key in M.Messages) {
                M.Messages[key] = Configuration.Messages[key];
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
            GameLoader.store = Redux.createStore(GameState_1.default);
            GameLoader.rootEl = document.getElementById('root');
            GameLoader.OnGameRender();
            GameLoader.store.subscribe(GameLoader.OnGameRender);
        };
        return GameLoader;
    }());
    exports.GameLoader = GameLoader;
});
