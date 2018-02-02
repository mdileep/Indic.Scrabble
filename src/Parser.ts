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

export class Parser {
    public static Parse(JSON: Contracts.iLoadState): Contracts.iGameState {
        if (console) { console.log("Parsing the JSON"); }
        //No Error Handling assuming clean -input
        var cabinet: Contracts.iCabinetProps = Parser.ParseCabinet(JSON.Cabinet);
        var board: Contracts.iBoardProps = Parser.ParseBoard(JSON.Board);
        var players: Contracts.iPlayers = Parser.ParsePlayers(JSON.Players);
        var infoBar: Contracts.iInfoBar = Parser.ParseInfoBar(JSON.InfoBar);
        var gameState: Contracts.iGameState = {
            Id: JSON.Id,
            key: JSON.Id,
            className: "game",
            Cabinet: cabinet,
            Board: board,
            Players: players,
            InfoBar: infoBar
        };
        return gameState;
    }
    public static ParseCabinet(JSON: Contracts.iRawCabinet): Contracts.iCabinetProps {
        var raw: Contracts.iCabinetProps = ({} as any) as Contracts.iCabinetProps;
        raw.key = "Cabinet";
        raw.Trays = [];
        var index = 0;
        for (var i = 0; i < JSON.Trays.length; i++) {
            var item = JSON.Trays[i];
            var props: Contracts.iTrayProps = ({} as any) as Contracts.iTrayProps;
            props.Id = item.Id;
            props.key = item.Id;
            props.className = item.Id;
            props.Title = item.Title;
            props.Show = item.Show;
            props.Disabled = false;
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
                props.Tiles.push(prop);
                index++;
            }
            raw.Trays.push(props);
        }
        raw.Total = GameActions.GameActions.TotalTiles(raw);
        raw.Remaining = GameActions.GameActions.RemainingTiles(raw);
        return raw;
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
                cell.Last = "";
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
}