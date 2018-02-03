define(["require", "exports", 'Contracts', 'Parser', "GameActions"], function (require, exports, Contracts, Parser, GameActions) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = function (state, action) {
        if (state === void 0) { state = Parser.Parser.Parse(InitState); }
        var args = action.args;
        switch (action.type) {
            case Contracts.Actions.ToBoard:
                if (console)
                    console.log("Moving Tile from Tray to Board.");
                GameActions.GameActions.ToBoard(state, args);
                return state;
            case Contracts.Actions.ToTray:
                if (console)
                    console.log("Moving back to Tray.");
                GameActions.GameActions.ToTray(state, args);
                return state;
            case Contracts.Actions.OpenOrClose:
                if (console)
                    console.log("Opening Tray");
                GameActions.GameActions.OpenClose(state, args);
                return state;
            case Contracts.Actions.Pass:
                if (console)
                    console.log("Passing the Turn");
                GameActions.GameActions.Pass(state, args);
                return state;
            default:
                return state;
        }
    };
});
