define(["require", "exports", "GameActions", "Indic"], function (require, exports, GameActions, Indic) {
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
            var players = Parser.ParsePlayers(JSON.Players);
            var infoBar = Parser.ParseInfoBar(JSON.InfoBar);
            var gameState = {
                Id: JSON.Id,
                key: JSON.Id,
                className: "game",
                Cabinet: cabinet,
                Board: board,
                Players: players,
                InfoBar: infoBar
            };
            return gameState;
        };
        Parser.InitSynonyms = function (cabinet) {
            var dict = Indic.Indic.GetSynonyms();
            for (var key in dict) {
                var synonym = dict[key];
                GameActions.GameActions.SyncSynonym(cabinet, key, synonym);
            }
        };
        Parser.ParseCabinet = function (JSON) {
            var raw = {};
            raw.key = "Cabinet";
            raw.Trays = [];
            var index = 0;
            for (var i = 0; i < JSON.Trays.length; i++) {
                var item = JSON.Trays[i];
                var props = {};
                props.Id = item.Id;
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
            Parser.InitSynonyms(raw);
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
                    cell.Waiting = [];
                    cell.Confirmed = [];
                    raw.Cells.push(cell);
                    index++;
                }
            }
            return raw;
        };
        Parser.ParsePlayers = function (players) {
            var raw = {};
            raw.Id = "Players";
            raw.key = raw.Id;
            raw.Players = [];
            raw.CurrentPlayer = 0;
            for (var i = 0; i < players.Players.length; i++) {
                var player = players.Players[i];
                player.CurrentTurn = (i == raw.CurrentPlayer);
                player.Score = 0;
                player.Unconfirmed = 0;
                player.Awarded = [];
                player.Claimed = [];
                player.Id = "P_" + (i + 1);
                player.key = player.Id;
                raw.Players.push(player);
            }
            return raw;
        };
        Parser.ParseInfoBar = function (infoBar) {
            var raw = {};
            raw.key = "InfoBar";
            raw.Messages = [];
            return raw;
        };
        return Parser;
    }());
    exports.Parser = Parser;
});
