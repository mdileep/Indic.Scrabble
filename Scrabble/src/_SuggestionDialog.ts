//---------------------------------------------------------------------------------------------
// <copyright file="_SuggestionDialog.ts" company="Chandam-ఛందం">
//    Copyright © 2013 - 2018 'Chandam-ఛందం' : http://chandam.apphb.com
//    Original Author : Dileep Miriyala (m.dileep@gmail.com)
//    Last Updated    : 31-May-2018 20:01EST
//    Revisions:
//       Version    | Author                   | Email                     | Remarks
//       1.0        | Dileep Miriyala          | m.dileep@gmail.com        | Initial Commit
//       _._        | <TODO>                   |   <TODO>                  | <TODO>
// </copyright>
//---------------------------------------------------------------------------------------------

import * as React from 'react';
import * as Contracts from 'Contracts';
import * as Messages from 'Messages';
import * as OverlayDialog from '_OverlayDialog';

class _SuggestionDialog extends OverlayDialog.default<Contracts.iSuggestion, Contracts.iSuggestion>
{
    constructor(props: Contracts.iSuggestion) {
        super(props);
        this.state = props;
    }

    render() {
        var childs: React.ReactElement<Contracts.iProps>[] = [];
        if (!this.props.Loaded) {
            var content = React.createElement('div',
                {
                    key: "suggest_" + this.props.Id,
                    className: "oFContent"
                }, Messages.Messages.SuggestLoading);
            childs.push(content);
        }
        else {
            var items: React.ReactElement<Contracts.iProps>[] = [];
            var hasMoves: boolean = this.props.Moves.length != 0;
            for (var i = 0; i < this.props.Moves.length; i++) {
                var move = this.props.Moves[i];
                {
                    var li = React.createElement("li", { key: "li" + i }, "Direction: " + move.Direction);
                    items.push(li);
                }
                hasMoves = move.Moves.length != 0;
                for (var indx in move.Moves) {
                    var li = React.createElement("li", { key: "li" + i + indx }, move.Moves[indx].Tiles + "  at " + move.Moves[indx].Index);
                    items.push(li);
                }
            }
            if (!hasMoves) {
                var li = React.createElement("li", { key: "li" + i }, Messages.Messages.NoSuggestions);
                items.push(li);
            }
            var id = "ul";
            var ul = React.createElement("ul",
                {
                    id: id,
                    key: id,
                    ref: id,
                    className: "ul",
                    title: ""
                }, items);
            childs.push(ul);
        }

        var content = React.createElement('div',
            {
                key: "suggest_" + this.props.Id,
                className: "oFContent"
            }, childs);

        return this.renderDialog(content);
    }
}
export default _SuggestionDialog;