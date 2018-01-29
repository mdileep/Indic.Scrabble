import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Redux from 'redux';
import Reducers from 'GameState';
import * as Contracts from 'Contracts';
import * as Game from 'ScrabbleGame';

export class GameEvents {
    public static OnDragOver(ev: Event) {
        ev.preventDefault();
    }

    public static OnGameRender(): any {
        if (console) { console.log("OnGameRender"); }
        var state: any = GameEvents.store.getState();
        var left = React.createElement(((Game.default as any) as React.ComponentClass<Contracts.IGameState>), state);
        return ReactDOM.render(left, GameEvents.rootEl);
    }

    public static Init() {
        GameEvents.store = Redux.createStore(Reducers)
        GameEvents.rootEl = document.getElementById('root');
        GameEvents.OnGameRender();
        GameEvents.store.subscribe(GameEvents.OnGameRender);
    }

    public static store: Redux.Store<Contracts.IGameState>;
    public static rootEl: HTMLElement;
}