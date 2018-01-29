import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Contracts from 'Contracts';
import * as GameEvents from 'GameEvents';

class Tile extends React.Component<Contracts.ITileProps, Contracts.ITileProps> {
    constructor(props: Contracts.ITileProps) {
        super(props);
        this.state = props;
    }
    render() {
        var childs: React.ReactElement<Contracts.IProps>[] = [];

        if (this.props.count > 0) {
            childs.push(this.renderCount());
        }

        childs.push(this.renderContent());

        if (this.props.count > 0) {
            childs.push(this.renderEmpty());
        }

        var className: string = this.props.count > 0 ? "span" : "span readonly";
        var draggable = this.props.count > 0;
        if (draggable) { className += " draggable"; }

        var elem = React.createElement('span',
            {
                id: this.props.id,
                ref: this.props.id,
                className: className,
                title: this.props.text,
                draggable: draggable,
                onDragStart: (evt: DragEvent) => { this.OnDragStart(evt); },
                onClick: this.OnClick
            }, childs);
        return elem;
    }
    public renderContent(): React.ReactElement<Contracts.IProps> {
        var contentId = "content_" + this.props.id;
        var content = React.createElement('span',
            {
                id: contentId,
                ref: contentId,
                key: contentId,
                className: "content",
                title: this.props.text,
            }, [], this.props.text);
        return content;
    }
    public renderCount(): React.ReactElement<Contracts.IProps> {
        var countId = "count_" + this.props.id;
        var count = React.createElement('span',
            {
                id: countId,
                ref: countId,
                key: countId,
                className: "count",
                title: this.props.count
            }, [], this.props.count);
        return count;
    }
    public renderEmpty(): React.ReactElement<Contracts.IProps> {
        var blank = React.createElement('span',
            {
                key: "",
                className: "count",

            }, [], " ");
        return blank;
    }
    public OnDragStart(ev: DragEvent) {
        if (console) console.log("OnDragStart");
        //
        var elem = ev.target as HTMLElement;
        var data: any = {
            groupIndex: this.props.groupIndex,
            tileIndex: this.props.index,
            text: this.props.text
        };
        ev.dataTransfer.setData("text", JSON.stringify(data));
    }

    public OnClick(ev: MouseEvent) {
    }
}
export default Tile;
