//---------------------------------------------------------------------------------------------
// <copyright file="AskServer.ts" company="Chandam-ఛందం">
//    Copyright © 2013 - 2018 'Chandam-ఛందం' : http://chandam.apphb.com
//    Original Author : Dileep Miriyala (m.dileep@gmail.com)
//    Last Updated    : 27-Mar-2018 14:38EST
//    Revisions:
//       Version    | Author                   | Email                     | Remarks
//       1.0        | Dileep Miriyala          | m.dileep@gmail.com        | Initial Commit
//       _._        | <TODO>                   |   <TODO>                  | <TODO>
// </copyright>
//---------------------------------------------------------------------------------------------
import * as axios from 'axios';
import * as GameLoader from 'GameLoader';
import * as Contracts from 'Contracts';

export class AskServer {

    static NextMove(): void {
        GameLoader.GameLoader.store.dispatch({
            type: Contracts.Actions.BotMove,
            args: {
            }
        });
    }

    static BotMove(post: any): void {
        axios
            .post("/API.ashx?nextmove", post)
            .then(response => {
                GameLoader.GameLoader.store.dispatch({
                    type: Contracts.Actions.BotMoveResponse,
                    args: response.data
                });
            })
            .catch(error => { });
    }
}