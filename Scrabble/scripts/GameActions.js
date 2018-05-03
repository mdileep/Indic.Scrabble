define(["require", "exports", "react", "react-dom", 'Contracts', 'Messages', 'Indic', 'Util', 'AskBot', 'GameStore', 'GameRoom'], function (require, exports, React, ReactDOM, Contracts, Messages, Indic, Util, AskBot, GS, Game) {
    "use strict";
    var GameActions = (function () {
        function GameActions() {
        }
        GameActions.Init = function (state, args) {
            GameActions.Render();
            var players = state.Players.Players;
            var currentPlayer = state.Players.CurrentPlayer;
            state.GameTable.Message = Util.Util.Format(Messages.Messages.YourTurn, [players[currentPlayer].Name]);
            setTimeout(GameActions.PinchPlayer, GameActions.PinchWait);
        };
        GameActions.PinchPlayer = function () {
            GS.GameStore.Dispatch({
                type: Contracts.Actions.PunchAndPick,
                args: {}
            });
        };
        GameActions.PunchAndPick = function (state, args) {
            if (state.GameOver) {
                return;
            }
            var players = state.Players.Players;
            var currentPlayer = state.Players.CurrentPlayer;
            var isBot = players[currentPlayer].IsBot;
            state.GameTable.ReadOnly = isBot;
            if (!isBot) {
                return;
            }
            state.GameTable.Message = Util.Util.Format(Messages.Messages.Thinking, [players[currentPlayer].Name]);
            setTimeout(AskBot.AskBot.NextMove, GameActions.BotWait);
        };
        GameActions.Render = function () {
            if (console) {
                console.log("OnGameRender");
            }
            var rootEl = document.getElementById('root');
            var state = GS.GameStore.GetState();
            var left = React.createElement(Game.default, state);
            return ReactDOM.render(left, rootEl);
        };
        GameActions.BotLoaded = function (file) {
            var players = Config.Players;
            var cnt = 0;
            for (var i = 0; i < players.length; i++) {
                var player = players[i];
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
            GS.GameStore.Dispatch({
                type: Contracts.Actions.Init,
                args: {}
            });
        };
        GameActions.Pass = function (state, args) {
            var isValidMove = GameActions.ValidateMove(state.Board);
            if (!isValidMove) {
                state.InfoBar.Messages.push(Messages.Messages.CrossCells);
                return;
            }
            var hasOrphans = GameActions.HasOrphans(state);
            if (hasOrphans) {
                state.InfoBar.Messages.push(Messages.Messages.HasOraphans);
                return;
            }
            var hasClusters = GameActions.HasClusters(state);
            if (hasClusters) {
                state.InfoBar.Messages.push(Messages.Messages.HasIslands);
                return;
            }
            var isValid = AskBot.AskReferee.ValidateWords(state.Board);
            if (!isValid) {
                return;
            }
            GameActions.ResetTable(state);
            GameActions.AwardClaims(state);
            GameActions.SetScores(state);
            GameActions.SaveBoard(state);
            GameActions.SwitchTurn(state);
            GameActions.Refresh(state);
            GameActions.SetStats(state);
            if (state.GameOver) {
                GameActions.SetWinner(state);
                return;
            }
            setTimeout(GameActions.PinchPlayer, GameActions.PinchWait);
        };
        GameActions.SetWinner = function (state) {
            state.ReadOnly = true;
            var winner = GameActions.FindWinner(state);
            if (winner == null) {
                state.GameTable.Message = Messages.Messages.MatchTied;
            }
            else {
                state.GameTable.Message = Util.Util.Format(Messages.Messages.Winner, [winner.Name]);
            }
            state.InfoBar.Messages.push(Util.Util.Format(Messages.Messages.Stats, [state.Stats.EmptyCells, state.Stats.Occupancy.toFixed(2), state.Stats.TotalWords, state.Stats.UnUsed.toFixed(2)]));
            state.InfoBar.Messages.push(Messages.Messages.GameOver);
            state.InfoBar.Messages.push(state.GameTable.Message);
        };
        GameActions.SetStats = function (state) {
            var stats = {
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
        };
        GameActions.GetEmptyCells = function (board) {
            var tot = 0;
            for (var i = 0; i < board.Cells.length; i++) {
                var tiles = board.Cells[i].Confirmed.length;
                if (tiles == 0) {
                    tot++;
                }
            }
            return tot;
        };
        GameActions.GetTotalWords = function (players) {
            var tot = 0;
            for (var i = 0; i < players.Players.length; i++) {
                var player = players.Players[i];
                tot = tot + player.Awarded.length;
            }
            return tot;
        };
        GameActions.FindWinner = function (state) {
            var maxScore = -1;
            var winnerIndex = 0;
            for (var i = 0; i < state.Players.Players.length; i++) {
                var player = state.Players.Players[i];
                if (player.Score == maxScore) {
                    return null;
                }
                if (player.Score > maxScore) {
                    maxScore = player.Score;
                    winnerIndex = i;
                }
            }
            return state.Players.Players[winnerIndex];
        };
        GameActions.BotMoveResponse = function (state, response) {
            var result = response.Result;
            var player = state.Players.Players[state.Players.CurrentPlayer];
            if (result == null) {
                state.InfoBar.Messages.push(Util.Util.Format(Messages.Messages.BotNoWords, [response.Effort, player.Name]));
                GameActions.ReDraw(state, {});
                GameActions.Pass(state, {});
                return;
            }
            state.InfoBar.Messages.push(Util.Util.Format(result.WordsCount == 1 ? Messages.Messages.BotEffort : Messages.Messages.BotEffort2, [response.Effort, player.Name, result.WordsCount]));
            for (var i in result.Moves) {
                var Move = result.Moves[i];
                var tiles = Move.Tiles.split(',');
                for (var j in tiles) {
                    var tile = tiles[j];
                    if (Indic.Indic.HasSyllableSynonym(tile)) {
                        tile = Indic.Indic.GetSyllableSynonym(tile);
                    }
                    GameActions.ToBoard(state, {
                        Origin: "Tile",
                        Src: tile,
                        TargetCell: Move.Index
                    });
                }
            }
            GameActions.Pass(state, {});
        };
        GameActions.BotMove = function (state, args) {
            var Cells = [];
            for (var i in state.Board.Cells) {
                var Cell = state.Board.Cells[i];
                var arr = [];
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
            var Vowels = [];
            var Cosos = [];
            var Special = [];
            for (var i in state.GameTable.VowelTray.Tiles) {
                var Tile = state.GameTable.VowelTray.Tiles[i];
                Vowels.push(Tile.Text);
            }
            for (var i in state.GameTable.ConsoTray.Tiles) {
                var Tile = state.GameTable.ConsoTray.Tiles[i];
                if (Tile.Text.length > 1) {
                    Special.push("(" + Indic.Indic.GetSyllableTiles(Tile.Text).join(',') + ") ");
                    continue;
                }
                Cosos.push(Tile.Text);
            }
            var Name = state.Board.Name;
            var players = state.Players.Players;
            var currentPlayer = state.Players.CurrentPlayer;
            var BotName = players[currentPlayer].BotId;
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
        };
        GameActions.SaveBoard = function (state) {
            for (var i = 0; i < state.Board.Cells.length; i++) {
                var Cell = state.Board.Cells[i];
                Cell.Confirmed = Cell.Confirmed.concat(Cell.Waiting);
                Cell.Waiting = [];
            }
        };
        GameActions.Refresh = function (state) {
            GameActions.RefreshTrays(state.Cabinet.Trays, state.Cache);
            GameActions.RefreshCabinet(state.Cabinet, state.Cache);
            GameActions.RefreshClaims(state);
        };
        GameActions.RefreshClaims = function (state) {
            var Claims = GameActions.WordsOnBoard(state.Board, true);
            var playerId = state.Players.CurrentPlayer;
            var player = state.Players.Players[playerId];
            player.Claimed = Claims;
            state.Players.HasClaims = Claims.length > 0;
            state.GameTable.CanReDraw = !GameActions.HasWaiting(state.Board);
        };
        GameActions.HasWaiting = function (board) {
            var res = false;
            for (var i = 0; i < board.Cells.length; i++) {
                var cell = board.Cells[i];
                if (cell.Waiting.length > 0) {
                    res = true;
                    break;
                }
            }
            return res;
        };
        GameActions.RefreshCabinet = function (cabinet, cache) {
            var remaining = 0;
            var total = 0;
            for (var key in cache) {
                remaining = remaining + cache[key].Remaining;
                total = total + cache[key].Total;
            }
            cabinet.Remaining = remaining;
            cabinet.Total = total;
        };
        GameActions.RefreshTrays = function (trays, cache) {
            for (var i = 0; i < trays.length; i++) {
                var tray = trays[i];
                GameActions.RefreshTray(tray, cache);
            }
        };
        GameActions.RefreshTray = function (tray, cache) {
            for (var j = 0; j < tray.Tiles.length; j++) {
                var tile = tray.Tiles[j];
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
        };
        GameActions.AwardClaims = function (state) {
            var Claims = GameActions.WordsOnBoard(state.Board, true);
            var Awarded = GameActions.AwardedWords(state);
            for (var key in Claims) {
                var word = Claims[key];
                var isDuplicate = Util.Util.Contains(word, Awarded);
                if (isDuplicate) {
                    word.Score = 1;
                }
            }
            var playerId = state.Players.CurrentPlayer;
            var player = state.Players.Players[playerId];
            player.Awarded = player.Awarded.concat(Claims);
            player.Claimed = [];
        };
        GameActions.HasDuplicates = function (state, Src, Compare) {
            var res = false;
            for (var key in Compare) {
                var word = Compare[key];
                var exists = Util.Util.Contains(word, Src);
                if (exists) {
                    state.InfoBar.Messages.push(Util.Util.Format(Messages.Messages.HasDupliates, [word.Text]));
                    return true;
                }
            }
            return false;
        };
        GameActions.AwardedWords = function (state) {
            var Words = [];
            for (var i = 0; i < state.Players.Players.length; i++) {
                var player = state.Players.Players[i];
                Words = Words.concat(player.Awarded);
            }
            return Words;
        };
        GameActions.SetScores = function (state) {
            for (var i = 0; i < state.Players.Players.length; i++) {
                var player = state.Players.Players[i];
                var score = 0;
                for (var w = 0; w < player.Awarded.length; w++) {
                    score += player.Awarded[w].Score;
                }
                if (player.CurrentTurn) {
                    if (player.Score == score) {
                        player.NoWords++;
                        state.InfoBar.Messages.push(Util.Util.Format(Messages.Messages.NoWordsAdded, [player.Name, player.NoWords]));
                    }
                    else {
                        player.NoWords = 0;
                    }
                }
                player.Score = score;
                if (player.NoWords >= GameActions.NoWords) {
                    state.InfoBar.Messages.push(Util.Util.Format(Messages.Messages.WhyGameOver, [player.Name, player.NoWords]));
                    state.GameOver = true;
                }
            }
        };
        GameActions.SwitchTurn = function (state) {
            for (var i = 0; i < state.Players.Players.length; i++) {
                var player = state.Players.Players[i];
                player.CurrentTurn = !player.CurrentTurn;
                if (player.CurrentTurn) {
                    state.Players.CurrentPlayer = i;
                    state.GameTable.Message = Util.Util.Format(Messages.Messages.YourTurn, [player.Name]);
                }
            }
        };
        GameActions.ToTray = function (state, args) {
            if (args.SrcCell == null) {
                return;
            }
            var cell = state.Board.Cells[args.SrcCell];
            if (cell.Waiting.length == 0) {
                return;
            }
            if (cell.Waiting.length > 0) {
                var toRemove = cell.Waiting[cell.Waiting.length - 1];
                cell.Waiting.pop();
                cell.Current = Indic.Indic.ToString(cell.Confirmed.concat(cell.Waiting));
                GameActions.Play(state.GameTable, toRemove, 1, true);
                GameActions.SetRemaining(state.Cache, toRemove, 1);
            }
            GameActions.Refresh(state);
        };
        GameActions.ToBoardInternal = function (state, args, useSynonyms) {
            var src = args.Src;
            var tray;
            var tile;
            if (args.Origin == "Tile") {
                var remaining = GameActions.GetRemaining(state, src);
                if (remaining == 0) {
                    return;
                }
            }
            var cell = state.Board.Cells[args.TargetCell];
            var list = cell.Confirmed.concat(cell.Waiting);
            list.push(src);
            var isValid = Indic.Indic.IsValid(list);
            if (!isValid) {
                if (!useSynonyms) {
                    return;
                }
                var synonym = Indic.Indic.GetSynonym(src);
                if (synonym == null) {
                    return;
                }
                var iPos = {};
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
                var srcCell = state.Board.Cells[args.SrcCell];
                srcCell.Waiting.pop();
                list = srcCell.Confirmed.concat(srcCell.Waiting);
                srcCell.Current = Indic.Indic.ToString(list);
            }
            GameActions.Refresh(state);
        };
        GameActions.Play = function (gameTable, src, val, useSynonym) {
            GameActions.PlayInternal(gameTable.VowelTray, src, val, true);
            GameActions.PlayInternal(gameTable.ConsoTray, src, val, true);
        };
        GameActions.PlayInternal = function (tray, src, val, useSynonym) {
            var indx = -1;
            for (var i = 0; i < tray.Tiles.length; i++) {
                var tile = tray.Tiles[i];
                if (tile.Text != src) {
                    continue;
                }
                if (tile.Remaining == val || tile.Total == val) {
                    continue;
                }
                tile.Remaining = val;
                tile.Total = val;
                indx = i;
                break;
            }
            if (indx == -1 && useSynonym) {
                var synonym = Indic.Indic.GetSynonym(src);
                if (synonym == null) {
                    return;
                }
                GameActions.PlayInternal(tray, synonym, val, false);
            }
        };
        GameActions.ToBoard = function (state, args) {
            GameActions.ToBoardInternal(state, args, true);
        };
        GameActions.GetRemaining = function (state, char) {
            var cabinet = state.Cabinet;
            var cache = state.Cache;
            if (cache[char] == null) {
                var synonym = Indic.Indic.GetSynonym(char);
                return cache[synonym].Remaining;
            }
            return cache[char].Remaining;
        };
        GameActions.OpenClose = function (state, args) {
            var tray = state.Cabinet.Trays[args.TrayIndex];
            tray.Show = !tray.Show;
            var cnt = 0;
            var last = -1;
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
            }
            else {
                for (var i = 0; i < state.Cabinet.Trays.length; i++) {
                    state.Cabinet.Trays[i].Disabled = false;
                }
            }
        };
        GameActions.UnConfirmed = function (Board) {
            var weight = 0;
            for (var i = 0; i < Board.Cells.length; i++) {
                var cell = Board.Cells[i];
                if (cell.Waiting.length > 0) {
                    weight = weight + cell.Weight;
                }
            }
            return weight;
        };
        GameActions.SetRemaining = function (cache, text, incBy) {
            if (cache[text] != null) {
                cache[text].Remaining = cache[text].Remaining + incBy;
                return;
            }
            var synonym = Indic.Indic.GetSynonym(text);
            cache[synonym].Remaining = cache[synonym].Remaining + incBy;
        };
        GameActions.FirstNonEmpty = function (Cells, Clustered, size) {
            var first = -1;
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
        };
        GameActions.ClusterCells = function (Cells, first, size) {
            var List = [];
            List.push(first);
            {
                var P = Util.Util.Position(first, size);
                var C = Cells[first];
            }
            var curr = 0;
            var found = true;
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
        };
        GameActions.HasClusters = function (state) {
            var Board = state.Board;
            var Clustered = [];
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
        };
        GameActions.HasOrphans = function (state) {
            var orphans = GameActions.OrphanCells(state.Board);
            for (var i = 0; i < orphans.length; i++) {
                var orphan = orphans[i];
                var P = Util.Util.Position(orphan, state.Board.Size);
                var N = state.Board.Cells[orphan];
                state.InfoBar.Messages.push(Util.Util.Format(Messages.Messages.OrphanCell, [(P.X + 1), (P.Y + 1), N.Current]));
            }
            return orphans.length > 0;
        };
        GameActions.OrphanCells = function (Board) {
            var oraphans = [];
            for (var i = 0; i < Board.Cells.length; i++) {
                var Cell = Board.Cells[i];
                if (Cell.Waiting.length + Cell.Confirmed.length == 0) {
                    continue;
                }
                var neighors = Util.Util.FindNeighbors(i, Board.Size);
                var valid = false;
                for (var j = 0; j < neighors.length; j++) {
                    var neighbor = neighors[j];
                    var N = Board.Cells[neighbor];
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
        };
        GameActions.WordsOnColumn = function (Board, i, claimsOnly) {
            return GameActions.FindWords(Board, 'C', i, claimsOnly);
        };
        GameActions.WordsOnRow = function (Board, i, claimsOnly) {
            return GameActions.FindWords(Board, 'R', i, claimsOnly);
        };
        GameActions.FindWords = function (Board, option, r, claimsOnly) {
            var Words = [];
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
                        var W = { Text: word, Waiting: waiting, Score: score };
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
                var W = { Text: word, Waiting: waiting, Score: score };
                if ((claimsOnly && waiting) || !claimsOnly) {
                    Words.push(W);
                }
            }
            return Words;
        };
        GameActions.ValidateMove = function (Board) {
            var Cells = Board.Cells;
            var size = Board.Size;
            var cnt = 0;
            var rows = 0;
            var columns = 0;
            var First = {};
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
        };
        GameActions.WordsOnBoard = function (Board, claimsOnly) {
            var Words = [];
            for (var i = 0; i < Board.Size; i++) {
                var R = GameActions.WordsOnRow(Board, i, claimsOnly);
                var C = GameActions.WordsOnColumn(Board, i, claimsOnly);
                Words = Words.concat(R);
                Words = Words.concat(C);
            }
            return Words;
        };
        GameActions.ReDraw = function (state, args) {
            {
                var available = GameActions.DrawVowelTiles(state.Cache, state.GameTable.MaxVowels);
                var tray = GameActions.SetTableTray(available, "Vowels");
                state.GameTable.VowelTray = tray;
            }
            {
                var available = GameActions.DrawConsoTiles(state.Cache, state.GameTable.MaxOnTable - state.GameTable.MaxVowels);
                var tray = GameActions.SetTableTray(available, "Conso");
                state.GameTable.ConsoTray = tray;
            }
        };
        GameActions.ResetVowelsTray = function (state) {
            var gameTable = state.GameTable;
            var vtray = state.GameTable.VowelTray;
            var unMoved = GameActions.UnMovedTiles(vtray);
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
        };
        GameActions.ResetConsoTray = function (state) {
            var gameTable = state.GameTable;
            var ctray = state.GameTable.ConsoTray;
            var unMoved = GameActions.UnMovedTiles(ctray);
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
        };
        GameActions.ResetTable = function (state) {
            GameActions.ResetVowelsTray(state);
            GameActions.ResetConsoTray(state);
        };
        GameActions.UnMovedTiles = function (tray) {
            var old = [];
            for (var i = 0; i < tray.Tiles.length; i++) {
                if (tray.Tiles[i].Remaining != 0) {
                    old.push(tray.Tiles[i].Text);
                }
            }
            return old;
        };
        GameActions.SetTableTray = function (picked, id) {
            var tray = {};
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
                var prop = {};
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
        };
        GameActions.AvailableVowels = function (cache) {
            var available = [];
            for (var prop in cache) {
                if ((Indic.Indic.IsVowel(prop) || Indic.Indic.IsSunnaSet(prop)) && cache[prop].Remaining > 0) {
                    for (var i = 0; i < cache[prop].Remaining; i++) {
                        available.push(prop);
                    }
                }
            }
            return available;
        };
        GameActions.AvailableConso = function (cache) {
            var available = [];
            for (var prop in cache) {
                if (Indic.Indic.IsConsonent(prop) && cache[prop].Remaining > 0) {
                    for (var i = 0; i < cache[prop].Remaining; i++) {
                        available.push(prop);
                    }
                }
            }
            return available;
        };
        GameActions.DrawVowelTiles = function (cache, maxVowels) {
            var vowels = GameActions.AvailableVowels(cache);
            var pickedVowels = Util.Util.Draw(vowels, maxVowels);
            return pickedVowels;
        };
        GameActions.DrawConsoTiles = function (cache, maxConsos) {
            var conso = GameActions.AvailableConso(cache);
            var pickedConso = Util.Util.Draw(conso, maxConsos);
            return pickedConso;
        };
        GameActions.NoWords = 5;
        GameActions.BotWait = 1000;
        GameActions.PinchWait = 300;
        return GameActions;
    }());
    exports.GameActions = GameActions;
});
