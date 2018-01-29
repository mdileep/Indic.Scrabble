define(["require", "exports", 'Parser', "GameRules"], function (require, exports, Parser, GameRules) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = function (state, action) {
        if (state === void 0) { state = Parser.Parser.Parse(InitialState); }
        var args = action.args;
        switch (action.type) {
            default:
                return state;
            case "MOVE":
                if (console)
                    console.log("Moving Tile from Tray to Board.");
                GameRules.GameRules.ToBoard(state, args);
                return state;
            case "TOGGLE_GRP":
                if (console)
                    console.log("Opening Tray");
                GameRules.GameRules.GroupsDisplay(state, args);
                return state;
            case "TO_TRAY":
                if (console)
                    console.log("Moving back to Tray.");
                GameRules.GameRules.ToTray(state, args);
                return state;
        }
    };
});
