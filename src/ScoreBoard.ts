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

class ScoreBoard extends React.Component<Contracts.iScoreBoard, Contracts.iScoreBoard> {
    constructor(props: Contracts.iScoreBoard) {
        super(props);
        this.state = props;
    }
    render() {

        //var items: React.ReactElement<Contracts.iProps>[] = [];
        //var arr: string[] = this.props.Messages.slice(Math.max(this.props.Messages.length - 5, 1))

        //for (var i = arr.length - 1; i >= 0; i--) {
        //    var li = React.createElement("li", { key: "li" + i }, arr[i]);
        //    items.push(li);
        //}
        //var ol = React.createElement("ol",
        //    {
        //        id: "ol",
        //        key: "ol",
        //        ref: "ol",
        //        className: "ol",
        //        title: "List",
        //    }, items);

        var available = React.createElement("span", { key: "available", className: "span" }, this.props.Available);
        var blocks = React.createElement('div',
            {
                id: "scoreBoard",
                key: "scoreBoard",
                ref: "scoreBoard",
                className: "scoreBoard",
                title: "Information",
            }, [available, available]);
        return blocks;
    }
}

export default ScoreBoard;