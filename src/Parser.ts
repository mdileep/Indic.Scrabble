//---------------------------------------------------------------------------------------------
// <copyright file="Parser.ts" company="Chandam-ఛందం">
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
import * as GameActions from "GameActions";
import * as Indic from "Indic";

export class Parser {
    public static Parse(JSON: Contracts.iLoadState): Contracts.iGameState {
        //No Error Handling assuming clean -input
        var cabinet: Contracts.iCabinetProps = Parser.ParseCabinet(JSON.Cabinet);
        var cache: Contracts.iCachedTile = Parser.BuildCache(cabinet);
        var board: Contracts.iBoardProps = Parser.ParseBoard(JSON.Board);
        var players: Contracts.iPlayers = Parser.ParsePlayers(JSON.Players);
        var infoBar: Contracts.iInfoBar = Parser.ParseInfoBar(JSON.InfoBar);
        var gameTable: Contracts.iGameTable = Parser.BuildGameTable(JSON.GameTable, cache);

        GameActions.GameActions.RefreshTrays(cabinet.Trays, cache);
        GameActions.GameActions.RefreshCabinet(cabinet, cache);

        var gameState: Contracts.iGameState = {
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
    }

    public static BuildGameTable(JSON: Contracts.iRawGameTable, cache: Contracts.iCachedTile): Contracts.iGameTable {
        var vAvailable = GameActions.GameActions.DrawVowelTiles(cache, JSON.MaxVowels);
        var vTray = GameActions.GameActions.SetTableTray(vAvailable, "Vowels");
       
        var cAvailable = GameActions.GameActions.DrawConsoTiles(cache, JSON.MaxOnTable - JSON.MaxVowels);
        var cTray = GameActions.GameActions.SetTableTray(cAvailable, "Conso");


        var raw: Contracts.iGameTable = ({} as any) as Contracts.iGameTable;
        raw.key = "gameTable";
        raw.Id = raw.key;
        raw.className = "gameTable";
        raw.CanReDraw = true;
        raw.MaxOnTable = JSON.MaxOnTable;
        raw.MaxVowels = JSON.MaxVowels;
        //raw.EmptyPass = 0;
        //raw.MaxEmptyPass = JSON.MaxEmptyPass;
        raw.VowelTray = vTray;
        raw.ConsoTray = cTray;
        return raw;
    }

    public static ParseCabinet(JSON: Contracts.iRawCabinet): Contracts.iCabinetProps {
        var raw: Contracts.iCabinetProps = ({} as any) as Contracts.iCabinetProps;
        raw.key = "Cabinet";
        raw.Trays = [];
        raw.ReadOnly = true;
        raw.Show = false;
        var index = 0;
        var tilesDict: Contracts.iCachedTile = {} as any;
        for (var i = 0; i < JSON.Trays.length; i++) {
            var item = JSON.Trays[i];
            var props: Contracts.iTrayProps = ({} as any) as Contracts.iTrayProps;
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
                var prop: Contracts.iTileProps = ({} as any) as Contracts.iTileProps;
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
    }
    public static BuildCache(JSON: Contracts.iCabinetProps): Contracts.iCachedTile {
        var tilesDict: Contracts.iCachedTile = {} as any;
        for (var i = 0; i < JSON.Trays.length; i++) {
            var item = JSON.Trays[i];
            for (var j = 0; j < item.Tiles.length; j++) {
                var prop: Contracts.iTileProps = item.Tiles[j];
                Parser.RefreshCache(tilesDict, { Text: prop.Text, Remaining: prop.Remaining, Total: prop.Total });
            }
        }
        return tilesDict;
    }

    public static ParseBoard(JSON: Contracts.iRawBoard): Contracts.iBoardProps {
        var raw: Contracts.iBoardProps = ({} as any) as Contracts.iBoardProps;
        raw.key = "Board";
        raw.Size = JSON.Size;
        raw.Cells = [];
        var index = 0;
        for (var i = 0; i < JSON.Size; i++) {
            for (var j = 0; j < JSON.Size; j++) {
                var cell: Contracts.iCellProps = ({} as any) as Contracts.iCellProps;
                cell.Id = "C_" + (index + 1).toString();
                cell.key = cell.Id;
                cell.Weight = JSON.Weights[index];
                cell.Current = " ";
                cell.Index = index;
                cell.Waiting = [];
                cell.Confirmed = [];
                raw.Cells.push(cell); index++;
            }
        }
        return raw;
    }
    public static ParsePlayers(players: Contracts.iPlayers): Contracts.iPlayers {
        var raw: Contracts.iPlayers = ({} as any) as Contracts.iPlayers;
        raw.Id = "Players";
        raw.key = raw.Id;
        raw.Players = [];
        raw.CurrentPlayer = 0;
        raw.HasClaims = false;
        for (var i = 0; i < players.Players.length; i++) {
            var player: Contracts.iPlayer = players.Players[i];
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
    }
    public static ParseInfoBar(infoBar: Contracts.iInfoBar): Contracts.iInfoBar {
        var raw: Contracts.iInfoBar = ({} as any) as Contracts.iInfoBar;
        raw.key = "InfoBar";
        raw.Messages = [];
        return raw;
    }
    public static RefreshCache(cache: Contracts.iCachedTile, prop: any): void {
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
    }
}