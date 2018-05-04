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


class _OverlayDialog<P extends Contracts.iOverlayDialog, S extends Contracts.iOverlayDialog> extends React.Component<P, S> {

    constructor(props: P) {
        super(props);
        this.state = (props as any) as S;
        this.OnConfirm = this.OnConfirm.bind(this);
        this.OnDismiss = this.OnDismiss.bind(this);
    }

    render() {
        return this.renderDialog(null);
    }

    public renderDialog(content: React.ReactElement<Contracts.iProps>) {
        var childs: React.ReactElement<Contracts.iProps>[] = [];
        if (this.props.Show) {
            var bg = this.renderBackground();
            var fg = this.renderForeground(content);
            childs.push(bg);
            childs.push(fg);
        }
        var elem = React.createElement('div',
            {
                key: this.props.Id,
                className: "olDialog"
            }, childs);
        return elem;
    }

    renderForeground(content: React.ReactElement<Contracts.iProps>) {
        var childs: React.ReactElement<Contracts.iProps>[] = [];

        var title = React.createElement('h2',
            {
                key: "title_" + this.props.Id,
                className: "h2 oFTitle"
            }, this.props.Title);
        childs.push(title);

        if (content != null) {
            childs.push(content);
        }

        var buttons = this.renderActions();
        childs.push(buttons);

        return React.createElement('div',
            {
                key: "fg_" + this.props.Id,
                className: "oForeGround"
            }, childs);
    }

    renderActions() {
        var childs: React.ReactElement<Contracts.iProps>[] = [];

        if (this.props.ShowConfirm) {
            var ok = React.createElement('button',
                {
                    key: "ok_" + this.props.Id,
                    className: "oOK",
                    onClick: this.OnConfirm
                }, [], this.props.ConfirmText);
            childs.push(ok);
        }

        if (this.props.ShowClose) {
            var cancel = React.createElement('button',
                {
                    key: "cancel_" + this.props.Id,
                    className: "oCancel",
                    onClick: this.OnDismiss
                }, [], this.props.CancelText);
            childs.push(cancel);
        }

        return React.createElement('div',
            {
                key: "actions_" + this.props.Id,
                className: "oFButtonHolder"
            }, childs);
    }

    renderBackground() {
        return React.createElement('div',
            {
                key: "bg_" + this.props.Id,
                className: "oBackGround"
            });
    }

    public OnConfirm(ev: MouseEvent) {
        if (this.props.OnConfirm == null) {
            return;
        }
        this.props.OnConfirm();
    }

    public OnDismiss(ev: MouseEvent) {
        if (this.props.OnDismiss == null) {
            return;
        }
        this.props.OnDismiss();
    }
}
export default _OverlayDialog;
