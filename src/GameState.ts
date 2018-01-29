import * as Contracts from 'Contracts';
import * as Parser from 'Parser';
import * as GameRules from "GameRules";


export default (state: Contracts.IGameState = Parser.Parser.Parse(InitialState), action: Contracts.IActionArgs) => {
    var args = action.args;

    switch (action.type) {
        default:
            return state

        case "MOVE":
            if (console) console.log("Moving Tile from Tray to Board.");
            GameRules.GameRules.ToBoard(state, args);
            return state;

        case "TOGGLE_GRP":
            if (console) console.log("Opening Tray");
            GameRules.GameRules.GroupsDisplay(state,args);
            return state;

        case "TO_TRAY":
            if (console) console.log("Moving back to Tray.");
            GameRules.GameRules.ToTray(state, args);
            return state;
    }
}

