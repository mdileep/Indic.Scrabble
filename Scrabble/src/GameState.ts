//---------------------------------------------------------------------------------------------
// <copyright file="GameState.ts" company="Chandam-????">
//    Copyright © 2013 - 2018 'Chandam-????' : http://chandam.apphb.com
//    Original Author : Dileep Miriyala (m.dileep@gmail.com)
//    Last Updated    : 29-Jan-2018 21:53EST
//    Revisions:
//       Version    | Author                   | Email                     | Remarks
//       1.0        | Dileep Miriyala          | m.dileep@gmail.com        | Initial Commit
//       _._        | <TODO>                   |   <TODO>                  | <TODO>
// </copyright>
//---------------------------------------------------------------------------------------------
import * as Contracts from 'Contracts';
import * as Parser from 'Parser';
import * as GameActions from "GameActions";
import * as GenericActions from "GenericActions";
import * as Redux from 'redux';

export default (state: Contracts.iGameState = Parser.Parser.Parse(), action: Contracts.iActionArgs) => {
    var args = action.args;
    switch (action.type) {

        case Contracts.Actions.Init:
            GameActions.GameActions.Init(state, args);
            return state;

        case Contracts.Actions.PunchAndPick:
            if (console) console.log("Player picked the Board");
            GameActions.GameActions.PunchAndPick(state, args);
            return state;

        case Contracts.Actions.ToBoard:
            if (console) console.log("Moving Tile from Tray to Board.");
            GameActions.GameActions.ToBoard(state, args);
            return state;

        case Contracts.Actions.ToTray:
            if (console) console.log("Moving back to Tray.");
            GameActions.GameActions.ToTray(state, args);
            return state;

        case Contracts.Actions.OpenOrClose:
            if (console) console.log("Opening Tray");
            GameActions.GameActions.OpenClose(state, args);
            return state;

        case Contracts.Actions.Pass:
            if (console) console.log("Passing the Turn");
            GameActions.GameActions.Pass(state, args);
            return state;

        case Contracts.Actions.ReDraw:
            if (console) console.log("ReDraw Tiles");
            GameActions.GameActions.ReDraw(state, args);
            return state;

        case Contracts.Actions.BotMove:
            if (console) console.log("Bot is Thinking");
            GameActions.GameActions.BotMove(state, args);
            return state;

        case Contracts.Actions.BotMoveResponse:
            if (console) console.log("Bot Responded");
            GameActions.GameActions.BotMoveResponse(state, args as Contracts.iBotMoveResponse);
            return state;

        default:
            return state;

        //Following may be moved to different store ..
        case Contracts.Actions.DismissDialog:
            if (console) console.log("Dismiss Dialog");
            GenericActions.GenericActions.DismissDialog(state.Dialog, args);
            return state;
    }
}