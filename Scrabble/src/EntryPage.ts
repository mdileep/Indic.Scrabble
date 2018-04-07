//---------------------------------------------------------------------------------------------
// <copyright file="GameLoader.ts" company="Chandam-ఛందం">
//    Copyright © 2013 - 2018 'Chandam-ఛందం' : http://chandam.apphb.com
//    Original Author : Dileep Miriyala (m.dileep@gmail.com)
//    Last Updated    : 29-Jan-2018 21:53EST
//    Revisions:
//       Version    | Author                   | Email                     | Remarks
//       1.0        | Dileep Miriyala          | m.dileep@gmail.com        | Initial Commit
//       _._        | <TODO>                   |   <TODO>                  | <TODO>
// </copyright>
//---------------------------------------------------------------------------------------------
import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Redux from 'redux';
import Reducers from 'EntryState';
import * as Contracts from 'Contracts';

export class EntryPage {
    public static ConfigGame(): void {
     
    }
  
    public static OnRender(): any {
     
    }
    public static Init() {
        EntryState.store.dispatch({
            type: EntryState.Actions.Init,
            args: {
            }
        });
    }
    public static store: Redux.Store<Contracts.iEntryState>;
    public static rootEl: HTMLElement;
}