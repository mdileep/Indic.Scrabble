define(["require", "exports", "react", "react-dom", 'redux', 'GameState', 'GameRoom'], function (require, exports, React, ReactDOM, Redux, GameState_1, Game) {
    "use strict";
    var GameLoader = (function () {
        function GameLoader() {
        }
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
            GameLoader.store = Redux.createStore(GameState_1.default);
            GameLoader.rootEl = document.getElementById('root');
            GameLoader.OnGameRender();
            GameLoader.store.subscribe(GameLoader.OnGameRender);
        };
        return GameLoader;
    }());
    exports.GameLoader = GameLoader;
});
