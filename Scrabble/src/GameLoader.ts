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

import * as Contracts from 'Contracts';

import * as Sets from 'AksharaSets';
import * as M from 'Messages';
import * as DragDropTouch from 'DragDropTouch';
import * as GA from 'GameActions';
import * as GS from 'GameStore';
import * as AskBot from 'AskBot';
declare var Config: Contracts.iRawConfig;

export class GameLoader {
    public static ConfigGame(): void {
        for (var key in Sets.AksharaSets) {
            (Sets.AksharaSets as any)[key] = Config.CharSet[key];
        }

        for (var key in M.Messages) {
            (M.Messages as any)[key] = Config.Localization[key];
        }
    }

    public static Init() {
        DragDropTouch.DragDropTouch._instance;
        GameLoader.ConfigGame();
        GS.GameStore.CreateStore();
        GS.GameStore.Subscribe(GA.GameActions.Render);
        GameLoader.Prepare();
    }

    static Prepare() {
        var list = GameLoader.Vocabularies(Config.Players);
        if (list.length == 0) {
            //Not Loading the Referee if there is a Bot..
            list.push(Config.CharSet.Dictionary);
        }
        AskBot.WordLoader.Lists.Total = list.length;
        if (list.length == 0) {
            GS.GameStore.Dispatch({
                type: Contracts.Actions.Init,
                args: {
                }
            });
            return;
        }
        GameLoader.LoadVocabularies(list);
    }

    static LoadVocabularies(list: string[]): void {
        for (var indx in list) {
            AskBot.WordLoader.Init(list[indx]);
        }
    }

    static Vocabularies(players: Contracts.iPlayer[]): string[] {
        var dicts: string[] = [];
        for (var i = 0; i < players.length; i++) {
            var player: Contracts.iPlayer = players[i];
            if (player.IsBot == null || !player.IsBot) {
                continue;
            }
            if (dicts.Contains(player.Dictionary)) {
                continue;
            }
            dicts.push(player.Dictionary);
        }
        return dicts;
    }
}