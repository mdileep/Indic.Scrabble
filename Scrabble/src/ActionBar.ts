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

import * as React from 'react';
import * as GS from 'GameStore';
import * as M from 'Messages';
import * as Contracts from 'Contracts';

class ActionBar extends React.Component<Contracts.iActionBar, Contracts.iActionBar> {
    constructor(props: Contracts.iActionBar) {
        super(props);
        this.state = props;
    }

    render() {
        var childs: React.ReactElement<Contracts.iProps>[] = [];
        var id = "actionBar";
        var suggest = this.renderSuggest();
        var help = this.renderHelp();
        var elem = React.createElement('div',
            {
                id: id,
                key: id,
                ref: id,
                className: "actionBar",
                title: M.Messages.ActionBar,
            }, [suggest, help]);
        return elem;
    }

    public renderHelp(): React.ReactElement<Contracts.iProps> {
        var id = "help";
        var help = React.createElement('button',
            {
                id: id,
                key: id,
                ref: id,
                className: "help",
                title: M.Messages.Help,
                disabled: false,
                onClick: this.OnHelp,
            }, [], M.Messages.Help);
        return help;
    }

    public renderSuggest(): React.ReactElement<Contracts.iProps> {
        var id = "suggest";
        var help = React.createElement('button',
            {
                id: id,
                key: id,
                ref: id,
                className: "suggest",
                title: M.Messages.Suggest,
                style: { visibility: this.props.ReadOnly ? "hidden" : "visible" },
                onClick: this.OnAskSuggestion,
            }, [], M.Messages.Suggest);
        return help;
    }

    public OnAskSuggestion(ev: MouseEvent) {
        GS.GameStore.Dispatch({
            type: Contracts.Actions.RequestSuggestion,
            args: {
            }
        });
    }

    public OnHelp(ev: MouseEvent) {
        GS.GameStore.Dispatch({
            type: Contracts.Actions.AskHelp,
            args: {
            }
        });
    }
}
export default ActionBar;
