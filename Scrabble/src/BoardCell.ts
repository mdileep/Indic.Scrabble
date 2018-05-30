//---------------------------------------------------------------------------------------------
// <copyright file="BoardCell.ts" company="Chandam-????">
//    Copyright © 2013 - 2018 'Chandam-????' : http://chandam.apphb.com
//    Original Author : Dileep Miriyala (m.dileep@gmail.com)
//    Last Updated    : 29-Jan-2018 21:53EST
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
import * as GS from 'GameStore';

class BoardCell extends React.Component<Contracts.iCellProps, Contracts.iCellProps> {
    constructor(props: Contracts.iCellProps) {
        super(props);
        this.state = props;
    }
    render() {
        var childs: React.ReactElement<Contracts.iProps>[] = [];
        var textId = "text_" + this.props.Id;
        var text = this.props.Current.length == 0 ? " " : this.props.Current;
        var textElem = React.createElement('span',
            {
                id: textId,
                ref: textId,
                key: textId,
                className: "text",
                title: text
            }, [], text);
        childs.push(this.renderWeight());
        childs.push(textElem);

        var cellId = "cell_" + this.props.Id;
        var container = React.createElement('div',
            {
                id: cellId,
                ref: cellId,
                key: cellId,
                className: "square",
                title: text
            }, childs);

        var className: string = this.getClass();
        var elem = React.createElement('td',
            {
                id: this.props.Id,
                ref: this.props.Id,
                className: className,
                title: this.props.Current,
                index: text,
                draggable: this.isDragable(),
                onDragStart: (evt: DragEvent) => { this.OnDragStart(evt); },
                onDragOver: this.OnDragOver,
                onDrop: (evt: DragEvent) => { this.OnDrop(evt); }
            }, container);
        return elem;
    }
    isDragable(): boolean {
        return this.props.Waiting.length != 0 && !this.props.ReadOnly;
    }
    getClass(): string {
        var classList: string[] = [];
        classList.push("cell");
        if (this.props.Waiting.length + this.props.Confirmed.length != 0) {
            classList.push("filled");
        }
        var covered = (this.props.Waiting.length + this.props.Confirmed.length != 0);
        var confirmed = (this.props.Waiting.length == 0 && this.props.Confirmed.length != 0);
        var draggable: boolean = this.isDragable();
        if (confirmed) { classList.push("confirmed"); }
        if (draggable) { classList.push("draggable"); }
        if (this.props.Star && !covered) { classList.push("star"); }
        if (confirmed || this.props.Waiting.length != 0) {
            return classList.join(' ');
        }
        classList.push("w" + this.props.Weight);
        return classList.join(' ');
    }

    public renderWeight(): React.ReactElement<Contracts.iProps> {
        var weightId = "weight_" + this.props.Id;
        var className = "weight";
        var text = this.props.Weight == 1 ? " " : this.props.Weight;
        var weight = React.createElement('span',
            {
                id: weightId,
                ref: weightId,
                key: weightId,
                className: className,
                title: this.props.Weight
            }, [], text);
        return weight;
    }

    public OnDragOver(ev: Event) {
        ev.preventDefault();
    }

    public OnDrop(ev: DragEvent) {
        ev.preventDefault();
        //
        var text = ev.dataTransfer.getData("text");
        var data = JSON.parse(text) as Contracts.iArgs;
        //
        GS.GameStore.Dispatch({
            type: Contracts.Actions.ToBoard,
            args: {
                TargetCell: this.props.Index,
                Src: data.Src,
                SrcCell: data.SrcCell,
                Origin: data.Origin
            }
        });
    }

    public OnDragStart(ev: DragEvent) {
        //if (console) { console.log("Attempting to Move a Tile back to Tray"); }
        //
        var last = this.props.Waiting[this.props.Waiting.length - 1];
        var elem = ev.target as HTMLElement;
        var data: Contracts.iArgs =
            {
                Src: last,
                Origin: "Cell",
                SrcCell: this.props.Index
            };
        ev.dataTransfer.setData("text", JSON.stringify(data));
    }
}
export default BoardCell;