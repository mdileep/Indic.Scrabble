//---------------------------------------------------------------------------------------------
// <copyright file="Tile.ts" company="Chandam-????">
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

class Tile extends React.Component<Contracts.iTileProps, Contracts.iTileProps> {
    constructor(props: Contracts.iTileProps) {
        super(props);
        this.state = props;
    }
    render() {
        var childs: React.ReactElement<Contracts.iProps>[] = [];
        if (this.props.Count > 0) {
            childs.push(this.renderCount());
        }
        childs.push(this.renderContent());
        if (this.props.Count > 0) {
            childs.push(this.renderEmpty());
        }
        var className: string = this.props.Count > 0 ? "span" : "span readonly";
        var draggable = this.props.Count > 0;
        if (draggable) { className += " draggable"; }
        var elem = React.createElement('span',
            {
                id: this.props.Id,
                ref: this.props.Id,
                className: className,
                title: this.props.Text,
                draggable: draggable,
                onDragStart: (evt: DragEvent) => { this.OnDragStart(evt); },
                onClick: this.OnClick
            }, childs);
        return elem;
    }
    public renderContent(): React.ReactElement<Contracts.iProps> {
        var contentId = "content_" + this.props.Id;
        var content = React.createElement('span',
            {
                id: contentId,
                ref: contentId,
                key: contentId,
                className: "content",
                title: this.props.Text,
            }, [], this.props.Text);
        return content;
    }
    public renderCount(): React.ReactElement<Contracts.iProps> {
        var countId = "count_" + this.props.Id;
        var count = React.createElement('span',
            {
                id: countId,
                ref: countId,
                key: countId,
                className: "count",
                title: this.props.Count
            }, [], this.props.Count);
        return count;
    }
    public renderEmpty(): React.ReactElement<Contracts.iProps> {
        var blank = React.createElement('span',
            {
                key: "",
                className: "count",

            }, [], " ");
        return blank;
    }
    public OnDragStart(ev: DragEvent) {
        if (console) { console.log("Attempting to Move a Tile back to Board"); }
        //
        var elem = ev.target as HTMLElement;
        var data: any = {
            trayIndex: this.props.TrayIndex,
            tileIndex: this.props.Index,
            text: this.props.Text
        };
        ev.dataTransfer.setData("text", JSON.stringify(data));
    }
    public OnClick(ev: MouseEvent) {
    }
}
export default Tile;
