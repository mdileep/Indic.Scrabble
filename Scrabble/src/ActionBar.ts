//---------------------------------------------------------------------------------------------
// <copyright file="ActionBar.ts" company="Chandam-ఛందం">
//    Copyright © 2013 - 2018 'Chandam-ఛందం' : http://chandam.apphb.com
//    Original Author : Dileep Miriyala (m.dileep@gmail.com)
//    Last Updated    : 15-May-2018 20:26EST
//    Revisions:
//       Version    | Author                   | Email                     | Remarks
//       1.0        | Dileep Miriyala          | m.dileep@gmail.com        | Initial Commit
//       _._        | <TODO>                   |   <TODO>                  | <TODO>
// </copyright>
//---------------------------------------------------------------------------------------------

import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Contracts from 'Contracts';
import * as GS from 'GameStore';

class ActionBar extends React.Component<Contracts.iActionBar, Contracts.iActionBar> {
    constructor(props: Contracts.iActionBar) {
        super(props);
        this.state = props;
    }

    render() {
        var childs: React.ReactElement<Contracts.iProps>[] = [];
        var id = "actionBar";
        var suggest = this.renderSuggest();

        var elem = React.createElement('div',
            {
                id: id,
                key: id,
                ref: id,
                className: "actionBar",
                title: "Action Bar",
            }, [suggest]);
        return elem;
    }

    public renderSuggest(): React.ReactElement<Contracts.iProps> {
        var id = "help";
        var help = React.createElement('button',
            {
                id: id,
                key: id,
                ref: id,
                className: "suggest",
                title: "Suggest",
                disabled: this.props.ReadOnly,
                onClick: this.OnAskSuggestion,
            }, [], "Suggest");
        return help;
    }

    public OnAskSuggestion(ev: MouseEvent) {
        GS.GameStore.Dispatch({
            type: Contracts.Actions.RequestSuggestion,
            args: {
            }
        });
    }

}
export default ActionBar;
