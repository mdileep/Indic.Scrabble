//---------------------------------------------------------------------------------------------
// <copyright file="TrayRack.ts" company="Chandam-ఛందం">
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
import * as GS from 'GameStore';

class TrayRack extends React.Component<Contracts.iTrayProps, Contracts.iTrayProps> {
    constructor(props: Contracts.iTrayProps) {
        super(props);
        this.state = props;
    }
    render() {
        var TilesProp: Contracts.iTrayProps = this.props;
        var childs: React.ReactElement<Contracts.iProps>[] = [];
        var chkId = "chk_" + TilesProp.Id;
        var chkBox = React.createElement('input',
            {
                type: "checkbox",
                name: "TileGroup",
                id: chkId,
                key: chkId,
                ref: chkId,
                defaultChecked: TilesProp.Show,
                disabled: TilesProp.Disabled,
                onChange: (evt: DragEvent) => { this.OpenClose(evt); }
            });
        var label = React.createElement('label',
            {
                htmlFor: "chk_" + TilesProp.Id,
                key: "lbl_" + TilesProp.Id
            }, TilesProp.Title);
        childs.push(chkBox);
        childs.push(label);
       var elem = React.createElement('span', null, childs);
        return elem;
    }

    public OpenClose(evt: MouseEvent) {
        GS.GameStore.Dispatch({
            type: Contracts.Actions.OpenOrClose,
            args: { TrayIndex: this.props.Index }
        });
    }
}
export default TrayRack;