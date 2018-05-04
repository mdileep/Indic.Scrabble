define(["require", "exports", 'Contracts', 'Parser', "GameActions", "GenericActions"], function (require, exports, Contracts, Parser, GameActions, GenericActions) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = function (state, action) {
        if (state === void 0) { state = Parser.Parser.Parse(); }
        var args = action.args;
        switch (action.type) {
            case Contracts.Actions.Init:
                GameActions.GameActions.Init(state, args);
                return state;
            case Contracts.Actions.PunchAndPick:
                GameActions.GameActions.PunchAndPick(state, args);
                return state;
            case Contracts.Actions.ToBoard:
                GameActions.GameActions.ToBoard(state, args);
                return state;
            case Contracts.Actions.ToTray:
                GameActions.GameActions.ToTray(state, args);
                return state;
            case Contracts.Actions.OpenOrClose:
                GameActions.GameActions.OpenClose(state, args);
                return state;
            case Contracts.Actions.Pass:
                GameActions.GameActions.Pass(state, args);
                return state;
            case Contracts.Actions.ReDraw:
                GameActions.GameActions.ReDraw(state, args);
                return state;
            case Contracts.Actions.BotMove:
                GameActions.GameActions.BotMove(state, args);
                return state;
            case Contracts.Actions.BotMoveResponse:
                GameActions.GameActions.BotMoveResponse(state, args);
                return state;
            case Contracts.Actions.Award:
                GameActions.GameActions.Award(state, args);
                return state;
            case Contracts.Actions.ResolveWords:
                GameActions.GameActions.ResolveWords(state, args);
                return state;
            case Contracts.Actions.TakeConsent:
                GameActions.GameActions.TakeConsent(state, args);
                return state;
            case Contracts.Actions.WordResolved:
                GameActions.GameActions.ResolveWord(state, args);
                return state;
            case Contracts.Actions.WordRejected:
                GameActions.GameActions.RejectWord(state, args);
                return state;
            default:
                return state;
            case Contracts.Actions.DismissDialog:
                GenericActions.GenericActions.DismissDialog(state.Dialog, args);
                return state;
        }
    };
});
