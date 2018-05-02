define(["require", "exports", 'Contracts', 'GameLoader'], function (require, exports, Contracts, GameLoader) {
    "use strict";
    var GenericActions = (function () {
        function GenericActions() {
        }
        GenericActions.OnDismissDialog = function () {
            GameLoader.GameLoader.store.dispatch({
                type: Contracts.Actions.DismissDialog,
                args: {}
            });
        };
        GenericActions.DismissDialog = function (state, args) {
            state.Show = false;
            state = null;
        };
        return GenericActions;
    }());
    exports.GenericActions = GenericActions;
});
