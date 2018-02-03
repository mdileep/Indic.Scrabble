//---------------------------------------------------------------------------------------------
// <copyright file="GameRoom.ts" company="Chandam-????">
//    Copyright © 2013 - 2018 'Chandam-????' : http://chandam.apphb.com
//    Original Author : Dileep Miriyala (m.dileep@gmail.com)
//    Last Updated    : 29-Jan-2018 21:53EST
//    Revisions:
//       Version    | Author                   | Email                     | Remarks
//       1.0        | Dileep Miriyala          | m.dileep@gmail.com        | Initial Commit
//       _._        | <TODO>                   |   <TODO>                  | <TODO>
// </copyright>
//---------------------------------------------------------------------------------------------
import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Redux from 'redux';
import Reducers from 'GameState';
import * as Contracts from 'Contracts';
import * as Cabinet from 'Cabinet';
import * as Board from 'Board';
import * as InfoBar from 'InfoBar';
import * as GamePlayers from 'GamePlayers';
import * as RaiseHand from 'RaiseHand';
import * as Indic from 'Indic';
import * as Util from 'Util';

class GameRoom extends React.Component<Contracts.iGameState, Contracts.iGameState> {
    constructor(props: Contracts.iGameState) {
        super(props);
        this.state = props;
    }
    render() {
        var scores = React.createElement(((GamePlayers.default as any) as React.ComponentClass<Contracts.iPlayers>), Util.Util.Merge(this.props.Players, { key: "scores", showScores: true, showWordsList: false }));
        var words = React.createElement(((GamePlayers.default as any) as React.ComponentClass<Contracts.iPlayers>), Util.Util.Merge(this.props.Players, { key: "words", Id: "WordBoard", showScores: false, showWordsList: true }));
        var raiseHand = React.createElement(((RaiseHand.default as any) as React.ComponentClass<Contracts.iProps>), { key: "raiseHand" });
        var cabinet = React.createElement(((Cabinet.default as any) as React.ComponentClass<Contracts.iCabinetProps>), this.props.Cabinet);
        var board = React.createElement(((Board.default as any) as React.ComponentClass<Contracts.iBoardProps>), this.props.Board);
        var info = React.createElement(((InfoBar.default as any) as React.ComponentClass<Contracts.iInfoBar>), this.props.InfoBar);
        var block = React.createElement('div',
            {
                id: this.props.Id,
                ref: this.props.Id,
                className: "game",
                title: "Scrabble",
            }, [raiseHand, cabinet, board, scores, words, info]);
        return block;
    }
}
export default GameRoom;