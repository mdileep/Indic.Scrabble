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
import * as _ConfirmDialog from '_ConfirmDialog';
import * as Util from 'Util';
import * as GameLoader from 'GameLoader';
import * as Messages from 'Messages';

class ConfirmDialog extends React.Component<Contracts.iConfirm, Contracts.iConfirm>
{
    constructor(props: Contracts.iConfirm) {
        super(props);
        this.state = props;
    }

    render() {
        var id: string = "ConfrimDialog";
        return React.createElement(((_ConfirmDialog.default as any) as React.ComponentClass<Contracts.iConfirm>), Util.Util.Merge(this.props,
            {
                Id: id,
                key: id,
                ref: id,
                className: id,
                Show: this.props.Show,
                ReadOnly: false,
                //
                ConfirmText: Messages.Messages.Yes, ShowConfirm: true,
                CancelText: Messages.Messages.No, ShowClose: true,
                OnConfirm: this.props.OnConfirm,
                OnCancel: this.props.OnDismiss,
            }));
    }
}
export default ConfirmDialog;