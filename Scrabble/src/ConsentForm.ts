//---------------------------------------------------------------------------------------------
// <copyright file="ConfirmDialog.ts" company="Chandam-ఛందం">
//    Copyright © 2013 - 2018 'Chandam-ఛందం' : http://chandam.apphb.com
//    Original Author : Dileep Miriyala (m.dileep@gmail.com)
//    Last Updated    : 30-Apr-2018 20:09EST
//    Revisions:
//       Version    | Author                   | Email                     | Remarks
//       1.0        | Dileep Miriyala          | m.dileep@gmail.com        | Initial Commit
//       _._        | <TODO>                   |   <TODO>                  | <TODO>
// </copyright>
//---------------------------------------------------------------------------------------------

import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Contracts from 'Contracts';
import * as Confirm from 'ConfirmDialog';
import * as Util from 'Util';
import * as GameLoader from 'GameLoader';
import * as Messages from 'Messages';
import * as GS from 'GameStore';

class ConsentForm extends React.Component<Contracts.iConsent, Contracts.iConsent>
{
    constructor(props: Contracts.iConsent) {
        super(props);
        this.state = props;
    }

    render() {
        var childs: React.ReactElement<Contracts.iProps>[] = [];
        if (this.props.Pending.length > 0) {
            var word: string = this.props.Pending[0].Readble;
            var dialog = React.createElement(((Confirm.default as any) as React.ComponentClass<Contracts.iAlert>), Util.Util.Merge({},
                {
                    Show: true,
                    OnConfirm: ConsentForm.Resolve,
                    OnDismiss: ConsentForm.Reject,
                    Title: Messages.Messages.ApproveWord,
                    Message: Util.Util.Format(Messages.Messages.ResolveWord, [word])
                }));
            childs.push(dialog);
        }

        var elem = React.createElement('div',
            {
                key: this.props.Id,
            }, childs);
        return elem;
    }

    static Resolve(): void {
        GS.GameStore.Dispatch({
            type: Contracts.Actions.WordResolved,
            args: {
            }
        });
    }

    static Reject(): void {
        GS.GameStore.Dispatch({
            type: Contracts.Actions.WordRejected,
            args: {
            }
        });
    }
}
export default ConsentForm;