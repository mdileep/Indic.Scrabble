define(["require", "exports", 'Messages', 'Util', "AskBot", 'Indic', 'GameActions'], function (require, exports, M, U, AskServer, Indic, GA) {
    "use strict";
    var AskReferee = (function () {
        function AskReferee() {
        }
        AskReferee.Validate = function (state, args) {
            var errorCode = AskReferee.ValidateMove(state.Board);
            if (errorCode > 0) {
                AskReferee.Announce(state, (errorCode == 1) ? M.Messages.CrossCells : M.Messages.NoGap);
                return;
            }
            var hasOrphans = AskReferee.HasOrphans(state);
            if (hasOrphans) {
                AskReferee.Announce(state, M.Messages.HasOraphans);
                return;
            }
            var hasClusters = AskReferee.HasClusters(state);
            if (hasClusters) {
                AskReferee.Announce(state, M.Messages.HasIslands);
                return;
            }
            var hasMoves = AskReferee.HasMoves(state);
            if (hasMoves) {
                var isCovered = AskReferee.IsStarCovered(state);
                if (!isCovered) {
                    AskReferee.Announce(state, M.Messages.IsStarCovered);
                    return;
                }
            }
            var player = state.Players.Players[state.Players.CurrentPlayer];
            state.GameTable.Message = U.Util.Format(M.Messages.LookupDict, [player.Name]);
            state.ReadOnly = true;
            setTimeout(AskServer.AskServer.Validate, GA.Settings.RefreeWait);
        };
        AskReferee.HasMoves = function (state) {
            var Board = state.Board;
            var first = AskReferee.FirstNonEmpty(Board.Cells, [], Board.Size);
            return (first != -1);
        };
        AskReferee.IsStarCovered = function (state) {
            var C = state.Board.Cells[state.Board.Star];
            return (C.Waiting.length + C.Confirmed.length != 0);
        };
        AskReferee.Announce = function (state, message) {
            state.InfoBar.Messages.push(M.Messages.HasIslands);
            state.Dialog.Title = M.Messages.Name;
            state.Dialog.Message = message;
            state.Dialog.Show = true;
        };
        AskReferee.ValidateMove = function (Board) {
            var Cells = Board.Cells;
            var size = Board.Size;
            var Waiting = [];
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
            var First = U.Util.Position(Waiting[0], size);
            var Last = {};
            var rows = 0;
            var columns = 0;
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
                var _i = U.Util.Abs((rows == 0) ? First.X : i, (rows == 0) ? i : First.Y, size);
                var C = Cells[_i];
                if (C.Confirmed.length + C.Waiting.length == 0) {
                    return 2;
                }
            }
            return 0;
        };
        AskReferee.HasOrphans = function (state) {
            var orphans = AskReferee.OrphanCells(state.Board);
            for (var i = 0; i < orphans.length; i++) {
                var orphan = orphans[i];
                var P = U.Util.Position(orphan, state.Board.Size);
                var N = state.Board.Cells[orphan];
                state.InfoBar.Messages.push(U.Util.Format(M.Messages.OrphanCell, [(P.X + 1), (P.Y + 1), N.Current]));
            }
            return orphans.length > 0;
        };
        AskReferee.OrphanCells = function (Board) {
            var oraphans = [];
            for (var i = 0; i < Board.Cells.length; i++) {
                var Cell = Board.Cells[i];
                if (Cell.Waiting.length + Cell.Confirmed.length == 0) {
                    continue;
                }
                var neighors = U.Util.FindNeighbors(i, Board.Size);
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
        AskReferee.HasClusters = function (state) {
            var Board = state.Board;
            var Clustered = [];
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
            return (clusters > 1);
        };
        AskReferee.ClusterCells = function (Cells, first, size) {
            var List = [];
            List.push(first);
            {
                var P = U.Util.Position(first, size);
                var C = Cells[first];
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
        };
        AskReferee.FirstNonEmpty = function (Cells, Clustered, size) {
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
        AskReferee.ExtractWords = function (board) {
            var Words = GA.GameActions.WordsOnBoard(board, true, true);
            var sWords = [];
            for (var indx in Words) {
                var word = Words[indx].Text;
                word = Indic.Indic.ToScrabble(word);
                sWords.push(word);
            }
            return sWords;
        };
        return AskReferee;
    }());
    exports.AskReferee = AskReferee;
});
