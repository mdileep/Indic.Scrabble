//---------------------------------------------------------------------------------------------
// <copyright file="Notification.ts" company="Chandam-ఛందం">
//    Copyright © 2013 - 2018 'Chandam-ఛందం' : http://chandam.apphb.com
//    Original Author : Dileep Miriyala (m.dileep@gmail.com)
//    Last Updated    : 29-Apr-2018 18:39EST
//    Revisions:
//       Version    | Author                   | Email                     | Remarks
//       1.0        | Dileep Miriyala          | m.dileep@gmail.com        | Initial Commit
//       _._        | <TODO>                   |   <TODO>                  | <TODO>
// </copyright>
//---------------------------------------------------------------------------------------------

import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Contracts from 'Contracts';
import * as _AlertDialog from '_AlertDialog';
import * as Util from 'Util';
import * as GameLoader from 'GameLoader';

class AlertDialog extends React.Component<Contracts.iAlert, Contracts.iAlert>
{
    constructor(props: Contracts.iAlert) {
        super(props);
        this.state = props;
    }

    render() {
        var id: string = "AlertDialog";
        return React.createElement(((_AlertDialog.default as any) as React.ComponentClass<Contracts.iAlert>), Util.Util.Merge(this.props,
            {
                Id: id,
                key: id,
                ref: id,
                className: id,
                Show: this.props.Show,
                ReadOnly: false,
                //
                ShowClose: false,
                ConfirmText: "OK", ShowConfirm: true,
                OnConfirm: this.props.OnConfirm,
            }));
    }

    public static OnConfirm() {
        GameLoader.GameLoader.store.dispatch({
            type: Contracts.Actions.AlertDismiss,
            args: {
            }
        });
    }
}
export default AlertDialog;