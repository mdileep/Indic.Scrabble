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

class Tray extends React.Component<Contracts.iTrayProps, Contracts.iTrayProps> {
    constructor(props: Contracts.iTrayProps) {
        super(props);
        this.state = props;
    }
    render() {
        var tiles: React.ReactElement<Contracts.iTileProps>[] = [];
        for (var i = 0; i < this.props.Tiles.length; i++) {
            var tileProp: Contracts.iTileProps = this.props.Tiles[i];
            var id = this.props.Id + "_" + (i + 1);
            var tile = React.createElement(((Tile.default as any) as React.ComponentClass<Contracts.iTileProps>),
                {
                    Id: id,
                    key: id,
                    className: "",
                    Text: tileProp.Text,
                    Remaining: tileProp.Remaining,
                    Total: tileProp.Total,
                    Index: tileProp.Index,
                    TrayIndex: tileProp.TrayIndex
                });
            tiles.push(tile);
        }
        var className: string = this.props.className + " block" + (this.props.Show ? "" : " hide");
        var blocks = React.createElement('div',
            {
                id: this.props.Id,
                key: this.props.Id,
                ref: this.props.Id,
                className: className,
                title: this.props.Title
            }, tiles);
        return blocks;
    }
}
export default Tray;