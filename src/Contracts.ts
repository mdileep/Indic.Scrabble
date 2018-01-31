//---------------------------------------------------------------------------------------------
// <copyright file="Contracts.ts" company="Chandam-ఛందం">
//    Copyright © 2013 - 2018 'Chandam-ఛందం' : http://chandam.apphb.com
//    Original Author : Dileep Miriyala (m.dileep@gmail.com)
//    Last Updated    : 29-Jan-2018 21:53EST
//    Revisions:
//       Version    | Author                   | Email                     | Remarks
//       1.0        | Dileep Miriyala          | m.dileep@gmail.com        | Initial Commit
//       _._        | <TODO>                   |   <TODO>                  | <TODO>
// </copyright>
//---------------------------------------------------------------------------------------------
export interface iProps {
}
export interface iCabinetProps {
    key: string;
    Trays: iTrayProps[];
    Remaining: number;
    Total: number;
}
export interface iTrayProps {
    id: string;
    key: string;
    className: string;
    Title: string;
    Index: number;
    Tiles: iTileProps[];
    Show: boolean;
    Disabled: boolean;
}
export interface iTileProps {
    Id: string;
    key: string;
    Text: string;
    Remaining: number;
    Total: number;
    Index: number;
    TrayIndex: number;
}
export interface iBoardProps {
    key: string;
    Size: number;
    Cells: iCellProps[];
}
export interface iCellProps {
    Id: string;
    key: string;
    className: string;
    Title: string;
    Current: string;
    Index: number;
    Last: string;
    Weight: number;
    Waiting: string[];
    Confirmed: string[];
}
export interface iScoreBoard {
    key: string;
    Messages: string[];
    Users: iUser[];
    CurrentPlayer: number;
}
export interface iUser {
    Score: number;
    Playing: boolean;
    Unconfirmed: number;
    Name: string;
    Id: string;
}
export interface iGameState {
    Id: string;
    key: string;
    Cabinet: iCabinetProps;
    Board: iBoardProps;
    ScoreBoard: iScoreBoard;
}
export interface iActionArgs {
    type: number;
    args: iArgs;
}
export interface iArgs {
    Index?: number;
    TrayIndex?: number;
    TileIndex?: number;
    CellIndex?: number;
    Src?: string;
}
export class Actions {
    public static ToBoard: number = 1;
    public static ToTray: number = 2;
    public static OpenOrClose: number = 3;
    public static Pass: number = 4;
}
//Load Schema is Differet from iGameState 
//TODO: May use the Same Schema??
export interface iLoadState {
    Id: string;
    Lanaguage: string;
    Cabinet: iRawCabinet;
    Board: iRawBoard;
    ScoreBoard: iScoreBoard;
}
export interface iRawCabinet {
    Trays: iRawTray[];
}
export interface iRawBoard {
    Size: number;
    Weights: number[];
}
export interface iRawTray {
    Id: string;
    Title: string;
    Count: number;
    Show: boolean;
    Set: string[];
}
