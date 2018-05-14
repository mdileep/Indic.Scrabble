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
import * as GS from 'GameStore';

class GameTable extends React.Component<Contracts.iGameTable, Contracts.iGameTable> {
    constructor(props: Contracts.iGameTable) {
        super(props);
        this.state = props;
    }
    render() {
        var childs: React.ReactElement<Contracts.iProps>[] = [];
        var message = this.renderMessage();
        var help = this.renderSuggest();
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
            }, [message, help, reDraw, pass]);
        childs.push(actions);

        var vowelTray = React.createElement(((Tray.default as any) as React.ComponentClass<Contracts.iTrayProps>), Util.Util.Merge(this.props.VowelTray, { ShowLabel: false, ReadOnly: this.props.ReadOnly }));
        childs.push(vowelTray);

        var consoTray = React.createElement(((Tray.default as any) as React.ComponentClass<Contracts.iTrayProps>), Util.Util.Merge(this.props.ConsoTray, { ShowLabel: false, ReadOnly: this.props.ReadOnly }));
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

    public renderMessage(): React.ReactElement<Contracts.iProps> {
        var id = "message";
        var pass = React.createElement('span',
            {
                id: id,
                key: id,
                ref: id,
                className: "message",
                title: this.props.Message
            }, [], this.props.Message);
        return pass;
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

    public renderReDraw(): React.ReactElement<Contracts.iProps> {
        var id = "draw";
        var pass = React.createElement('button',
            {
                id: id,
                key: id,
                ref: id,
                className: "redraw",
                title: "Re-Draw",
                disabled: this.props.ReadOnly || !this.props.CanReDraw,
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
                disabled: this.props.ReadOnly,
            }, [], "Pass");
        return pass;
    }

    public OnPass(ev: MouseEvent) {
        GS.GameStore.Dispatch({
            type: Contracts.Actions.Pass,
            args: {
            }
        });
    }

    public OnReDraw(ev: MouseEvent) {
        GS.GameStore.Dispatch({
            type: Contracts.Actions.ReDraw,
            args: {
            }
        });
    }
    public OnAskSuggestion(ev: MouseEvent) {
        GS.GameStore.Dispatch({
            type: Contracts.Actions.RequestSuggestion,
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
        GS.GameStore.Dispatch({
            type: Contracts.Actions.ToTray,
            args: { Origin: data.Origin, Src: data.Src, SrcCell: data.SrcCell }
        });
    }
}
export default GameTable;
