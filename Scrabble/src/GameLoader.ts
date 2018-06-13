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
import * as Indic from 'Indic';
import * as M from 'Messages';
import * as DragDropTouch from 'DragDropTouch';
import * as GA from 'GameActions';
import * as GS from 'GameStore';
import * as WL from 'WordLoader';
import * as AskBot from 'AskBot';
declare var Config: Contracts.iRawConfig;

export class GameLoader {
    public static ConfigGame(): void {
        for (var key in Indic.AksharaSets) {
            (Indic.AksharaSets as any)[key] = Config.CharSet[key];
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
        WL.WordLoader.Prepare(list);
       
    }

    static Vocabularies(players: Contracts.iPlayer[]): string[] {
        var dicts: string[] = [];
        for (var i = 0; i < players.length; i++) {
            var player: Contracts.iPlayer = players[i];
            var IsBot: boolean = player.Bot != null;
            if (!IsBot) {
                continue;
            }
            if (dicts.Contains(player.Bot.Dictionary)) {
                continue;
            }
            dicts.push(player.Bot.Dictionary);
        }
        return dicts;
    }
}