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
import * as ScoreBoard from 'ScoreBoard';

class GameRoom extends React.Component<Contracts.iGameState, Contracts.iGameState> {
    constructor(props: Contracts.iGameState) {
        super(props);
        this.state = props;
    }
    render() {
        var cabinet = React.createElement(((Cabinet.default as any) as React.ComponentClass<Contracts.iCabinetProps>), this.props.Cabinet);
        var board = React.createElement(((Board.default as any) as React.ComponentClass<Contracts.iBoardProps>), this.props.Board);
        var info = React.createElement(((ScoreBoard.default as any) as React.ComponentClass<Contracts.iScoreBoard>), this.props.ScoreBoard);
        var block = React.createElement('div',
            {
                id: this.props.Id,
                ref: this.props.Id,
                className: "game",
                title: "Scrabble",
            }, [cabinet, board, info]);
        return block;
    }
}
export default GameRoom;