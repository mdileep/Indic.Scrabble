import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Tiles from 'Tiles';
import * as Contracts from 'Contracts';
import * as GameEvents from 'GameEvents';

class GrpoupSelection extends React.Component<Contracts.ITilesProps, Contracts.ITilesProps> {
    constructor(props: Contracts.ITilesProps) {
        super(props);
        this.state = props;
    }
    render() {
        var TilesProp: Contracts.ITilesProps = this.props;

        var childs: React.ReactElement<Contracts.IProps>[] = [];

        var chkId = "chk_" + TilesProp.id;
        var chkBox = React.createElement('input',
            {
                type: "checkbox",
                name: "TileGroup",
                id: chkId,
                key: chkId,
                ref: chkId,
                defaultChecked: TilesProp.show,
                disabled: TilesProp.disabled,
                onChange: (evt: DragEvent) => { this.ToggleGroup(evt); }
            });

        var label = React.createElement('label',
            {
                htmlFor: "chk_" + TilesProp.id,
                key: "lbl_" + TilesProp.id
            }, TilesProp.title);

        childs.push(chkBox);
        childs.push(label);


        var blocks = React.createElement('span', null, childs);
        return blocks;
    }

    public ToggleGroup(evt: MouseEvent) {
        GameEvents.GameEvents.store.dispatch({
            type: 'TOGGLE_GRP', args: { groupIndex: this.props.index }
        });

    }

}

export default GrpoupSelection;