define(["require", "exports", "react", "react-dom", 'redux', 'GameState', 'ScrabbleGame'], function (require, exports, React, ReactDOM, Redux, GameState_1, Game) {
    "use strict";
    var GameEvents = (function () {
        function GameEvents() {
        }
        GameEvents.OnDragOver = function (ev) {
            ev.preventDefault();
        };
        GameEvents.OnGameRender = function () {
            if (console) {
                console.log("OnGameRender");
            }
            var state = GameEvents.store.getState();
            var left = React.createElement(Game.default, state);
            return ReactDOM.render(left, GameEvents.rootEl);
        };
        GameEvents.Init = function () {
            GameEvents.store = Redux.createStore(GameState_1.default);
            GameEvents.rootEl = document.getElementById('root');
            GameEvents.OnGameRender();
            GameEvents.store.subscribe(GameEvents.OnGameRender);
        };
        return GameEvents;
    }());
    exports.GameEvents = GameEvents;
});
