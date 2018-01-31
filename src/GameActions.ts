//---------------------------------------------------------------------------------------------
// <copyright file="GameActions.ts" company="Chandam-ఛందం">
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

export class GameActions {
    public static Pass(state: Contracts.iGameState, args: Contracts.iArgs): void {
        debugger;
        var isValid: boolean = GameActions.ValidateWords(state);
        if (!isValid) {
            return;
        }
        GameActions.UpdateScore(state);
        GameActions.TogglePlayers(state);
    }

    public static ValidateWords(state: Contracts.iGameState): boolean {
        //Actual Word Verification against Word Database
        return true;
    }
    public static UpdateScore(state: Contracts.iGameState): void {
        var score: number = 0;
        //TODO: 
        // Currently updating Scores only
        // Scores should be based on the Valid Words 
        // Currently Scores are based on No. of Cells filled.

        for (var i = 0; i < state.Board.Cells.length; i++) {
            var cell: Contracts.iCellProps = state.Board.Cells[i];
            if (cell.Waiting.length == 0) {
                continue;
            }
            score = score + cell.Weight;
            //Move Waiting to Confirmed
            //Set Waiting to Blank
            for (var w = 0; w < cell.Waiting.length; w++) {
                cell.Confirmed.push(cell.Waiting[w]);
            }
            cell.Waiting = [];

        }
        var curr: number = state.ScoreBoard.CurrentPlayer;
        state.ScoreBoard.Users[curr].Score += score;
    }
    public static TogglePlayers(state: Contracts.iGameState): void {
        for (var i = 0; i < state.ScoreBoard.Users.length; i++) {
            var user: Contracts.iUser = state.ScoreBoard.Users[i];
            user.Playing = !user.Playing;
            if (user.Playing) {
                state.ScoreBoard.CurrentPlayer = i;
            }
        }
    }

    public static ToTray(state: Contracts.iGameState, args: Contracts.iArgs): void {
        var cell: Contracts.iCellProps = state.Board.Cells[args.Index];
        if (cell.Last == cell.Current) {
            return;
        }
        if (cell.Waiting.length > 0) {
            var toRemove = cell.Waiting[cell.Waiting.length - 1];
            cell.Waiting.pop();
            cell.Current = Indic.Indic.Merge(cell.Confirmed.concat(cell.Waiting));
            var iPos = GameActions.FindTile(state, toRemove);
            var group: Contracts.iTrayProps = state.Cabinet.Trays[iPos.TrayIndex];
            var tile: Contracts.iTileProps = group.Tiles[iPos.TileIndex];
            tile.Remaining++;
            state.Cabinet.Remaining++;
        }
    }
    public static _ToBoard(state: Contracts.iGameState, args: Contracts.iArgs, useSynonyms: boolean): void {
        var tray: Contracts.iTrayProps = state.Cabinet.Trays[args.TrayIndex];
        var tile: Contracts.iTileProps = tray.Tiles[args.TileIndex];
        if (tile.Remaining == 0) {
            return;
        }
        var src: string = args.Src;
        var cell: Contracts.iCellProps = state.Board.Cells[args.CellIndex];
        var list: string[] = cell.Confirmed.concat(cell.Waiting);
        list.push(src);
        var isValid = Indic.Indic.IsValid(list);
        if (!isValid) {
            state.ScoreBoard.Messages.push(Indic.Messages.Format(Indic.Messages.InvalidMove, [cell.Current, src]));
            if (!useSynonyms) {
                return;
            }
            var synonym = Indic.Indic.Synonyms[src];
            if (synonym == null) {
                return;
            }
            state.ScoreBoard.Messages.push(Indic.Messages.Format(Indic.Messages.UseSynonym, [cell.Current, src, synonym]));
            var iPos = GameActions.FindTile(state, synonym);
            iPos.Src = synonym;
            iPos.CellIndex = args.CellIndex;
            GameActions._ToBoard(state, iPos, false);
            return;
        }
        cell.Waiting.push(src);
        list = cell.Confirmed.concat(cell.Waiting);
        cell.Current = Indic.Indic.Merge(list);
        tile.Remaining--;
        state.Cabinet.Remaining--;
    }
    public static ToBoard(state: Contracts.iGameState, args: Contracts.iArgs): void {
        GameActions._ToBoard(state, args, true);
    }
    public static FindTile(state: Contracts.iGameState, char: string): Contracts.iArgs {
        for (var i = 0; i < state.Cabinet.Trays.length; i++) {
            var tray: Contracts.iTrayProps = state.Cabinet.Trays[i];
            for (var j = 0; j < tray.Tiles.length; j++) {
                var tile: Contracts.iTileProps = tray.Tiles[j];
                if (tile.Text == char) { return { TrayIndex: i, TileIndex: j }; }
            }
        }
        return null;
    }
    public static OpenClose(state: Contracts.iGameState, args: Contracts.iArgs) {
        var tray: Contracts.iTrayProps = state.Cabinet.Trays[args.TrayIndex];
        tray.Show = !tray.Show;
        //To make sure atleast one group is available.
        //Restrict from hiding all groups
        var cnt: number = 0; var last = -1;
        for (var i = 0; i < state.Cabinet.Trays.length; i++) {
            if (cnt > 1) {
                break;
            }
            if (state.Cabinet.Trays[i].Show) {
                cnt++;
                last = i;
            }
        }
        if (cnt == 1) {
            state.Cabinet.Trays[last].Disabled = true;
        } else {
            for (var i = 0; i < state.Cabinet.Trays.length; i++) {
                state.Cabinet.Trays[i].Disabled = false;
            }
        }
    }
    public static UnConfirmed(Board: Contracts.iBoardProps): number {
        //Currently It's a single player game
        var weight = 0;
        for (var i = 0; i < Board.Cells.length; i++) {
            var cell: Contracts.iCellProps = Board.Cells[i];
            if (cell.Waiting.length > 0) {
                weight = weight + cell.Weight;
            }
        }
        return weight;
    }
    public static TotalTiles(Cabinet: Contracts.iCabinetProps): number {
        var count = 0;
        for (var i = 0; i < Cabinet.Trays.length; i++) {
            var tray: Contracts.iTrayProps = Cabinet.Trays[i];
            for (var j = 0; j < tray.Tiles.length; j++) {
                var tile: Contracts.iTileProps = tray.Tiles[j];
                count = count + tile.Total;
            }
        }
        return count;
    }
    public static RemainingTiles(Cabinet: Contracts.iCabinetProps): number {
        var count = 0;
        for (var i = 0; i < Cabinet.Trays.length; i++) {
            var tray: Contracts.iTrayProps = Cabinet.Trays[i];
            for (var j = 0; j < tray.Tiles.length; j++) {
                var tile: Contracts.iTileProps = tray.Tiles[j];
                count = count + tile.Remaining;
            }
        }
        return count;
    }
}