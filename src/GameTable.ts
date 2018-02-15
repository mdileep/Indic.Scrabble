//---------------------------------------------------------------------------------------------
// <copyright file="GameTable.ts" company="Chandam-ఛందం">
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
import * as Tray from 'Tray';
import * as Util from 'Util';

class GameTable extends React.Component<Contracts.iGameTable, Contracts.iGameTable> {
    constructor(props: Contracts.iGameTable) {
        super(props);
        this.state = props;
    }
    render() {
        var childs: React.ReactElement<Contracts.iProps>[] = [];

        var reDraw = this.renderReDraw();
        var pass = this.renderPass();

        var id = "actions";
        var actions = React.createElement('div',
            {
                id: id,
                key: id,
                ref: id,
                className: "actions",
                title: "Actions",
            }, [reDraw, pass]);
        childs.push(actions);
        var vowelTray = React.createElement(((Tray.default as any) as React.ComponentClass<Contracts.iTrayProps>), Util.Util.Merge(this.props.VowelTray, { ShowLabel: false }));
        childs.push(vowelTray);

        var consoTray = React.createElement(((Tray.default as any) as React.ComponentClass<Contracts.iTrayProps>), Util.Util.Merge(this.props.ConsoTray, { ShowLabel: false }));
        childs.push(consoTray);



        var id: string = "GameTable";
        var elem = React.createElement('div',
            {
                id: id,
                key: id,
                ref: id,
                className: "gameTable",
                title: "GameTable",
                onDragOver: this.OnDragOver,
                onDrop: (evt: DragEvent) => { this.OnDrop(evt); },
            }, childs);
        return elem;
    }

    public renderReDraw(): React.ReactElement<Contracts.iProps> {
        var id = "draw";
        var pass = React.createElement('button',
            {
                id: id,
                key: id,
                ref: id,
                className: "redraw",
                title: "Re-Draw",
                disabled: !this.props.CanReDraw,
                onClick: this.OnReDraw,
            }, [], "Re-Draw");
        return pass;
    }

    public renderPass(): React.ReactElement<Contracts.iProps> {
        var id = "pass";
        var pass = React.createElement('button',
            {
                id: id,
                key: id,
                ref: id,
                className: "pass",
                title: "Pass",
                onClick: this.OnPass,
            }, [], "Pass");
        return pass;
    }

    public OnPass(ev: MouseEvent) {
        GameLoader.GameLoader.store.dispatch({
            type: Contracts.Actions.Pass,
            args: {
            }
        });
    }

    public OnReDraw(ev: MouseEvent) {
        debugger;
        GameLoader.GameLoader.store.dispatch({
            type: Contracts.Actions.ReDraw,
            args: {
            }
        });
    }

    public OnDragOver(ev: Event) {
        ev.preventDefault();
    }

    public OnDrop(ev: DragEvent) {
        ev.preventDefault();
        //
        var text = ev.dataTransfer.getData("text");
        var data: Contracts.iArgs = JSON.parse(text);
        //
        GameLoader.GameLoader.store.dispatch({
            type: Contracts.Actions.ToTray,
            args: { Origin: data.Origin, Src: data.Src, SrcCell: data.SrcCell }
        });
    }

    //renderClaims() {
    //    var claims = this.props.Claims;
    //    var childs: React.ReactElement<Contracts.iProps>[] = [];
    //    for (var key in claims) {
    //        var chkId = "chk_claims_" + key;
    //        var chkBox = React.createElement('input',
    //            {
    //                type: "checkbox",
    //                name: "Claims",
    //                id: chkId,
    //                key: chkId,
    //                ref: chkId
    //            });
    //        var label = React.createElement('label',
    //            {
    //                htmlFor: "chk_claims_" + key,
    //                key: "lbl_claims" + key
    //            }, claims[key]);
    //        childs.push(chkBox);
    //        childs.push(label);
    //    }
    //if (this.props.Claims.length != 0) {
    //    childs.push(this.renderClaims());
    //    id = "approve";
    //    var approve = React.createElement('button',
    //        {
    //            id: id,
    //            key: id,
    //            ref: id,
    //            className: "pass",
    //            title: "Approve",
    //            onClick: this.OnApprove
    //        }, [], "Approve");
    //    childs.push(approve);
    //}
    //   var elem = React.createElement('span', null, childs);
    //    return elem;
    //}
    //public OnApprove(ev: MouseEvent) {
    //    GameLoader.GameLoader.store.dispatch({
    //        type: Contracts.Actions.Approve,
    //        args: {
    //        }
    //    });
    //}
}
export default GameTable;
