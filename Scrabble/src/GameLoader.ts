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
import * as GA from 'GameActions';
import * as AskBot from 'AskBot';
declare var Config: Contracts.iRawConfig;

export class GameLoader {
    public static ConfigGame(): void {
        //No Validations..
        for (var key in Sets.AksharaSets) {
            (Sets.AksharaSets as any)[key] = Config.CharSet[key];
        }

        for (var key in M.Messages) {
            (M.Messages as any)[key] = Config.Localization[key];
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
        GameLoader.LoadBots(Config.Players);
    }
    static LoadBots(players: Contracts.iPlayer[]): void {
        var bots: string[] = [];
        for (var i = 0; i < players.length; i++) {
            var player: Contracts.iPlayer = players[i];
            if (player.IsBot == null || !player.IsBot) {
                continue;
            }
            if (bots.Contains(player.Dictionary)) {
                continue;
            }
            bots.push(player.Dictionary);
        }
        for (var indx in bots) {
            AskBot.WordLoader.Init(bots[indx]);
        }
    }
    static BotLoaded(file: string): void {
        var players: Contracts.iPlayer[] = Config.Players;
        var cnt: number = 0;
        for (var i = 0; i < players.length; i++) {
            var player: Contracts.iPlayer = players[i];
            if (player.IsBot == null || !player.IsBot || player.BotLoaded) {
                cnt++;
                continue;
            }
            if (player.Dictionary == file) {
                player.BotLoaded = true;
                cnt++;
            }
        }
        if (cnt != players.length) {
            return;
        }

        GameLoader.store = Redux.createStore(Reducers)
        GameLoader.rootEl = document.getElementById('root');
        GameLoader.OnGameRender();
        GameLoader.store.subscribe(GameLoader.OnGameRender);
        //All Bots Loaded
        GameLoader.store.dispatch({
            type: Contracts.Actions.Init,
            args: {
            }
        });
    }
    public static store: Redux.Store<Contracts.iGameState>;
    public static rootEl: HTMLElement;
}