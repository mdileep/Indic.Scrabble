//---------------------------------------------------------------------------------------------
// <copyright file="AskReferee.ts" company="Chandam-ఛందం">
//    Copyright © 2013 - 2018 'Chandam-ఛందం' : http://chandam.apphb.com
//    Original Author : Dileep Miriyala (m.dileep@gmail.com)
//    Last Updated    : 13-May-2018 19:01EST
//    Revisions:
//       Version    | Author                   | Email                     | Remarks
//       1.0        | Dileep Miriyala          | m.dileep@gmail.com        | Initial Commit
//       _._        | <TODO>                   |   <TODO>                  | <TODO>
// </copyright>
//---------------------------------------------------------------------------------------------

import * as C from 'Contracts';
import * as M from 'Messages';
import * as U from 'Util';
import * as AskServer  from "AskBot";
import * as Indic from 'Indic';
import * as GA from 'GameActions';

export class AskReferee {
    static Validate(state: C.iGameState, args: C.iArgs): void {
        var errorCode: number = AskReferee.ValidateMove(state.Board);
        if (errorCode > 0) {
            AskReferee.Announce(state, (errorCode == 1) ? M.Messages.CrossCells : M.Messages.NoGap);
            return;
        }
        var hasOrphans: boolean = AskReferee.HasOrphans(state);
        if (hasOrphans) {
            AskReferee.Announce(state, M.Messages.HasOraphans);
            return;
        }
        var hasClusters: boolean = AskReferee.HasClusters(state);
        if (hasClusters) {
            AskReferee.Announce(state, M.Messages.HasIslands);
            return;
        }
        var hasMoves: boolean = AskReferee.HasMoves(state);
        if (hasMoves) {
            var isCovered: boolean = AskReferee.IsStarCovered(state);
            if (!isCovered) {
                AskReferee.Announce(state, M.Messages.IsStarCovered);
                return;
            }
        }
        var player: C.iPlayer = state.Players.Players[state.Players.CurrentPlayer];
        state.GameTable.Message = U.Util.Format(M.Messages.LookupDict, [player.Name]);
        state.ReadOnly = true;
        setTimeout(AskServer.AskServer.Validate, C.Settings.RefreeWait);
    }
    static HasMoves(state: C.iGameState): boolean {
        var Board: C.iBoardProps = state.Board;
        var first = AskReferee.FirstNonEmpty(Board.Cells, [], Board.Size);
        return (first != -1);
    }
    static IsStarCovered(state: C.iGameState): boolean {
        var C = state.Board.Cells[state.Board.Star];
        return (C.Waiting.length + C.Confirmed.length != 0);
    }
    static Announce(state: C.iGameState, message: string) {
        state.InfoBar.Messages.push(M.Messages.HasIslands);
        state.Dialog.Title = M.Messages.Name;
        state.Dialog.Message = message;
        state.Dialog.Show = true;
    }
    static ValidateMove(Board: C.iBoardProps): number {
        var Cells: C.iCellProps[] = Board.Cells;
        var size: number = Board.Size;
        var Waiting: number[] = [];
        for (var i = 0; i < size * size; i++) {
            var C = Cells[i];
            if (C.Waiting.length == 0) {
                continue;
            }
            Waiting.push(i);
        }
        if (Waiting.length == 0) {
            return 0;
        }
        var First: C.iPosition = U.Util.Position(Waiting[0], size);
        var Last: C.iPosition = {} as C.iPosition;
        var rows = 0; var columns = 0;
        for (var indx in Waiting) {
            var Current = U.Util.Position(Waiting[indx], size);
            if (Current.X != First.X) {
                rows++;
            }
            if (Current.Y != First.Y) {
                columns++;
            }
            if (rows != 0 && columns != 0) {
                return 1;
            }
            Last = Current;
        }

        for (var i = ((rows == 0) ? First.Y : First.X); i < ((rows == 0) ? Last.Y : Last.X); i++) {
            //All Cells Should be filled between First and Last.
            var _i: number = U.Util.Abs((rows == 0) ? First.X : i, (rows == 0) ? i : First.Y, size);
            var C = Cells[_i];
            if (C.Confirmed.length + C.Waiting.length == 0) {
                return 2;
            }
        }
        return 0;
    }
    static HasOrphans(state: C.iGameState): boolean {
        var orphans: number[] = AskReferee.OrphanCells(state.Board);
        for (var i = 0; i < orphans.length; i++) {
            var orphan: number = orphans[i];
            var P: C.iPosition = U.Util.Position(orphan, state.Board.Size);
            var N: C.iCellProps = state.Board.Cells[orphan];
            state.InfoBar.Messages.push(U.Util.Format(M.Messages.OrphanCell, [(P.X + 1), (P.Y + 1), N.Current]));
        }
        return orphans.length > 0;
    }
    static OrphanCells(Board: C.iBoardProps): number[] {
        var oraphans: number[] = [];
        for (var i = 0; i < Board.Cells.length; i++) {
            var Cell: C.iCellProps = Board.Cells[i];
            if (Cell.Waiting.length + Cell.Confirmed.length == 0) {
                continue;
            }
            var neighors: number[] = U.Util.FindNeighbors(i, Board.Size);
            var valid: boolean = false;
            for (var j = 0; j < neighors.length; j++) {
                var neighbor: number = neighors[j];
                var N: C.iCellProps = Board.Cells[neighbor];
                if (N.Waiting.length + N.Confirmed.length != 0) {
                    valid = true;
                }
            }
            if (!valid) {
                if (oraphans.indexOf(i) >= 0) {
                    continue;
                }
                oraphans.push(i);
            }
        }
        return oraphans;
    }
    static HasClusters(state: C.iGameState): boolean {
        var Board: C.iBoardProps = state.Board;
        var Clustered: number[] = [];
        var clusters = 0;
        while (true) {
            var first = AskReferee.FirstNonEmpty(Board.Cells, Clustered, Board.Size);
            if (first == -1) {
                break;
            }
            var List = AskReferee.ClusterCells(Board.Cells, first, Board.Size);
            Clustered = Clustered.concat(List);
            clusters++;
        }
        //if (console) { console.log("Clusters found: " + clusters); }
        return (clusters > 1);
    }
    static ClusterCells(Cells: C.iCellProps[], first: number, size: number): number[] {
        var List: number[] = [];
        List.push(first);
        {
            var P: C.iPosition = U.Util.Position(first, size);
            var C: C.iCellProps = Cells[first];
        }
        var curr = 0;
        while (curr < List.length) {

            var neighors = U.Util.FindNeighbors(List[curr], size);
            for (var i = 0; i < neighors.length; i++) {
                var neighbor = neighors[i];
                if (List.indexOf(neighbor) >= 0) {
                    continue;
                }
                var C = Cells[neighbor];
                if (C.Confirmed.length + C.Waiting.length == 0) {
                    continue;
                }
                var P = U.Util.Position(neighbor, size);
                List.push(neighbor);
            }
            curr++;
        }
        return List;
    }
    static FirstNonEmpty(Cells: C.iCellProps[], Clustered: number[], size: number): number {
        var first: number = -1;
        for (var i = 0; i < size * size; i++) {
            if (Clustered.indexOf(i) >= 0) {
                continue;
            }
            if (Cells[i].Confirmed.length + Cells[i].Waiting.length == 0) {
                continue;
            }
            first = i;
            break;
        }
        return first;
    }
    static ExtractWords(board: C.iBoardProps): string[] {
        var Words = GA.GameActions.WordsOnBoard(board, true, true);
        var sWords: string[] = [];
        for (var indx in Words) {
            var word: string = Words[indx].Text;
            word = Indic.Indic.ToScrabble(word);
            sWords.push(word);
        }
        return sWords;
    }
}