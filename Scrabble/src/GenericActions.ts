//---------------------------------------------------------------------------------------------
// <copyright file="GenericActions.ts" company="Chandam-ఛందం">
//    Copyright © 2013 - 2018 'Chandam-ఛందం' : http://chandam.apphb.com
//    Original Author : Dileep Miriyala (m.dileep@gmail.com)
//    Last Updated    : 01-May-2018 21:26EST
//    Revisions:
//       Version    | Author                   | Email                     | Remarks
//       1.0        | Dileep Miriyala          | m.dileep@gmail.com        | Initial Commit
//       _._        | <TODO>                   |   <TODO>                  | <TODO>
// </copyright>
//---------------------------------------------------------------------------------------------
import * as Contracts from 'Contracts';
import * as GameLoader from 'GameLoader';

export class GenericActions {

    public static OnDismissDialog() {
        //Ideally It should work Independently..!!
        GameLoader.GameLoader.store.dispatch({
            type: Contracts.Actions.DismissDialog,
            args: {
            }
        });
    }

    public static DismissDialog(state: Contracts.iDialog, args: Contracts.iArgs): void {
        state.Show = false;
        state = null;
    }
}