//---------------------------------------------------------------------------------------------
// <copyright file="ScoreBoard.ts" company="Chandam-ఛందం">
//    Copyright © 2013 - 2018 'Chandam-ఛందం' : http://chandam.apphb.com
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
import * as Contracts from 'Contracts';
import * as GameUser from 'GameUser';
import * as GameLoader from 'GameLoader';

class ScoreBoard extends React.Component<Contracts.iScoreBoard, Contracts.iScoreBoard> {
    constructor(props: Contracts.iScoreBoard) {
        super(props);
        this.state = props;
    }
    componentDidUpdate() {
        ReactDOM.findDOMNode(this.refs["ul"]).scrollTop = 10000;
    }
    render() {
        var childs: React.ReactElement<Contracts.iProps>[] = [];

        var pass = React.createElement('button',
            {
                id: "pass",
                key: "pass",
                ref: "pass",
                className: "pass",
                title: "Pass",
                onClick: this.OnPass
            }, [], "Pass");
        childs.push(pass);



        var users: React.ReactElement<Contracts.iUser>[] = [];
        for (var i = 0; i < this.props.Users.length; i++) {
            var user = React.createElement(((GameUser.default as any) as React.ComponentClass<Contracts.iUser>), this.props.Users[i], {});
            users.push(user);
        }
        childs.push(users as any);


        if (this.props.Messages.length > 0) {
            var h2 = React.createElement("h2", { key: "h2", className: "h2" }, "Information");
            childs.push(h2);


            var items: React.ReactElement<Contracts.iProps>[] = [];
            for (var i = 0; i < this.props.Messages.length; i++) {
                var msg = this.props.Messages[i];
                var li = React.createElement("li", { key: "li" + i }, msg);
                items.push(li);
            }

            var ul = React.createElement("ul",
                {
                    id: "ul",
                    key: "ul",
                    ref: "ul",
                    className: "ul",
                    title: "List"
                }, items);
            childs.push(ul);

        }


        var blocks = React.createElement('div',
            {
                id: "scoreBoard",
                key: "scoreBoard",
                ref: "scoreBoard",
                className: "scoreBoard",
                title: "Information",
            }, childs);
        return blocks;
    }

    public OnPass(ev: MouseEvent) {
        GameLoader.GameLoader.store.dispatch({
            type: Contracts.Actions.Pass,
            args: {
            }
        });
    }
}

export default ScoreBoard;