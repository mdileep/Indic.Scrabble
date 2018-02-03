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
import * as GamePlayer from 'GamePlayer';
import * as GameLoader from 'GameLoader';
import * as Indic from "Indic"
import * as Messages from "Messages"

class InfoBar extends React.Component<Contracts.iInfoBar, Contracts.iInfoBar> {
    constructor(props: Contracts.iInfoBar) {
        super(props);
        this.state = props;
    }
    componentDidUpdate() {
        if (this.refs["ul"] == null) {
            return;
        }
        ReactDOM.findDOMNode(this.refs["ul"]).scrollTop = 10000;
    }
    render() {
        var childs: React.ReactElement<Contracts.iProps>[] = [];
        if (this.props.Messages.length == 0) {
            var blocks = React.createElement('div',
                {
                });
            return blocks;
        }

        var h2 = React.createElement("h2", { key: "h2", className: "h2" }, Messages.Messages.Messages);
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

        var blocks = React.createElement('div',
            {
                id: "infoBar",
                key: "infoBar",
                ref: "infoBar",
                className: "infoBar",
                title: "Messages",
            }, childs);
        return blocks;
    }
}
export default InfoBar;