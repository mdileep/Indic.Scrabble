import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Redux from 'redux';
import * as InputArea from 'InputArea';
import * as BoardArea from 'BoardArea';
import Reducers from 'GameState';
import * as Contracts from 'Contracts';

class ScrabbleGame extends React.Component<Contracts.IGameState, Contracts.IGameState> {

    constructor(props: Contracts.IGameState) {
        super(props);
        this.state = props;
    }

    render() {
        var left = React.createElement(((InputArea.default as any) as React.ComponentClass<Contracts.ILeftProps>), this.props.Left);
        var center = React.createElement(((BoardArea.default as any) as React.ComponentClass<Contracts.IBoardProps>), this.props.Center);
        var right = React.createElement("span",
            {
                className: "trash span",
                key: "right"
            });
        var block = React.createElement('div',
            {
                id: this.props.id,
                ref: this.props.id,
                className: "game",
                title: "Scrabble",
            }, [left, center, right]);
        return block;
    }
}
export default ScrabbleGame;