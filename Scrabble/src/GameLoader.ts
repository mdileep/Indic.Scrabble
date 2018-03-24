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
import Reducers from 'GameState';
import * as Contracts from 'Contracts';
import * as Game from 'GameRoom';
import * as Sets from 'AksharaSets';
import * as M from 'Messages';
import * as DragDropTouch from 'DragDropTouch';

export class GameLoader {
    public static ConfigGame(): void {
        //No Validations..
        for (var key in Sets.AksharaSets) {
            (Sets.AksharaSets as any)[key] = Configuration[key];
        }

        for (var key in M.Messages) {
            (M.Messages as any)[key] = Configuration.Messages[key];
        }
    }
    public static OnDragOver(ev: Event) {
        ev.preventDefault();
    }
    public static OnGameRender(): any {
        if (console) { console.log("OnGameRender"); }
        var state: any = GameLoader.store.getState();
        var left = React.createElement(((Game.default as any) as React.ComponentClass<Contracts.iGameState>), state);
        return ReactDOM.render(left, GameLoader.rootEl);
    }
    public static Init() {
        DragDropTouch.DragDropTouch._instance;
        GameLoader.ConfigGame();
        GameLoader.store = Redux.createStore(Reducers)
        GameLoader.rootEl = document.getElementById('root');
        GameLoader.OnGameRender();
        GameLoader.store.subscribe(GameLoader.OnGameRender);
    }
    public static store: Redux.Store<Contracts.iGameState>;
    public static rootEl: HTMLElement;
}