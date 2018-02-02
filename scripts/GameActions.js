define(["require", "exports", 'Indic'], function (require, exports, Indic) {
    "use strict";
    var GameActions = (function () {
        function GameActions() {
        }
        GameActions.Pass = function (state, args) {
            var isValidMove = GameActions.ValidateMove(state.Board);
            if (!isValidMove) {
                state.InfoBar.Messages.push(Indic.Messages.CrossCells);
                return;
            }
            var hasOrphans = GameActions.HasOrphans(state);
            if (hasOrphans) {
                state.InfoBar.Messages.push(Indic.Messages.HasOraphans);
                return;
            }
            var hasClusters = GameActions.HasClusters(state);
            if (hasClusters) {
                state.InfoBar.Messages.push(Indic.Messages.HasIslands);
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
        GameActions.RefreshClaims = function (state) {
            var Claims = GameActions.WordsOnBoard(state.Board, true);
            var playerId = state.Players.CurrentPlayer;
            var player = state.Players.Players[playerId];
            debugger;
            player.Claimed = Claims;
        };
        GameActions.AwardClaims = function (state) {
            var Claims = GameActions.WordsOnBoard(state.Board, true);
            var playerId = state.Players.CurrentPlayer;
            var player = state.Players.Players[playerId];
            player.Awarded = player.Awarded.concat(Claims);
            player.Claimed = [];
        };
        GameActions.ValidateWords = function (state) {
            var Words = GameActions.WordsOnBoard(state.Board, true);
            var player = state.Players.CurrentPlayer;
            state.Players.Players[player].Claimed = Words;
            return true;
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
            var cell = state.Board.Cells[args.Index];
            if (cell.Last == cell.Current) {
                return;
            }
            if (cell.Waiting.length > 0) {
                var toRemove = cell.Waiting[cell.Waiting.length - 1];
                cell.Waiting.pop();
                cell.Current = Indic.Indic.Merge(cell.Confirmed.concat(cell.Waiting));
                var iPos = GameActions.FindTile(state, toRemove);
                var group = state.Cabinet.Trays[iPos.TrayIndex];
                var tile = group.Tiles[iPos.TileIndex];
                tile.Remaining++;
                state.Cabinet.Remaining++;
            }
            GameActions.RefreshClaims(state);
        };
        GameActions.ToBoardInternal = function (state, args, useSynonyms) {
            var tray = state.Cabinet.Trays[args.TrayIndex];
            var tile = tray.Tiles[args.TileIndex];
            if (tile.Remaining == 0) {
                return;
            }
            var src = args.Src;
            var cell = state.Board.Cells[args.CellIndex];
            var list = cell.Confirmed.concat(cell.Waiting);
            list.push(src);
            var isValid = Indic.Indic.IsValid(list);
            if (!isValid) {
                state.InfoBar.Messages.push(Indic.Util.Format(Indic.Messages.InvalidMove, [cell.Current, src]));
                if (!useSynonyms) {
                    return;
                }
                var synonym = Indic.Indic.GetSynonym(src);
                if (synonym == null) {
                    return;
                }
                state.InfoBar.Messages.push(Indic.Util.Format(Indic.Messages.UseSynonym, [cell.Current, src, synonym]));
                var iPos = GameActions.FindTile(state, synonym);
                iPos.Src = synonym;
                iPos.CellIndex = args.CellIndex;
                GameActions.ToBoardInternal(state, iPos, false);
                return;
            }
            cell.Waiting.push(src);
            list = cell.Confirmed.concat(cell.Waiting);
            cell.Current = Indic.Indic.Merge(list);
            tile.Remaining--;
            state.Cabinet.Remaining--;
            GameActions.RefreshClaims(state);
        };
        GameActions.ToBoard = function (state, args) {
            GameActions.ToBoardInternal(state, args, true);
        };
        GameActions.FindTile = function (state, char) {
            for (var i = 0; i < state.Cabinet.Trays.length; i++) {
                var tray = state.Cabinet.Trays[i];
                for (var j = 0; j < tray.Tiles.length; j++) {
                    var tile = tray.Tiles[j];
                    if (tile.Text == char) {
                        return { TrayIndex: i, TileIndex: j };
                    }
                }
            }
            return null;
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
        GameActions.TotalTiles = function (Cabinet) {
            var count = 0;
            for (var i = 0; i < Cabinet.Trays.length; i++) {
                var tray = Cabinet.Trays[i];
                for (var j = 0; j < tray.Tiles.length; j++) {
                    var tile = tray.Tiles[j];
                    count = count + tile.Total;
                }
            }
            return count;
        };
        GameActions.RemainingTiles = function (Cabinet) {
            var count = 0;
            for (var i = 0; i < Cabinet.Trays.length; i++) {
                var tray = Cabinet.Trays[i];
                for (var j = 0; j < tray.Tiles.length; j++) {
                    var tile = tray.Tiles[j];
                    count = count + tile.Remaining;
                }
            }
            return count;
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
                var P = BoardUtil.Position(first, size);
                var C = Cells[first];
            }
            var curr = 0;
            var found = true;
            while (found) {
                if (curr >= List.length) {
                    break;
                }
                found = false;
                var neighors = BoardUtil.FindNeighbors(List[curr], size);
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
                    var P = BoardUtil.Position(neighbor, size);
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
                var P = BoardUtil.Position(orphan, state.Board.Size);
                var N = state.Board.Cells[orphan];
                state.InfoBar.Messages.push(Indic.Util.Format(Indic.Messages.OrphanCell, [(P.X + 1), (P.Y + 1), N.Current]));
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
                var neighors = BoardUtil.FindNeighbors(i, Board.Size);
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
                        index = BoardUtil.Abs(r, i, Board.Size);
                        break;
                    case 'C':
                        index = BoardUtil.Abs(i, r, Board.Size);
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
                    First = BoardUtil.Position(i, size);
                    cnt++;
                    continue;
                }
                var Current = BoardUtil.Position(i, size);
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
    var BoardUtil = (function () {
        function BoardUtil() {
        }
        BoardUtil.Abs = function (X, Y, size) {
            var min = 0;
            var max = size - 1;
            if ((X < min || X > max) || (Y < min || Y > max)) {
                return -1;
            }
            return (size * (X + 1)) + Y - size;
        };
        BoardUtil.Position = function (N, size) {
            var X = Math.floor(N / size);
            var Y = (N % size);
            return { X: X, Y: Y };
        };
        BoardUtil.FindNeighbors = function (index, size) {
            var arr = [];
            var pos = BoardUtil.Position(index, size);
            var bottom = BoardUtil.Abs(pos.X + 1, pos.Y, size);
            var top = BoardUtil.Abs(pos.X - 1, pos.Y, size);
            var left = BoardUtil.Abs(pos.X, pos.Y - 1, size);
            var right = BoardUtil.Abs(pos.X, pos.Y + 1, size);
            var a = [right, left, top, bottom];
            for (var i = 0; i < a.length; i++) {
                if (a[i] != -1) {
                    arr.push(a[i]);
                }
            }
            return arr;
        };
        return BoardUtil;
    }());
    exports.BoardUtil = BoardUtil;
});
