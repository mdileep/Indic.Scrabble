define(["require", "exports", "GameActions"], function (require, exports, GameActions) {
    "use strict";
    var Parser = (function () {
        function Parser() {
        }
        Parser.Parse = function (JSON) {
            if (console) {
                console.log("Parsing the JSON");
            }
            var cabinet = Parser.ParseCabinet(JSON.Cabinet);
            var board = Parser.ParseBoard(JSON.Board);
            var scoreBoard = Parser.BuildScoreBoard(cabinet, board, JSON.ScoreBoard);
            var gameState = {
                Id: JSON.Id,
                key: JSON.Id,
                Cabinet: cabinet,
                Board: board,
                ScoreBoard: scoreBoard
            };
            return gameState;
        };
        Parser.ParseCabinet = function (JSON) {
            var raw = {};
            raw.key = "Cabinet";
            raw.Trays = [];
            var index = 0;
            for (var i = 0; i < JSON.Trays.length; i++) {
                var item = JSON.Trays[i];
                var props = {};
                props.id = item.Id;
                props.key = item.Id;
                props.className = item.Id;
                props.Title = item.Title;
                props.Show = item.Show;
                props.Disabled = false;
                props.Index = i;
                props.Tiles = [];
                for (var j = 0; j < item.Set.length; j++) {
                    var prop = {};
                    prop.Id = "T_" + (index + 1).toString();
                    prop.key = prop.Id;
                    prop.Text = item.Set[j];
                    prop.Remaining = item.Count;
                    prop.Total = item.Count;
                    prop.Index = j;
                    prop.TrayIndex = i;
                    props.Tiles.push(prop);
                    index++;
                }
                raw.Trays.push(props);
            }
            raw.Total = GameActions.GameActions.TotalTiles(raw);
            raw.Remaining = GameActions.GameActions.RemainingTiles(raw);
            return raw;
        };
        Parser.ParseBoard = function (JSON) {
            var raw = {};
            raw.key = "Board";
            raw.Size = JSON.Size;
            raw.Cells = [];
            var index = 0;
            for (var i = 0; i < JSON.Size; i++) {
                for (var j = 0; j < JSON.Size; j++) {
                    var cell = {};
                    cell.Id = "C_" + (index + 1).toString();
                    cell.key = cell.Id;
                    cell.Weight = JSON.Weights[index];
                    cell.Current = " ";
                    cell.Index = index;
                    cell.Last = "";
                    cell.Waiting = [];
                    cell.Confirmed = [];
                    raw.Cells.push(cell);
                    index++;
                }
            }
            return raw;
        };
        Parser.BuildScoreBoard = function (Cabinet, Board, scoreBoard) {
            var raw = {};
            raw.key = "Info";
            raw.Messages = [];
            raw.Users = [];
            raw.CurrentPlayer = 0;
            for (var i = 0; i < scoreBoard.Users.length; i++) {
                var user = scoreBoard.Users[i];
                user.Playing = (i == raw.CurrentPlayer);
                user.Score = 0;
                user.Unconfirmed = 0;
                user.Id = "U" + (i + 1);
                raw.Users.push(user);
            }
            return raw;
        };
        return Parser;
    }());
    exports.Parser = Parser;
});
