define(["require", "exports", "react", "react-dom", 'redux', 'GameState', 'GameRoom', 'AksharaSets', 'Messages'], function (require, exports, React, ReactDOM, Redux, GameState_1, Game, Sets, M) {
    "use strict";
    var GameLoader = (function () {
        function GameLoader() {
        }
        GameLoader.ConfigGame = function () {
            Sets.AksharaSets.FullSpecialSet = Configuration.FullSpecialSet;
            Sets.AksharaSets.SpecialSet = Configuration.SpecialSet;
            Sets.AksharaSets.SunnaSet = Configuration.SunnaSet;
            Sets.AksharaSets.Vowels = Configuration.Vowels;
            Sets.AksharaSets.Consonents = Configuration.Consonents;
            Sets.AksharaSets.Virama = Configuration.Virama;
            Sets.AksharaSets.Synonyms = Configuration.Synonyms;
            M.Messages.InvalidMove = Configuration.Messages.InvalidMove;
            M.Messages.UseSynonym = Configuration.Messages.UseSynonym;
            M.Messages.Messages = Configuration.Messages.Messages;
            M.Messages.CrossCells = Configuration.Messages.CrossCells;
            M.Messages.HasIslands = Configuration.Messages.HasIslands;
            M.Messages.HasOraphans = Configuration.Messages.HasOraphans;
            M.Messages.OrphanCell = Configuration.Messages.OrphanCell;
            M.Messages.HasDupliates = Configuration.Messages.HasDupliates;
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
