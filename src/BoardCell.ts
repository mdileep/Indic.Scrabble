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

class BoardCell extends React.Component<Contracts.iCellProps, Contracts.iCellProps> {
    constructor(props: Contracts.iCellProps) {
        super(props);
        this.state = props;
    }
    render() {
        var className: string = this.getClass();
        var childs: React.ReactElement<Contracts.iProps>[] = [];
        if (this.props.Weight != 1) {
            childs.push(this.renderWeight());
        }
        var text = this.props.Current.length == 0 ? " " : this.props.Current;
        var block = React.createElement('td',
            {
                id: this.props.Id,
                ref: this.props.Id,
                className: className,
                title: this.props.Current,
                index: this.props.Index,
                draggable: this.isDragable(),
                onDragStart: (evt: DragEvent) => { this.OnDragStart(evt); },
                onDragOver: this.OnDragOver,
                onDrop: (evt: DragEvent) => { this.OnDrop(evt); }
            }, [childs], text);
        return block;
    }
    isDragable(): boolean {
        return this.props.Waiting.length != 0;
    }
    getClass(): string {
        var className: string = (this.props.Waiting.length + this.props.Confirmed.length == 0) ? "cell" : "cell filled";
        var confirmed = (this.props.Waiting.length == 0 && this.props.Confirmed.length != 0);
        var draggable: boolean = this.isDragable();
        if (confirmed) { className += " confirmed"; }
        if (draggable) { className += " draggable"; }

        if (confirmed || this.props.Waiting.length != 0) {
            return className;
        }

        switch (this.props.Weight) {
            case 3:
                className += " w3";
                break;
            case 4:
                className += " w4";
                break;
            case 6:
                className += " w6";
                break;
            case 8:
                className += " w8";
                break;
            default:
                break;
        }
        return className;
    }
    public renderWeight(): React.ReactElement<Contracts.iProps> {
        var weightId = "weight_" + this.props.Id;
        var weight = React.createElement('span',
            {
                id: weightId,
                ref: weightId,
                key: weightId,
                className: "weight",
                title: this.props.Weight
            }, [], this.props.Weight);
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
        GameLoader.GameLoader.store.dispatch({
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
        if (console) { console.log("Attempting to Move a Tile back to Tray"); }
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