define(["require", "exports", 'Contracts', 'GameStore'], function (require, exports, Contracts, GS) {
    "use strict";
    var GenericActions = (function () {
        function GenericActions() {
        }
        GenericActions.OnDismissDialog = function () {
            GS.GameStore.Dispatch({
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
