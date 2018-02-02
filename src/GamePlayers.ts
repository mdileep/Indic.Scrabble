//---------------------------------------------------------------------------------------------
// <copyright file="Palyers.ts" company="Chandam-ఛందం">
//    Copyright © 2013 - 2018 'Chandam-ఛందం' : http://chandam.apphb.com
//    Original Author : Dileep Miriyala (m.dileep@gmail.com)
//    Last Updated    : 31-Jan-2018 18:52EST
//    Revisions:
//       Version    | Author                   | Email                     | Remarks
//       1.0        | Dileep Miriyala          | m.dileep@gmail.com        | Initial Commit
//       _._        | <TODO>                   |   <TODO>                  | <TODO>
// </copyright>
//---------------------------------------------------------------------------------------------
import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Contracts from 'Contracts';
import * as GamePlayer from 'GamePlayer';
import * as GameLoader from 'GameLoader';
import * as Indic from 'Indic';

class GamePlayers extends React.Component<Contracts.iPlayersView, Contracts.iPlayersView> {
    constructor(props: Contracts.iPlayersView) {
        super(props);
        this.state = props;
    }
    render() {
        var players: React.ReactElement<Contracts.iPlayer>[] = [];
        for (var i = 0; i < this.props.Players.length; i++) {
            var player = React.createElement(((GamePlayer.default as any) as React.ComponentClass<Contracts.iPlayerView>), Indic.Util.Merge(this.props.Players[i], { showScore: this.props.showScores, showWords: this.props.showWordsList }));
            players.push(player);
        }
        var blocks = React.createElement('div',
            {
                id: this.props.Id,
                key: this.props.Id,
                ref: this.props.Id,
                className: "scoreBoard",
                title: "Information",
            }, players);
        return blocks;
    }
}
export default GamePlayers;