import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Tile from 'Tile';
import * as Contracts from 'Contracts';

class Tiles extends React.Component<Contracts.ITilesProps, Contracts.ITilesProps> {
    constructor(props: Contracts.ITilesProps) {
        super(props);
        this.state = props;
    }
    render() {
        var tiles: React.ReactElement<Contracts.ITileProps>[] = [];
        for (var i = 0; i < this.props.items.length; i++) {
            var tileProp: Contracts.ITileProps = this.props.items[i];
            var id = this.props.id + "_" + (i + 1);
            var tile = React.createElement(((Tile.default as any) as React.ComponentClass<Contracts.ITileProps>),
                {
                    id: id,
                    key: id,
                    text: tileProp.text,
                    count: tileProp.count,
                    index: tileProp.index,
                    groupIndex: tileProp.groupIndex
                });
            tiles.push(tile);
        }
        var className: string = this.props.className + " block" + (this.props.show ? "" : " hide");
        var blocks = React.createElement('div',
            {
                id: this.props.id,
                key: this.props.id,
                ref: this.props.id,
                className: className,
                title: this.props.title
            }, tiles);
        return blocks;
    }
}
export default Tiles;