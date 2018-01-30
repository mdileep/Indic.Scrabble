//---------------------------------------------------------------------------------------------
// <copyright file="Cabinet.ts" company="Chandam-ఛందం">
//    Copyright © 2013 - 2018 'Chandam-ఛందం' : http://chandam.apphb.com
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
import * as Tray from 'Tray';
import * as TrayRack from 'TrayRack';
import * as GameLoader from 'GameLoader';

class Cabinet extends React.Component<Contracts.iCabinetProps, Contracts.iCabinetProps> {
    constructor(props: Contracts.iCabinetProps) {
        super(props);
        this.state = props;
    }
    render() {
        if (console) { console.log("Rendering Cabinet"); }
        var childs: React.ReactElement<Contracts.iProps>[] = [];
        for (var i = 0; i < this.props.Trays.length; i++) {
            var TilesProp: Contracts.iTrayProps = this.props.Trays[i];
            TilesProp.key = "G" + TilesProp.id;
            var Group = React.createElement(((TrayRack.default as any) as React.ComponentClass<Contracts.iTrayProps>), TilesProp);
            childs.push(Group);
        }
        for (var i = 0; i < this.props.Trays.length; i++) {
            var TilesProp: Contracts.iTrayProps = this.props.Trays[i];
            TilesProp.key = TilesProp.id;
            var Group = React.createElement(((Tray.default as any) as React.ComponentClass<Contracts.iTrayProps>), TilesProp);
            childs.push(Group);
        }
        var blocks = React.createElement('div',
            {
                id: "inputs",
                key: "inputs",
                ref: "inputs",
                className: "area",
                title: "Input Area",
                onDragOver: this.OnDragOver,
                onDrop: (evt: DragEvent) => { this.OnDrop(evt); },
            }, childs);
        return blocks;
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
            type: Contracts.Actions.ToTray,
            args: { Index: data.tileIndex }
        });
    }
}
export default Cabinet;