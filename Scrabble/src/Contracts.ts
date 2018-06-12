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
    ReadOnly: boolean;
    Show: boolean;
}
export interface iCabinetProps extends iComponent {
    Trays: iTrayProps[];
    Remaining: number;
    Total: number;
}
export interface iTrayProps extends iComponent {
    Title: string;
    Index: number;
    Tiles: iTileProps[];
    Disabled: boolean;
}
export interface iTileProps extends iComponent {
    Text: string;
    Remaining: number;
    Total: number;
    Weight: number;
    OnBoard: number;
    Index: number;
    TrayIndex: number;
}
export interface iBoardProps extends iComponent {
    Size: number;
    Name: string;
    Star: number;
    Language: string;
    Cells: iCellProps[];
    TileWeights: any;
}
export interface iCellProps extends iComponent {
    Title: string;
    Current: string;
    Index: number;
    Weight: number;
    Waiting: string[];
    Confirmed: string[];
    Star: boolean;
}
export interface iPlayers extends iComponent {
    Players: iPlayer[];
    Current: number;
    HasClaims: boolean;
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
    NoWords: number;
    Bot: Bot;
}
export interface iGameTable extends iComponent {
    VowelTray: iTrayProps;
    ConsoTray: iTrayProps;
    CanReDraw: boolean;
    MaxOnTable: number;
    MaxVowels: number;
    Message: string;
}
export interface iConsent extends iComponent {
    Pending: iWordPair[];
    UnResolved: iWordPair[];
}
export interface iWordPair {
    Scrabble: string;
    Readble: string;
}
export interface iGameState extends iComponent {
    GameId: number;
    GameOver: boolean;
    Cabinet: iCabinetProps;
    Board: iBoardProps;
    Players: iPlayers;
    InfoBar: iInfoBar;
    GameTable: iGameTable;
    Cache: iCachedTile;//This Contract doesn't look good and makes no-sense. Why not a Array??
    Consent: iConsent;
    Dialog: iDialog;
    Suggestion: iSuggestion;
    Stats: iBoardsStats;
}
export interface iOverlayDialog extends iComponent {
    Title: string;
    ConfirmText: string;
    CancelText: string;
    ShowConfirm: boolean;
    ShowClose: boolean;
    OnConfirm: () => void;
    OnDismiss: () => void;
}
export interface _iAlertDialog extends iOverlayDialog {
    Title: string;
    Message: string;
}
export interface _iConfirmDialog extends _iAlertDialog {
    Title: string;
    Message: string;
}
export interface _iSuggestionDialog extends iOverlayDialog {
    Moves: iBotMoveResult[];
    Loaded: boolean;
}
export interface iDialog extends iComponent {
    Title: string;
    Message: string;
    OnConfirm?: () => void;
}
export interface iAlert extends iDialog {

}
export interface iConfirm extends iAlert {
    OnDismiss?: () => void;
}
export interface iSuggestion extends _iSuggestionDialog {
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
export class Events {
    public static GameOver: number = 0;
}
export class Actions {
    public static Init: number = 0;
    public static ReRender: number = 1;
    //
    public static ToBoard: number = 20;
    public static ToTray: number = 21;
    public static OpenOrClose: number = 22;
    //
    public static Pass: number = 40;
    public static ReDraw: number = 41;
    //Suggestions
    public static RequestSuggestion: number = 42;
    public static ReciveSuggestion: number = 43;
    public static DismissSuggestion: number = 44;
    //
    public static PunchAndPick: number = 45;
    //
    public static BotMove: number = 50;
    public static BotMoveResponse: number = 51;
    //
    public static Award: number = 60;
    public static ResolveWords: number = 61;
    public static TakeConsent: number = 62;
    public static WordResolved: number = 63;
    public static WordRejected: number = 64;

    //
    public static DismissDialog: number = 90;
    public static AskHelp: number = 91;
}
export interface iIndexConfig {
    Langs: string[];
    Boards: string[];
    Bots: Bot[];
    Strings: any;
}
//Load Schema is Differet from iGameState 
//TODO: May use the Same Schema??
export interface iRawConfig {
    Board: iRawBoard;
    CharSet: any;
    Localization: any;
    Players: any;
    GameId: number;
}
export interface iRawBoard {
    Id: string;
    Language: string;
    GameTable: iRawGameTable;
    Trays: iRawTray[];
    Name: string;
    Size: number;
    Star: number;
    Weights: number[];
}
export interface iRawGameTable {
    MaxOnTable: number;
    MaxVowels: number;
}
export interface iRawTray {
    Id: string;
    Title: string;
    Count: number;
    Show: boolean;
    Set: any[];
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
    OnBoard: number;
}
export interface iBoardsStats {
    Occupancy: number;
    EmptyCells: number;
    TotalWords: number;
    UnUsed: number;
}
// Views
export interface iTrayView extends iTrayProps {
    ShowLabel: boolean;
}
export interface iPlayerView extends iPlayer {
    showScore: boolean;
    showWords: boolean;
}
export interface iPlayersView extends iPlayers {
    showScores: boolean;
    showWordsList: boolean;
}
export interface iActionBar extends iBoardsStats, iComponent {
}
//
export interface iAction {
    type: number;
    args: any;
}
export interface iBotMove {
    Index: number;
    Tiles: string;
}
export interface iBotMoveResult {
    Direction: string,
    Score: number;
    WordsCount: number;
    Moves: iBotMove[];
}
export interface iBotMoveResponse {
    Action: string;
    Effort: string;
    Reference: string;
    Result: iBotMoveResult;
}
export interface iResolveResponse {
    Action: string;
    Effort: string;
    Reference: string;
    Result: string[];
}
//Following Contracts for  Game Server
export interface Neighbor {
    Left: number;
    Right: number;
    Top: number;
    Bottom: number;
}
export interface Point {
    X: number;
    Y: number;
}
export interface Word {
    Index: number;
    Tiles: string;
    Syllables: number;
    Position: string;
}
export interface ProbableMove {
    Direction: string;
    Mode: number;
    Score: number;
    Moves: Word[];
    WordsCount: number;
    Words: ProbableWord[];
}
export interface ProbableWord {
    Cells: TargetCell[];
    Display: string;
    String: string;
    Score: number;
}
export interface TargetCell {
    Index: number;
    Target: string;
    Score: number;
}
export interface ScrabbleBoard {
    Name: string;
    Language: string;
    Bot: string;
    Id: string;
    //
    Reference: string;
    //Dynamic
    Cells: string[];
    Vowels: string;
    Conso: string;
    Special: string;
}
export interface Bot {
    Id: string;
    Name: string;
    FullName: string;
    Language: string;
    Algorithm: string;
    Dictionary: string;
    Endpoint: string;
}
export interface CharSet {
    Name: string;
    Language: string;
    Dictionary: string;
    SunnaSet: string[];
    Vowels: string[];
    Consonents: string[];
    Synonyms: any;
    Virama: string;
}
export interface KnownBoard {
    Name: string;
    Size: number;
    Language: string;
    Weights: number[];
    Trays: GameTray[];
    Star: number;
    TileWeights: any;
}
export interface GameTray {
    Id: string;
    Title: string;
    Show: boolean;
    Set: any;
}
export interface WC {
    W: number;
    C: number;
}
export interface iGameEngine {
    BestMove(Board: ScrabbleBoard): ProbableMove;
    Probables(Board: ScrabbleBoard): ProbableMove[];
}
export class Settings {
    static NoWords: number = 5;
    static BotWait: number = 300;
    static PinchWait: number = 300;
    static RefreeWait: number = 100;
    static ServerWait: number = 100;
}