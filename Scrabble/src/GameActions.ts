﻿//---------------------------------------------------------------------------------------------
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
import * as Messages from 'Messages';
import * as Indic from 'Indic';
import * as Util from 'Util';
import * as AskBot from 'AskBot';

export class GameActions {
    //Move to Seperate Config File
    static NoWords: number = 5;
    static BotWait: number = 1000;

    static Init(state: Contracts.iGameState, args: Contracts.iArgs): void {
        var players = state.Players.Players;
        var currentPlayer = state.Players.CurrentPlayer;
        state.GameTable.Message = Util.Util.Format(Messages.Messages.YourTurn, [players[currentPlayer].Name]);
        GameActions.Think(state);
    }
    static Pass(state: Contracts.iGameState, args: Contracts.iArgs): void {
        var isValidMove: boolean = GameActions.ValidateMove(state.Board);
        if (!isValidMove) {
            state.InfoBar.Messages.push(Messages.Messages.CrossCells);
            return;
        }
        var hasOrphans: boolean = GameActions.HasOrphans(state);
        if (hasOrphans) {
            state.InfoBar.Messages.push(Messages.Messages.HasOraphans);
            return;
        }
        var hasClusters: boolean = GameActions.HasClusters(state);
        if (hasClusters) {
            state.InfoBar.Messages.push(Messages.Messages.HasIslands);
            return;
        }

        var isValid: boolean = GameActions.ValidateWords(state);
        if (!isValid) {
            return;
        }

        GameActions.ResetTable(state);
        GameActions.AwardClaims(state);
        GameActions.SetScores(state);
        GameActions.SwitchTurn(state);
        GameActions.SaveBoard(state);
        GameActions.Refresh(state);
        GameActions.SetStats(state);
        if (state.GameOver) {
            GameActions.SetWinner(state);
            return;
        }
        GameActions.Think(state);
    }
    static SetWinner(state: Contracts.iGameState) {
        state.ReadOnly = true;
        var winner: Contracts.iPlayer = GameActions.FindWinner(state);
        if (winner == null) {
            state.GameTable.Message = Messages.Messages.MatchTied;
        } else {
            state.GameTable.Message = Util.Util.Format(Messages.Messages.Winner, [winner.Name]);
        }
        state.InfoBar.Messages.push(Util.Util.Format(Messages.Messages.Stats, [state.Stats.EmptyCells, state.Stats.Occupancy.toFixed(2), state.Stats.TotalWords, state.Stats.UnUsed.toFixed(2)]));
        state.InfoBar.Messages.push(Messages.Messages.GameOver);
        state.InfoBar.Messages.push(state.GameTable.Message);
    }
    static SetStats(state: Contracts.iGameState) {
        var stats: Contracts.iBoardsStats = {
            EmptyCells: 0,
            Occupancy: 0,
            TotalWords: 0,
            UnUsed: 0
        };
        stats.TotalWords = GameActions.GetTotalWords(state.Players);
        stats.EmptyCells = GameActions.GetEmptyCells(state.Board);
        stats.Occupancy = (state.Board.Cells.length - stats.EmptyCells) * 100.00 / state.Board.Cells.length;
        stats.UnUsed = state.Cabinet.Remaining * 100.00 / state.Cabinet.Total;
        state.Stats = stats;
    }
    static GetEmptyCells(board: Contracts.iBoardProps): number {
        var tot: number = 0;
        for (var i: number = 0; i < board.Cells.length; i++) {
            var tiles = board.Cells[i].Confirmed.length;
            if (tiles == 0) {
                tot++;
            }
        }
        return tot;
    }
    static GetTotalWords(players: Contracts.iPlayers): number {
        var tot: number = 0;
        for (var i = 0; i < players.Players.length; i++) {
            var player: Contracts.iPlayer = players.Players[i];
            tot = tot + player.Awarded.length;
        }
        return tot;
    }
    static FindWinner(state: Contracts.iGameState): Contracts.iPlayer {
        var maxScore: number = -1;
        var winnerIndex: number = 0;
        for (var i = 0; i < state.Players.Players.length; i++) {
            var player: Contracts.iPlayer = state.Players.Players[i];
            if (player.Score == maxScore) {
                return null;
            }
            if (player.Score > maxScore) {
                maxScore = player.Score;
                winnerIndex = i;
            }
        }
        return state.Players.Players[winnerIndex];
    }
    static Think(state: Contracts.iGameState): void {
        var players = state.Players.Players;
        var currentPlayer = state.Players.CurrentPlayer;
        var isBot: boolean = players[currentPlayer].IsBot;
        state.GameTable.ReadOnly = isBot;
        //Ideally should trigger after completion of Rendering..!!
        if (!isBot) {
            return;
        }
        state.GameTable.Message = Util.Util.Format(Messages.Messages.Thinking, [players[currentPlayer].Name]);
        setTimeout(AskBot.AskBot.NextMove, GameActions.BotWait);
    }
    static BotMoveResponse(state: Contracts.iGameState, response: Contracts.iBotMoveResponse): void {
        var result = response.Result;
        var player: Contracts.iPlayer = state.Players.Players[state.Players.CurrentPlayer];
        if (result == null) {
            state.InfoBar.Messages.push(Util.Util.Format(Messages.Messages.BotNoWords, [response.Effort, player.Name]));
            GameActions.ReDraw(state, {});
            GameActions.Pass(state, {});
            return;
        }
        state.InfoBar.Messages.push(Util.Util.Format(result.WordsCount == 1 ? Messages.Messages.BotEffort : Messages.Messages.BotEffort2, [response.Effort, player.Name, result.WordsCount]));
        for (var i in result.Moves) {
            var Move: Contracts.iBotMove = result.Moves[i];
            var tiles: string[] = Move.Tiles.split(',');
            for (var j in tiles) {
                var tile = tiles[j];
                if (Indic.Indic.HasSyllableSynonym(tile)) {
                    tile = Indic.Indic.GetSyllableSynonym(tile);
                }
                GameActions.ToBoard(state,
                    {
                        Origin: "Tile",
                        Src: tile,
                        TargetCell: Move.Index
                    });
            }
        }
        GameActions.Pass(state, {});
    }
    static BotMove(state: Contracts.iGameState, args: Contracts.iArgs): void {
        var Cells: string[] = [];
        for (var i in state.Board.Cells) {
            var Cell: Contracts.iCellProps = state.Board.Cells[i];
            var arr: string[] = [];
            for (var indx in Cell.Confirmed) {
                var c = Cell.Confirmed[indx];
                if (Indic.Indic.IsSpecialSyllable(c)) {
                    arr = arr.concat(Indic.Indic.GetSyllableTiles(c));
                    continue;
                }
                if (Indic.Indic.IsSpecialSet(c)) {
                    arr.push(Indic.Indic.GetSynonym(c));
                    continue;
                }
                arr.push(c);
            }
            Cells.push(arr.join(','));
        }

        var Vowels: string[] = [];
        var Cosos: string[] = [];
        var Special: string[] = [];

        for (var i in state.GameTable.VowelTray.Tiles) {
            var Tile: Contracts.iTileProps = state.GameTable.VowelTray.Tiles[i];
            Vowels.push(Tile.Text);
        }

        for (var i in state.GameTable.ConsoTray.Tiles) {
            var Tile: Contracts.iTileProps = state.GameTable.ConsoTray.Tiles[i];
            if (Tile.Text.length > 1) {
                Special.push("(" + Indic.Indic.GetSyllableTiles(Tile.Text).join(',') + ") ");
                continue;
            }
            Cosos.push(Tile.Text);
        }

        var Name: string = state.Board.Name;
        var players = state.Players.Players;
        var currentPlayer = state.Players.CurrentPlayer;
        var BotName: string = players[currentPlayer].BotId;
        var reference = Math.floor(Math.random() * 1000).toString();
        var post = {
            "Reference": reference,
            "Name": Name,
            "Bot": BotName,
            "Cells": Cells,
            "Vowels": Vowels.join(' '),
            "Conso": Cosos.join(' '),
            "Special": Special.join(' ')
        };
        AskBot.AskBot.BotMove(post);
    }
    static SaveBoard(state: Contracts.iGameState): void {
        for (var i = 0; i < state.Board.Cells.length; i++) {
            var Cell: Contracts.iCellProps = state.Board.Cells[i];
            Cell.Confirmed = Cell.Confirmed.concat(Cell.Waiting);
            Cell.Waiting = [];
        }
    }
    static Refresh(state: Contracts.iGameState) {
        GameActions.RefreshTrays(state.Cabinet.Trays, state.Cache);
        GameActions.RefreshCabinet(state.Cabinet, state.Cache);
        GameActions.RefreshClaims(state);
    }
    static RefreshClaims(state: Contracts.iGameState): void {
        var Claims: Contracts.iWord[] = GameActions.WordsOnBoard(state.Board, true);
        var playerId: number = state.Players.CurrentPlayer;
        var player: Contracts.iPlayer = state.Players.Players[playerId];
        player.Claimed = Claims;
        state.Players.HasClaims = Claims.length > 0;
        state.GameTable.CanReDraw = !GameActions.HasWaiting(state.Board);
    }
    static HasWaiting(board: Contracts.iBoardProps): boolean {
        var res: boolean = false;
        for (var i = 0; i < board.Cells.length; i++) {
            var cell: Contracts.iCellProps = board.Cells[i];
            if (cell.Waiting.length > 0) {
                res = true;
                break;
            }
        }
        return res;
    }
    static RefreshCabinet(cabinet: Contracts.iCabinetProps, cache: Contracts.iCachedTile): void {
        var remaining = 0;
        var total = 0;
        for (var key in cache) {
            remaining = remaining + cache[key].Remaining;
            total = total + cache[key].Total;
        }
        cabinet.Remaining = remaining;
        cabinet.Total = total;
    }
    static RefreshTrays(trays: Contracts.iTrayProps[], cache: Contracts.iCachedTile): void {
        for (var i = 0; i < trays.length; i++) {
            var tray: Contracts.iTrayProps = trays[i];
            GameActions.RefreshTray(tray, cache);
        }
    }
    static RefreshTray(tray: Contracts.iTrayProps, cache: Contracts.iCachedTile): void {
        for (var j = 0; j < tray.Tiles.length; j++) {
            var tile: Contracts.iTileProps = tray.Tiles[j];
            var text = tile.Text;
            if (cache[text] == null) {
                var synm = Indic.Indic.GetSynonym(text);
                tile.Remaining = cache[synm].Remaining;
                tile.Total = cache[synm].Remaining;
                continue;
            }
            {
                tile.Remaining = cache[text].Remaining;
                tile.Total = cache[text].Remaining;
            }
        }
    }
    static AwardClaims(state: Contracts.iGameState): void {
        var Claims: Contracts.iWord[] = GameActions.WordsOnBoard(state.Board, true);
        var Awarded: Contracts.iWord[] = GameActions.AwardedWords(state);
        for (var key in Claims) {
            var word: Contracts.iWord = Claims[key];
            var isDuplicate: boolean = Util.Util.Contains(word, Awarded);
            if (isDuplicate) {
                word.Score = 1;
            }
        }
        var playerId: number = state.Players.CurrentPlayer;
        var player: Contracts.iPlayer = state.Players.Players[playerId];
        player.Awarded = player.Awarded.concat(Claims);
        player.Claimed = [];
    }
    static ValidateWords(state: Contracts.iGameState): boolean {
        //Actual Word Verification against Word Database
        return true;
    }
    static HasDuplicates(state: Contracts.iGameState, Src: Contracts.iWord[], Compare: Contracts.iWord[]): boolean {
        var res: boolean = false;
        for (var key in Compare) {
            var word: Contracts.iWord = Compare[key];
            var exists: boolean = Util.Util.Contains(word, Src);
            if (exists) {
                state.InfoBar.Messages.push(Util.Util.Format(Messages.Messages.HasDupliates, [word.Text]));
                return true;
            }
        }
        return false;
    }
    static AwardedWords(state: Contracts.iGameState) {
        var Words: Contracts.iWord[] = [];
        for (var i = 0; i < state.Players.Players.length; i++) {
            var player: Contracts.iPlayer = state.Players.Players[i];
            Words = Words.concat(player.Awarded);
        }
        return Words;
    }
    static SetScores(state: Contracts.iGameState): void {
        for (var i = 0; i < state.Players.Players.length; i++) {
            var player: Contracts.iPlayer = state.Players.Players[i];
            var score: number = 0;
            for (var w = 0; w < player.Awarded.length; w++) {
                score += player.Awarded[w].Score;
            }
            if (player.CurrentTurn) {
                if (player.Score == score) {
                    player.NoWords++;
                    state.InfoBar.Messages.push(Util.Util.Format(Messages.Messages.NoWordsAdded, [player.Name, player.NoWords]));
                }
                else { player.NoWords = 0; }
            }
            player.Score = score;
            if (player.NoWords >= GameActions.NoWords) {
                state.InfoBar.Messages.push(Util.Util.Format(Messages.Messages.WhyGameOver, [player.Name, player.NoWords]));
                state.GameOver = true;
            }
        }
    }
    static SwitchTurn(state: Contracts.iGameState): void {
        for (var i = 0; i < state.Players.Players.length; i++) {
            var player: Contracts.iPlayer = state.Players.Players[i];
            player.CurrentTurn = !player.CurrentTurn;
            if (player.CurrentTurn) {
                state.Players.CurrentPlayer = i;
                state.GameTable.Message = Util.Util.Format(Messages.Messages.YourTurn, [player.Name]);
            }
        }
    }
    static ToTray(state: Contracts.iGameState, args: Contracts.iArgs): void {
        if (args.SrcCell == null) {
            //May be Tile dropped on Tile.
            return;
        }
        var cell: Contracts.iCellProps = state.Board.Cells[args.SrcCell];
        if (cell.Waiting.length == 0) {
            return;
        }
        if (cell.Waiting.length > 0) {
            var toRemove: string = cell.Waiting[cell.Waiting.length - 1];
            cell.Waiting.pop();
            cell.Current = Indic.Indic.ToString(cell.Confirmed.concat(cell.Waiting));
            GameActions.Play(state.GameTable, toRemove, 1, true);

            GameActions.SetRemaining(state.Cache, toRemove, 1);
        }
        GameActions.Refresh(state);
    }
    static ToBoardInternal(state: Contracts.iGameState, args: Contracts.iArgs, useSynonyms: boolean): void {
        var src: string = args.Src;
        var tray: Contracts.iTrayProps;
        var tile: Contracts.iTileProps;
        if (args.Origin == "Tile") {
            var remaining = GameActions.GetRemaining(state, src);
            if (remaining == 0) {
                return;
            }
        }

        var cell: Contracts.iCellProps = state.Board.Cells[args.TargetCell];
        var list: string[] = cell.Confirmed.concat(cell.Waiting);
        list.push(src);

        var isValid = Indic.Indic.IsValid(list);
        if (!isValid) {
            //state.InfoBar.Messages.push(Util.Util.Format(Messages.Messages.InvalidMove, [cell.Current, src]));
            if (!useSynonyms) {
                return;
            }
            var synonym = Indic.Indic.GetSynonym(src);
            if (synonym == null) {
                return;
            }
            //state.InfoBar.Messages.push(Util.Util.Format(Messages.Messages.UseSynonym, [cell.Current, src, synonym]));

            var iPos: Contracts.iArgs = {} as Contracts.iArgs;
            iPos.Src = synonym;
            iPos.TargetCell = args.TargetCell;
            iPos.Origin = args.Origin;
            iPos.SrcCell = args.SrcCell;
            GameActions.ToBoardInternal(state, iPos, false);
            return;
        }

        cell.Waiting.push(src);
        list = cell.Confirmed.concat(cell.Waiting);
        cell.Current = Indic.Indic.ToString(list);

        if (args.Origin == "Tile") {

            GameActions.Play(state.GameTable, src, 0, true);
            GameActions.SetRemaining(state.Cache, src, -1);
        }
        if (args.Origin == "Cell") {
            var srcCell: Contracts.iCellProps = state.Board.Cells[args.SrcCell];
            srcCell.Waiting.pop();
            list = srcCell.Confirmed.concat(srcCell.Waiting);
            srcCell.Current = Indic.Indic.ToString(list);
        }
        GameActions.Refresh(state);
    }
    static Play(gameTable: Contracts.iGameTable, src: string, val: number, useSynonym: boolean): void {
        GameActions.PlayInternal(gameTable.VowelTray, src, val, true);
        GameActions.PlayInternal(gameTable.ConsoTray, src, val, true);
    }
    static PlayInternal(tray: Contracts.iTrayProps, src: string, val: number, useSynonym: boolean): void {
        var indx: number = -1;
        for (var i = 0; i < tray.Tiles.length; i++) {
            var tile: Contracts.iTileProps = tray.Tiles[i];
            if (tile.Text != src) {
                continue;
            }
            if (tile.Remaining == val || tile.Total == val) {
                //Ideally both should be equal 0 or 1
                continue;
            }
            tile.Remaining = val;
            tile.Total = val;
            indx = i;
            break; //There could be multiple Tiles with Same Text
        }
        if (indx == -1 && useSynonym) {
            //Try Synonym
            var synonym = Indic.Indic.GetSynonym(src);
            if (synonym == null) {
                return;
            }
            GameActions.PlayInternal(tray, synonym, val, false);
        }
    }
    static ToBoard(state: Contracts.iGameState, args: Contracts.iArgs): void {
        GameActions.ToBoardInternal(state, args, true);
    }
    static GetRemaining(state: Contracts.iGameState, char: string): number {
        var cabinet: Contracts.iCabinetProps = state.Cabinet;
        var cache: Contracts.iCachedTile = state.Cache;
        if (cache[char] == null) {
            var synonym: string = Indic.Indic.GetSynonym(char);
            return cache[synonym].Remaining;
        }
        return cache[char].Remaining;
    }
    static OpenClose(state: Contracts.iGameState, args: Contracts.iArgs) {
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
    static UnConfirmed(Board: Contracts.iBoardProps): number {
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
    static SetRemaining(cache: Contracts.iCachedTile, text: string, incBy: number) {
        if (cache[text] != null) {
            cache[text].Remaining = cache[text].Remaining + incBy;
            return;
        }
        var synonym: string = Indic.Indic.GetSynonym(text);
        cache[synonym].Remaining = cache[synonym].Remaining + incBy;
    }
    static FirstNonEmpty(Cells: Contracts.iCellProps[], Clustered: number[], size: number): number {
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
    static ClusterCells(Cells: Contracts.iCellProps[], first: number, size: number): number[] {
        var List: number[] = [];
        List.push(first);
        {
            var P: Contracts.iPosition = Util.Util.Position(first, size);
            var C: Contracts.iCellProps = Cells[first];
        }
        var curr = 0;
        var found: boolean = true;
        while (found) {
            if (curr >= List.length) {
                break;
            }
            found = false;
            var neighors = Util.Util.FindNeighbors(List[curr], size);
            for (var i = 0; i < neighors.length; i++) {
                var neighbor = neighors[i];
                if (List.indexOf(neighbor) >= 0) {
                    continue;
                }
                found = true;
                var C = Cells[neighbor];
                if (C.Confirmed.length + C.Waiting.length == 0) {
                    continue;
                }
                var P = Util.Util.Position(neighbor, size);
                List.push(neighbor);
            }
            curr++;
        }
        return List;
    }
    static HasClusters(state: Contracts.iGameState): boolean {
        var Board: Contracts.iBoardProps = state.Board;
        var Clustered: number[] = [];
        var clusters = 0;
        while (true) {
            var first = GameActions.FirstNonEmpty(Board.Cells, Clustered, Board.Size);
            if (first == -1) {
                break;
            }
            var List = GameActions.ClusterCells(Board.Cells, first, Board.Size);
            Clustered = Clustered.concat(List);
            clusters++;
        }
        console.log("Clusters found: " + clusters);
        return (clusters > 1);
    }
    static HasOrphans(state: Contracts.iGameState): boolean {
        var orphans: number[] = GameActions.OrphanCells(state.Board);
        for (var i = 0; i < orphans.length; i++) {
            var orphan: number = orphans[i];
            var P: Contracts.iPosition = Util.Util.Position(orphan, state.Board.Size);
            var N: Contracts.iCellProps = state.Board.Cells[orphan];
            state.InfoBar.Messages.push(Util.Util.Format(Messages.Messages.OrphanCell, [(P.X + 1), (P.Y + 1), N.Current]));
        }
        return orphans.length > 0;
    }
    static OrphanCells(Board: Contracts.iBoardProps): number[] {
        var oraphans: number[] = [];
        for (var i = 0; i < Board.Cells.length; i++) {
            var Cell: Contracts.iCellProps = Board.Cells[i];
            if (Cell.Waiting.length + Cell.Confirmed.length == 0) {
                continue;
            }
            var neighors: number[] = Util.Util.FindNeighbors(i, Board.Size);
            var valid: boolean = false;
            for (var j = 0; j < neighors.length; j++) {
                var neighbor: number = neighors[j];
                var N: Contracts.iCellProps = Board.Cells[neighbor];
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
    static WordsOnColumn(Board: Contracts.iBoardProps, i: number, claimsOnly: boolean): Contracts.iWord[] {
        return GameActions.FindWords(Board, 'C', i, claimsOnly);
    }
    static WordsOnRow(Board: Contracts.iBoardProps, i: number, claimsOnly: boolean): Contracts.iWord[] {
        return GameActions.FindWords(Board, 'R', i, claimsOnly);
    }
    static FindWords(Board: Contracts.iBoardProps, option: string, r: number, claimsOnly: boolean): Contracts.iWord[] {
        var Words: Contracts.iWord[] = [];
        var pending = "";
        var cnt = 0;
        var waiting = false;
        var score = 0;
        for (var i = 0; i < Board.Size; i++) {
            var index = -1;
            switch (option) {
                case 'R':
                    index = Util.Util.Abs(r, i, Board.Size);
                    break;
                case 'C':
                    index = Util.Util.Abs(i, r, Board.Size);
                    break;
            }
            var cell = Board.Cells[index];

            if (cell.Waiting.length + cell.Confirmed.length != 0) {
                pending += cell.Current;
                cnt++;
                if (cell.Waiting.length > 0) {
                    waiting = true;
                }
                score += cell.Weight;
                continue;
            }

            if (pending != "" && cell.Waiting.length + cell.Confirmed.length == 0) {
                if (cnt > 1) {
                    var word = pending + cell.Current;
                    var W: Contracts.iWord = { Text: word, Waiting: waiting, Score: score };
                    if ((claimsOnly && waiting) || !claimsOnly) {
                        Words.push(W);
                    }
                }
                pending = "";
                cnt = 0;
                waiting = false;
                score = 0;
                continue;
            }
        }
        if (cnt > 1) {
            var word = pending;
            var W: Contracts.iWord = { Text: word, Waiting: waiting, Score: score };
            if ((claimsOnly && waiting) || !claimsOnly) {
                Words.push(W);
            }
        }
        return Words;
    }
    static ValidateMove(Board: Contracts.iBoardProps): boolean {
        var Cells: Contracts.iCellProps[] = Board.Cells;
        var size: number = Board.Size;
        var cnt = 0;
        var rows = 0;
        var columns = 0;
        var First: Contracts.iPosition = {} as Contracts.iPosition;
        for (var i = 0; i < size * size; i++) {
            var C = Cells[i];
            if (C.Waiting.length == 0) {
                continue;
            }
            if (C.Confirmed.length + C.Waiting.length == 0) {
                continue;
            }
            if (cnt == 0) {
                First = Util.Util.Position(i, size);
                cnt++;
                continue;
            }
            var Current = Util.Util.Position(i, size);
            if (Current.X != First.X) {
                rows++;
            }
            if (Current.Y != First.Y) {
                columns++;
            }
        }

        if (rows == 0 || columns == 0) {
            return true;
        }
        return false;
    }
    static WordsOnBoard(Board: Contracts.iBoardProps, claimsOnly: boolean): Contracts.iWord[] {
        var Words: Contracts.iWord[] = [];
        for (var i = 0; i < Board.Size; i++) {
            var R = GameActions.WordsOnRow(Board, i, claimsOnly);
            var C = GameActions.WordsOnColumn(Board, i, claimsOnly);
            Words = Words.concat(R);
            Words = Words.concat(C);
        }
        return Words;
    }
    //Consider re-writting the following. Duplicate code.
    static ReDraw(state: Contracts.iGameState, args: Contracts.iArgs): void {
        {
            var available: string[] = GameActions.DrawVowelTiles(state.Cache, state.GameTable.MaxVowels);
            var tray: Contracts.iTrayProps = GameActions.SetTableTray(available, "Vowels");
            state.GameTable.VowelTray = tray;
        }
        {
            var available = GameActions.DrawConsoTiles(state.Cache, state.GameTable.MaxOnTable - state.GameTable.MaxVowels);
            var tray = GameActions.SetTableTray(available, "Conso");
            state.GameTable.ConsoTray = tray;
        }
    }
    static ResetVowelsTray(state: Contracts.iGameState): void {
        var gameTable: Contracts.iGameTable = state.GameTable;
        var vtray: Contracts.iTrayProps = state.GameTable.VowelTray;
        var unMoved: string[] = GameActions.UnMovedTiles(vtray);
        var vCount = 0;
        for (var i = 0; i < unMoved.length; i++) {
            var prop = unMoved[i];
            if (Indic.Indic.IsVowel(prop) || Indic.Indic.IsSunnaSet(prop)) {
                vCount++;
            }
        }
        var fresh = GameActions.DrawVowelTiles(state.Cache, gameTable.MaxVowels - vCount);
        var available = unMoved.concat(fresh);
        state.GameTable.VowelTray = GameActions.SetTableTray(available, "Vowels");
    }
    static ResetConsoTray(state: Contracts.iGameState): void {
        var gameTable: Contracts.iGameTable = state.GameTable;
        var ctray: Contracts.iTrayProps = state.GameTable.ConsoTray;
        var unMoved: string[] = GameActions.UnMovedTiles(ctray);
        var vCount = 0;
        for (var i = 0; i < unMoved.length; i++) {
            var prop = unMoved[i];
            if (Indic.Indic.IsConsonent(prop)) {
                vCount++;
            }
        }
        var fresh = GameActions.DrawConsoTiles(state.Cache, (gameTable.MaxOnTable - gameTable.MaxVowels) - vCount);
        var available = unMoved.concat(fresh);
        state.GameTable.ConsoTray = GameActions.SetTableTray(available, "Conso");
    }
    static ResetTable(state: Contracts.iGameState): void {
        GameActions.ResetVowelsTray(state);
        GameActions.ResetConsoTray(state);
    }
    static UnMovedTiles(tray: Contracts.iTrayProps): string[] {
        var old: string[] = [];
        for (var i = 0; i < tray.Tiles.length; i++) {
            if (tray.Tiles[i].Remaining != 0) {
                old.push(tray.Tiles[i].Text);
            }
        }
        return old;
    }
    static SetTableTray(picked: string[], id: string): Contracts.iTrayProps {
        var tray: Contracts.iTrayProps = ({} as any) as Contracts.iTrayProps;
        tray.Id = id;
        tray.key = tray.Id;
        tray.className = "tray";
        tray.Title = "Game Table";
        tray.Show = true;
        tray.Disabled = false;
        tray.ReadOnly = false;
        tray.Index = -1;
        tray.Tiles = [];

        var index = 0;
        for (var j = 0; j < picked.length; j++) {
            var prop: Contracts.iTileProps = ({} as any) as Contracts.iTileProps;
            prop.Id = "S_" + (index + 1).toString();
            prop.key = prop.Id;
            prop.Text = picked[j];
            prop.Remaining = 1;
            prop.Total = 1;
            prop.Index = j;
            prop.TrayIndex = -1;
            prop.ReadOnly = false;
            tray.Tiles.push(prop);
            index++;
        }
        return tray;
    }
    static AvailableVowels(cache: Contracts.iCachedTile): string[] {
        var available: string[] = [];
        for (var prop in cache) {
            if ((Indic.Indic.IsVowel(prop) || Indic.Indic.IsSunnaSet(prop)) && cache[prop].Remaining > 0) {
                for (var i = 0; i < cache[prop].Remaining; i++) {
                    available.push(prop)
                }
            }
        }
        return available;
    }
    static AvailableConso(cache: Contracts.iCachedTile): string[] {
        var available: string[] = [];
        for (var prop in cache) {
            if (Indic.Indic.IsConsonent(prop) && cache[prop].Remaining > 0) {
                for (var i = 0; i < cache[prop].Remaining; i++) {
                    available.push(prop)
                }
            }
        }
        return available;
    }
    static DrawVowelTiles(cache: Contracts.iCachedTile, maxVowels: number): string[] {
        var vowels = GameActions.AvailableVowels(cache);
        var pickedVowels = Util.Util.Draw(vowels, maxVowels);
        return pickedVowels;
    }
    static DrawConsoTiles(cache: Contracts.iCachedTile, maxConsos: number): string[] {
        var conso = GameActions.AvailableConso(cache);
        var pickedConso = Util.Util.Draw(conso, maxConsos);
        return pickedConso;
    }
    //
}