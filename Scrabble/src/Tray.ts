//---------------------------------------------------------------------------------------------
// <copyright file="Tray.ts" company="Chandam-????">
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
import * as Tile from 'Tile';
import * as Contracts from 'Contracts';

class Tray extends React.Component<Contracts.iTrayView, Contracts.iTrayView> {
    constructor(props: Contracts.iTrayView) {
        super(props);
        this.state = props;
    }

    render() {
        var childs: React.ReactElement<Contracts.iProps>[] = [];

        if (this.props.ShowLabel) {
            var label = React.createElement("span", { key: "label", className: "label" }, this.props.Title);
            childs.push(label);
        }

        for (var i = 0; i < this.props.Tiles.length; i++) {
            var tile = this.renderTile(this.props.Tiles[i], i + 1);
            childs.push(tile);
        }

        var className: string = this.props.className + " tray" + (this.props.Show ? "" : " hide");
        var elem = React.createElement('div',
            {
                id: this.props.Id,
                key: this.props.Id,
                ref: this.props.Id,
                className: className,
                title: this.props.Title
            }, childs);
        return elem;
    }

    renderTile(tileProp: Contracts.iTileProps, index: number): React.ReactElement<Contracts.iTileProps> {
        var id = this.props.Id + "_" + (index);
        var tile = React.createElement(((Tile.default as any) as React.ComponentClass<Contracts.iTileProps>),
            {
                Id: id,
                key: id,
                className: "",
                ReadOnly: tileProp.ReadOnly,
                Show: true,
                Text: tileProp.Text,
                Remaining: tileProp.Remaining,
                Total: tileProp.Total,
                Index: tileProp.Index,
                TrayIndex: tileProp.TrayIndex
            });
        return tile;
    }
}
export default Tray;