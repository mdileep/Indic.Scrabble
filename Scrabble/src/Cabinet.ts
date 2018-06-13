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
import * as React from 'react';
import * as Contracts from 'Contracts';
import * as Tray from 'Tray';
import * as TrayRack from 'TrayRack';
import * as GameLoader from 'GameLoader';
import * as Util from 'Util';
import * as GS from 'GameStore';
import * as M from  'Messages';

class Cabinet extends React.Component<Contracts.iCabinetProps, Contracts.iCabinetProps> {
    constructor(props: Contracts.iCabinetProps) {
        super(props);
        this.state = props;
    }
    render() {
        var childs: React.ReactElement<Contracts.iProps>[] = [];

        var groupContainer = this.renderContainer();
        childs.push(groupContainer);

        for (var i = 0; i < this.props.Trays.length; i++) {
            var TilesProp: Contracts.iTrayProps = this.props.Trays[i];
            TilesProp.key = TilesProp.Id;
            var tray = React.createElement(((Tray.default as any) as React.ComponentClass<Contracts.iTrayProps>), Util.Util.Merge(TilesProp, { ShowLabel: true }));
            childs.push(tray);
        }

        var id = "cabinet";
        var className = "cabinet";
        if (!this.props.Show) {
            className += " hide";
        }
        var elem = React.createElement('div',
            {
                id: id,
                key: id,
                ref: id,
                className: className,
                title:M.Messages.Cabinet,
                onDragOver: this.OnDragOver,
                onDrop: (evt: DragEvent) => { this.OnDrop(evt); },
            }, childs);
        return elem;
    }

    public renderContainer() {
        var childs: React.ReactElement<Contracts.iProps>[] = [];
        for (var i = 0; i < this.props.Trays.length; i++) {
            var TilesProp: Contracts.iTrayProps = this.props.Trays[i];
            TilesProp.key = "G" + TilesProp.Id;
            var trayRack = React.createElement(((TrayRack.default as any) as React.ComponentClass<Contracts.iTrayProps>), TilesProp);
            childs.push(trayRack);
        }

        var remaining = React.createElement("span", { key: "remaining", className: "remaining" }, this.props.Remaining);
        childs.push(remaining);

        var id = "trayLabels";
        var groupContainer = React.createElement('div',
            {
                id: id,
                key: id,
                ref: id,
                className: "trayLabels",
                title: M.Messages.TrayLabels
            }, childs);
        return groupContainer;
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
export default Cabinet;