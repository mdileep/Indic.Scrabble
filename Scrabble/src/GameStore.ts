//---------------------------------------------------------------------------------------------
// <copyright file="GameStore.ts" company="Chandam-ఛందం">
//    Copyright © 2013 - 2018 'Chandam-ఛందం' : http://chandam.apphb.com
//    Original Author : Dileep Miriyala (m.dileep@gmail.com)
//    Last Updated    : 02-May-2018 19:37EST
//    Revisions:
//       Version    | Author                   | Email                     | Remarks
//       1.0        | Dileep Miriyala          | m.dileep@gmail.com        | Initial Commit
//       _._        | <TODO>                   |   <TODO>                  | <TODO>
// </copyright>
//---------------------------------------------------------------------------------------------

import Reducers from 'GameState';
import * as Redux from 'redux';
import * as Contracts from 'Contracts';

export class GameStore {
    static store: Redux.Store<Contracts.iGameState>;

    public static CreateStore(): void {
        GameStore.store = Redux.createStore(Reducers)
    }

    public static GetState(): Contracts.iGameState {
        return GameStore.store.getState();
    }

    public static Subscribe(listener: () => void): Redux.Unsubscribe {
        return GameStore.store.subscribe(listener);
    }

    public static Dispatch(action: Contracts.iAction): any {
        return GameStore.store.dispatch(action);
    }
}