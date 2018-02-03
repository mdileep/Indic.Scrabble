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
export interface iComponent {
    Id: string;
    key: string;
    className: string;
}
export interface iCabinetProps extends iComponent {
    Trays: iTrayProps[];
    Remaining: number;
    Total: number;
    Cache: iCachedTile;
}
export interface iTrayProps extends iComponent {
    Title: string;
    Index: number;
    Tiles: iTileProps[];
    Show: boolean;
    Disabled: boolean;
}
export interface iTileProps extends iComponent {
    Text: string;
    Remaining: number;
    Total: number;
    Index: number;
    TrayIndex: number;
}
export interface iBoardProps extends iComponent {

    Size: number;
    Cells: iCellProps[];
}
export interface iCellProps extends iComponent {
    Title: string;
    Current: string;
    Index: number;
    Weight: number;
    Waiting: string[];
    Confirmed: string[];
}
export interface iPlayers extends iComponent {
    Players: iPlayer[];
    CurrentPlayer: number;
}
export interface iInfoBar extends iComponent {
    Messages: string[];
}
export interface iPlayer extends iComponent {
    Name: string;
    Score: number;
    Unconfirmed: number;
    CurrentTurn: boolean;
    Awarded: iWord[];
    Claimed: iWord[];
}
export interface iGameState extends iComponent {
    Cabinet: iCabinetProps;
    Board: iBoardProps;
    Players: iPlayers;
    InfoBar: iInfoBar;
}
export interface iActionArgs {
    type: number;
    args: iArgs;
}
export interface iArgs {
    TrayIndex?: number;
    TileIndex?: number;
    TargetCell?: number;
    Src?: string;
    Origin?: string;
    SrcCell?: number;
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
    Players: iPlayers;
    InfoBar: iInfoBar;
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
//
export interface iPosition {
    X: number;
    Y: number;
}
export interface iWord {
    Text: string;
    Waiting: boolean;
    Score: number;
}
export interface iCachedTile {
    [key: string]: any;
    Remaining: number;
    Total: number;
}

export interface iPlayerView extends iPlayer {
    showScore: boolean;
    showWords: boolean;
}
export interface iPlayersView extends iPlayers {
    showScores: boolean;
    showWordsList: boolean;
}