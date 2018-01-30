define(["require", "exports", 'Indic'], function (require, exports, Indic) {
    "use strict";
    var GameActions = (function () {
        function GameActions() {
        }
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
                tile.Count++;
                state.ScoreBoard.Available++;
            }
        };
        GameActions._ToBoard = function (state, args, useSynonyms) {
            var tray = state.Cabinet.Trays[args.TrayIndex];
            var tile = tray.Tiles[args.TileIndex];
            if (tile.Count == 0) {
                return;
            }
            var src = args.Src;
            var cell = state.Board.Cells[args.CellIndex];
            var list = cell.Confirmed.concat(cell.Waiting);
            list.push(src);
            var isValid = Indic.Indic.IsValid(list);
            if (!isValid) {
                state.ScoreBoard.Messages.push("[Invalid Move] " + cell.Current + " " + src);
                if (!useSynonyms) {
                    return;
                }
                var synonym = Indic.Indic.Synonyms[src];
                if (synonym == null) {
                    return;
                }
                state.ScoreBoard.Messages.push("[Using Synonym] " + cell.Current + " " + synonym);
                var iPos = GameActions.FindTile(state, synonym);
                iPos.Src = synonym;
                iPos.CellIndex = args.CellIndex;
                GameActions._ToBoard(state, iPos, false);
                return;
            }
            cell.Waiting.push(src);
            list = cell.Confirmed.concat(cell.Waiting);
            cell.Current = Indic.Indic.Merge(list);
            tile.Count--;
            state.ScoreBoard.Available--;
        };
        GameActions.ToBoard = function (state, args) {
            GameActions._ToBoard(state, args, true);
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
        GameActions.GameScore = function (Board) {
            var weight = 0;
            for (var i = 0; i < Board.Cells.length; i++) {
                var cell = Board.Cells[i];
                if (cell.Confirmed.length > 0) {
                    weight = weight + cell.Weight;
                }
            }
            return weight;
        };
        GameActions.TilesAvailable = function (Cabinet) {
            var count = 0;
            for (var i = 0; i < Cabinet.Trays.length; i++) {
                var tray = Cabinet.Trays[i];
                for (var j = 0; j < tray.Tiles.length; j++) {
                    var tile = tray.Tiles[j];
                    count = count + tile.Count;
                }
            }
            return count;
        };
        return GameActions;
    }());
    exports.GameActions = GameActions;
});
