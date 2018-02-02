//---------------------------------------------------------------------------------------------
// <copyright file="RaiseHand.ts" company="Chandam-ఛందం">
//    Copyright © 2013 - 2018 'Chandam-ఛందం' : http://chandam.apphb.com
//    Original Author : Dileep Miriyala (m.dileep@gmail.com)
//    Last Updated    : 01-Feb-2018 13:33EST
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

class RaiseHand extends React.Component<Contracts.iProps, Contracts.iProps> {
    constructor(props: Contracts.iProps) {
        super(props);
        this.state = props;
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

        var blocks = React.createElement('div',
            {
                id: "raiseHand",
                key: "raiseHand",
                ref: "raiseHand",
                className: "raiseHand",
                title: "RaiseHand",
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
export default RaiseHand;