import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Contracts from 'Contracts';
import * as GameEvents from 'GameEvents';

class BoardCell extends React.Component<Contracts.ICellProps, Contracts.ICellProps> {
    constructor(props: Contracts.ICellProps) {
        super(props);
        this.state = props;
    }

    render() {
        var className: string = this.props.current.trim().length == 0 ? "td" : "td filled";
        var draggable = (this.props.current.trim().length > 0 || (this.props.last != null && this.props.last != this.props.current));
        if (draggable) { className += " draggable"; }

        var block = React.createElement('td',
            {
                id: this.props.id,
                ref: this.props.id,
                className: className,
                title: this.props.current,
                index: this.props.index,
                draggable: draggable,
                onDragStart: (evt: DragEvent) => { this.OnDragStart(evt); },
                onDragOver: this.OnDragOver,
                onDrop: (evt: DragEvent) => { this.OnDrop(evt); }
            }, [], this.props.current);
        return block;
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
            type: 'MOVE', args: {
                cellIndex: this.props.index,
                tileIndex: data.tileIndex,
                groupIndex: data.groupIndex,
                src: data.text
            }
        });
    }

    public OnDragStart(ev: DragEvent) {
        if (console) console.log("OnDragStart");
        //
        var elem = ev.target as HTMLElement;
        var data: any = {
            tileIndex: this.props.index
        };
        ev.dataTransfer.setData("text", JSON.stringify(data));
    }
}
export default BoardCell;