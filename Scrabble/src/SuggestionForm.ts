//---------------------------------------------------------------------------------------------
// <copyright file="AlertDialog.ts" company="Chandam-ఛందం">
//    Copyright © 2013 - 2018 'Chandam-ఛందం' : http://chandam.apphb.com
//    Original Author : Dileep Miriyala (m.dileep@gmail.com)
//    Last Updated    : 30-Apr-2018 20:10EST
//    Revisions:
//       Version    | Author                   | Email                     | Remarks
//       1.0        | Dileep Miriyala          | m.dileep@gmail.com        | Initial Commit
//       _._        | <TODO>                   |   <TODO>                  | <TODO>
// </copyright>
//---------------------------------------------------------------------------------------------

import * as React from "react";
import * as Contracts from 'Contracts';
import * as _SuggestionDialog from '_SuggestionDialog';
import * as Util from 'Util';
import * as GameLoader from 'GameLoader';
import * as Messages from 'Messages';
import * as GS from 'GameStore';

class SuggestionForm extends React.Component<Contracts.iSuggestion, Contracts.iSuggestion>
{
    constructor(props: Contracts.iSuggestion) {
        super(props);
        this.state = props;
    }

    render() {
        var id: string = "SuggestDialog";
        return React.createElement(((_SuggestionDialog.default as any) as React.ComponentClass<Contracts.iSuggestion>), Util.Util.Merge(this.props,
            {
                Id: id,
                key: id,
                ref: id,
                className: id,
                ReadOnly: false,
                //
                ShowClose: false,
                ConfirmText: Messages.Messages.OK, ShowConfirm: true,
                Title: Messages.Messages.Suggest,
                OnConfirm: SuggestionForm.Dismiss,
            }));
    }

    static Dismiss(): void {
        GS.GameStore.Dispatch({
            type: Contracts.Actions.DismissSuggestion,
            args: {
            }
        });
    }
}
export default SuggestionForm;