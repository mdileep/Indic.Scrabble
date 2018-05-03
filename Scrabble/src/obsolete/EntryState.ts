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
import * as EntryActions from "EntryActions";

export default (state: Contracts.iIndexState = Parser.Parser.ParseEntry(InitState), action: Contracts.iActionArgs) => {
    var args = action.args;
    switch (action.type) {
        case Contracts.Actions.Init:
            EntryActions.EntryActions.Init(state, args);
            return state;

        default:
            return state
    }
}

