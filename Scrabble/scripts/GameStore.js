define(["require", "exports", 'GameState', 'redux'], function (require, exports, GameState_1, Redux) {
    "use strict";
    var GameStore = (function () {
        function GameStore() {
        }
        GameStore.CreateStore = function () {
            GameStore.store = Redux.createStore(GameState_1.default);
        };
        GameStore.GetState = function () {
            return GameStore.store.getState();
        };
        GameStore.Subscribe = function (listener) {
            return GameStore.store.subscribe(listener);
        };
        GameStore.Dispatch = function (action) {
            return GameStore.store.dispatch(action);
        };
        return GameStore;
    }());
    exports.GameStore = GameStore;
});
