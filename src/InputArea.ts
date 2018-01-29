import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Tiles from 'Tiles';
import * as Contracts from 'Contracts';
import * as GrpoupSelection from 'Selection';
import * as GameEvents from 'GameEvents';

class InputArea extends React.Component<Contracts.ILeftProps, Contracts.ILeftProps> {
    constructor(props: Contracts.ILeftProps) {
        super(props);
        this.state = props;
    }
    render() {
        if (console) console.log("InputArea")
        var childs: React.ReactElement<Contracts.IProps>[] = [];

        for (var i = 0; i < this.props.items.length; i++) {
            var TilesProp: Contracts.ITilesProps = this.props.items[i];
            TilesProp.key = "G" + TilesProp.id;
            var Group = React.createElement(((GrpoupSelection.default as any) as React.ComponentClass<Contracts.ITilesProps>), TilesProp);
            childs.push(Group);
        }

        for (var i = 0; i < this.props.items.length; i++) {
            var TilesProp: Contracts.ITilesProps = this.props.items[i];
            TilesProp.key = TilesProp.id;
            var Group = React.createElement(((Tiles.default as any) as React.ComponentClass<Contracts.ITilesProps>), TilesProp);
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
        GameEvents.GameEvents.store.dispatch({
            type: 'TO_TRAY', args: {
                index: data.tileIndex
            }
        });
    }

}
export default InputArea;