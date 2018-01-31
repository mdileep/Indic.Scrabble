//---------------------------------------------------------------------------------------------
// <copyright file="User.ts" company="Chandam-ఛందం">
//    Copyright © 2013 - 2018 'Chandam-ఛందం' : http://chandam.apphb.com
//    Original Author : Dileep Miriyala (m.dileep@gmail.com)
//    Last Updated    : 30-Jan-2018 19:32EST
//    Revisions:
//       Version    | Author                   | Email                     | Remarks
//       1.0        | Dileep Miriyala          | m.dileep@gmail.com        | Initial Commit
//       _._        | <TODO>                   |   <TODO>                  | <TODO>
// </copyright>
//---------------------------------------------------------------------------------------------

import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Contracts from 'Contracts';
import * as GameLoader from 'GameLoader';

class GameUser extends React.Component<Contracts.iUser, Contracts.iUser> {
    constructor(props: Contracts.iUser) {
        super(props);
        this.state = props;
    }

    render() {
        var className: string = this.props.Playing ? "player" : "opponent";
        var name = this.props.Playing ? "→ " + this.props.Name + " ←" : this.props.Name;

        var id = "U" + this.props.Id;
        var elem = React.createElement('span',
            {
                id: id,
                ref: id,
                key: id,
                className: className,
                title: this.props.Name,
            }, name);



        var items: React.ReactElement<Contracts.iProps>[] = [];


        //var e1 = React.createElement("li", { key: "1" },  (this.props.Playing ? "Yes" : "No"));
        //items.push(e1);

        var e2 = React.createElement("span", { key: "2", className: "score" }, this.props.Score);
        items.push(e2);

        //var e3 = React.createElement("li", { key: "3" }, "UnConfirmed Score: " + this.props.Unconfirmed);
        //items.push(e3);

        //var ul = React.createElement("ul",
        //    {
        //        id: "ul",
        //        key: "ul",
        //        ref: "ul",
        //        className: "userProp",
        //        title: "List"
        //    }, items);

        var div = React.createElement('div',
            {
                id: this.props.Id,
                ref: this.props.Id,
                key: this.props.Id,
                className: "user",
                title: this.props.Name,
            }, [elem, e2]);


        return div;
    }
}

export default GameUser;