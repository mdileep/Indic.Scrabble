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
        var className: string = (this.props.Waiting.length + this.props.Confirmed.length == 0) ? "td" : "td filled";
        var confirmed = (this.props.Waiting.length == 0 && this.props.Confirmed.length != 0);
        var draggable: boolean = this.props.Waiting.length != 0;
        if (confirmed) { className += " confirmed"; }
        if (draggable) { className += " draggable"; }

        var childs: React.ReactElement<Contracts.iProps>[] = [];
        if (this.props.Weight != 1) {
            childs.push(this.renderWeight());
        }

        var block = React.createElement('td',
            {
                id: this.props.Id,
                ref: this.props.Id,
                className: className,
                title: this.props.Current,
                index: this.props.Index,
                draggable: draggable,
                onDragStart: (evt: DragEvent) => { this.OnDragStart(evt); },
                onDragOver: this.OnDragOver,
                onDrop: (evt: DragEvent) => { this.OnDrop(evt); }
            }, [childs], this.props.Current);
        return block;
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
        var data = JSON.parse(text);
        //
        GameLoader.GameLoader.store.dispatch({
            type: Contracts.Actions.ToBoard,
            args: {
                CellIndex: this.props.Index,
                TileIndex: data.tileIndex,
                TrayIndex: data.trayIndex,
                Src: data.text
            }
        });
    }

    public OnDragStart(ev: DragEvent) {
        if (console) { console.log("Attempting to Move a Tile back to Tray"); }
        //
        var elem = ev.target as HTMLElement;
        var data: any = {
            tileIndex: this.props.Index
        };
        ev.dataTransfer.setData("text", JSON.stringify(data));
    }
}
export default BoardCell;