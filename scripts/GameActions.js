define(["require", "exports", 'Messages', 'Indic', 'Util'], function (require, exports, Messages, Indic, Util) {
    "use strict";
    var GameActions = (function () {
        function GameActions() {
        }
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
            var isValid = GameActions.ValidateWords(state);
            if (!isValid) {
                return;
            }
            GameActions.AwardClaims(state);
            GameActions.SetScores(state);
            GameActions.SwitchTurn(state);
            GameActions.SaveBoard(state);
        };
        GameActions.SaveBoard = function (state) {
            for (var i = 0; i < state.Board.Cells.length; i++) {
                var Cell = state.Board.Cells[i];
                Cell.Confirmed = Cell.Confirmed.concat(Cell.Waiting);
                Cell.Waiting = [];
            }
        };
        GameActions.Refresh = function (state) {
            GameActions.RefreshTiles(state.Cabinet);
            GameActions.RefreshClaims(state);
        };
        GameActions.RefreshClaims = function (state) {
            var Claims = GameActions.WordsOnBoard(state.Board, true);
            var playerId = state.Players.CurrentPlayer;
            var player = state.Players.Players[playerId];
            player.Claimed = Claims;
        };
        GameActions.RefreshTiles = function (cabinet) {
            var cache = cabinet.Cache;
            for (var i = 0; i < cabinet.Trays.length; i++) {
                var tray = cabinet.Trays[i];
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
            }
            var remaining = 0;
            var total = 0;
            for (var key in cache) {
                remaining = remaining + cache[key].Remaining;
                total = total + cache[key].Total;
            }
            cabinet.Cache = cache;
            cabinet.Remaining = remaining;
            cabinet.Total = total;
        };
        GameActions.AwardClaims = function (state) {
            var Claims = GameActions.WordsOnBoard(state.Board, true);
            var playerId = state.Players.CurrentPlayer;
            var player = state.Players.Players[playerId];
            player.Awarded = player.Awarded.concat(Claims);
            player.Claimed = [];
        };
        GameActions.ValidateWords = function (state) {
            var ClaimedWords = GameActions.WordsOnBoard(state.Board, true);
            var AllAwarded = GameActions.AwardedWords(state);
            var player = state.Players.CurrentPlayer;
            state.Players.Players[player].Claimed = ClaimedWords;
            var hasDuplciates = GameActions.HasDuplicates(state, AllAwarded, ClaimedWords);
            if (hasDuplciates) {
                return false;
            }
            return true;
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
                player.Score = score;
            }
        };
        GameActions.SwitchTurn = function (state) {
            for (var i = 0; i < state.Players.Players.length; i++) {
                var player = state.Players.Players[i];
                player.CurrentTurn = !player.CurrentTurn;
                if (player.CurrentTurn) {
                    state.Players.CurrentPlayer = i;
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
                GameActions.SetRemaining(state.Cabinet, toRemove, 1);
            }
            GameActions.Refresh(state);
        };
        GameActions.ToBoardInternal = function (state, args, useSynonyms) {
            var src = args.Src;
            var tray;
            var tile;
            if (args.Origin == "Tile") {
                var remaining = GameActions.GetRemaining(state.Cabinet, src);
                if (remaining == 0) {
                    return;
                }
            }
            var cell = state.Board.Cells[args.TargetCell];
            var list = cell.Confirmed.concat(cell.Waiting);
            list.push(src);
            var isValid = Indic.Indic.IsValid(list);
            if (!isValid) {
                state.InfoBar.Messages.push(Util.Util.Format(Messages.Messages.InvalidMove, [cell.Current, src]));
                if (!useSynonyms) {
                    return;
                }
                var synonym = Indic.Indic.GetSynonym(src);
                if (synonym == null) {
                    return;
                }
                state.InfoBar.Messages.push(Util.Util.Format(Messages.Messages.UseSynonym, [cell.Current, src, synonym]));
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
                GameActions.SetRemaining(state.Cabinet, src, -1);
            }
            if (args.Origin == "Cell") {
                var srcCell = state.Board.Cells[args.SrcCell];
                srcCell.Waiting.pop();
                list = srcCell.Confirmed.concat(srcCell.Waiting);
                srcCell.Current = Indic.Indic.ToString(list);
            }
            GameActions.Refresh(state);
        };
        GameActions.ToBoard = function (state, args) {
            GameActions.ToBoardInternal(state, args, true);
        };
        GameActions.GetRemaining = function (cabinet, char) {
            var cache = cabinet.Cache;
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
        GameActions.SetRemaining = function (Cabinet, text, incBy) {
            var cache = Cabinet.Cache;
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
                        console.log(word + (W.Waiting ? " [YES]" : ""));
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
                console.log(word + (W.Waiting ? " [YES]" : ""));
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
        return GameActions;
    }());
    exports.GameActions = GameActions;
});
