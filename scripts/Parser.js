define(["require", "exports", "GameActions", "Indic"], function (require, exports, GameActions, Indic) {
    "use strict";
    var Parser = (function () {
        function Parser() {
        }
        Parser.Parse = function (JSON) {
            var cabinet = Parser.ParseCabinet(JSON.Cabinet);
            var cache = Parser.BuildCache(cabinet);
            var board = Parser.ParseBoard(JSON.Board);
            var players = Parser.ParsePlayers(JSON.Players);
            var infoBar = Parser.ParseInfoBar(JSON.InfoBar);
            var gameTable = Parser.BuildGameTable(JSON.GameTable, cache);
            GameActions.GameActions.RefreshTrays(cabinet.Trays, cache);
            GameActions.GameActions.RefreshCabinet(cabinet, cache);
            var gameState = {
                Id: JSON.Id,
                key: JSON.Id,
                className: "game",
                Cache: cache,
                Cabinet: cabinet,
                Board: board,
                Players: players,
                InfoBar: infoBar,
                ReadOnly: false,
                Show: true,
                GameTable: gameTable
            };
            return gameState;
        };
        Parser.BuildGameTable = function (JSON, cache) {
            var available = GameActions.GameActions.DrawTiles(cache, JSON.MaxVowels, JSON.MaxOnTray);
            var tray = GameActions.GameActions.SetTableTray(available);
            var raw = {};
            raw.key = "gameTable";
            raw.Id = raw.key;
            raw.className = "gameTable";
            raw.EmptyPass = 0;
            raw.MaxOnTray = JSON.MaxOnTray;
            raw.MaxVowels = JSON.MaxVowels;
            raw.MaxEmptyPass = JSON.MaxEmptyPass;
            raw.Tray = tray;
            return raw;
        };
        Parser.ParseCabinet = function (JSON) {
            var raw = {};
            raw.key = "Cabinet";
            raw.Trays = [];
            raw.ReadOnly = true;
            raw.Show = false;
            var index = 0;
            var tilesDict = {};
            for (var i = 0; i < JSON.Trays.length; i++) {
                var item = JSON.Trays[i];
                var props = {};
                props.Id = item.Id;
                props.key = item.Id;
                props.className = item.Id;
                props.Title = item.Title;
                props.Show = item.Show;
                props.Disabled = false;
                props.ReadOnly = raw.ReadOnly;
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
                    prop.ReadOnly = raw.ReadOnly;
                    props.Tiles.push(prop);
                    index++;
                }
                raw.Trays.push(props);
            }
            return raw;
        };
        Parser.BuildCache = function (JSON) {
            var tilesDict = {};
            for (var i = 0; i < JSON.Trays.length; i++) {
                var item = JSON.Trays[i];
                for (var j = 0; j < item.Tiles.length; j++) {
                    var prop = item.Tiles[j];
                    Parser.RefreshCache(tilesDict, { Text: prop.Text, Remaining: prop.Remaining, Total: prop.Total });
                }
            }
            return tilesDict;
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
            raw.HasClaims = false;
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
        Parser.RefreshCache = function (cache, prop) {
            var text = prop.Text;
            if (cache[text] != null) {
                if (cache[text].Total < prop.Total) {
                    cache[text].Remaining = prop.Remaining;
                    cache[text].Total = prop.Total;
                }
                return;
            }
            var sym = Indic.Indic.GetSynonym(text);
            if (sym != null && cache[sym] != null) {
                if (cache[sym].Total < prop.Total) {
                    cache[sym].Remaining = prop.Remaining;
                    cache[sym].Total = prop.Total;
                }
                return;
            }
            cache[text] =
                {
                    Remaining: prop.Remaining,
                    Total: prop.Total
                };
            return;
        };
        return Parser;
    }());
    exports.Parser = Parser;
});
