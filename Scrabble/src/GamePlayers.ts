//---------------------------------------------------------------------------------------------
// <copyright file="GamePlayers.ts" company="Chandam-ఛందం">
//    Copyright © 2013 - 2018 'Chandam-ఛందం' : http://chandam.apphb.com
//    Original Author : Dileep Miriyala (m.dileep@gmail.com)
//    Last Updated    : 31-Jan-2018 18:52EST
//    Revisions:
//       Version    | Author                   | Email                     | Remarks
//       1.0        | Dileep Miriyala          | m.dileep@gmail.com        | Initial Commit
//       _._        | <TODO>                   |   <TODO>                  | <TODO>
// </copyright>
//---------------------------------------------------------------------------------------------

import * as React from 'react';
import * as Contracts from 'Contracts';
import * as GamePlayer from 'GamePlayer';
import * as Util from 'Util';
import * as M from 'Messages';

class GamePlayers extends React.Component<Contracts.iPlayersView, Contracts.iPlayersView> {
    constructor(props: Contracts.iPlayersView) {
        super(props);
        this.state = props;
    }
    render() {
        var childs: React.ReactElement<Contracts.iProps>[] = [];
        for (var i = 0; i < this.props.Players.length; i++) {
            var player = React.createElement(((GamePlayer.default as any) as React.ComponentClass<Contracts.iPlayerView>),
                Util.Util.Merge(this.props.Players[i],
                    {
                        showScore: this.props.showScores,
                        showWords: this.props.showWordsList
                    }));
            childs.push(player);
        }

        if (this.props.showWordsList && this.props.HasClaims) {
            var label = React.createElement('span',
                {
                    key: "lbl",
                    className:"conditions",
                    title: M.Messages.Claimed
                }, M.Messages.Claimed);
            childs.push(label);
        }

        var className: string = "players";
        var elem = React.createElement('div',
            {
                id: this.props.Id,
                key: this.props.Id,
                ref: this.props.Id,
                className: className,
                title: M.Messages.Players,
            }, childs);
        return elem;
    }
}
export default GamePlayers;