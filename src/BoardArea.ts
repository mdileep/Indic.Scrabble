import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Contracts from 'Contracts';
import * as BoardCell from 'BoardCell';

class BoardArea extends React.Component<Contracts.IBoardProps, Contracts.IBoardProps> {
    constructor(props: Contracts.IBoardProps) {
        super(props);
        this.state = props;
    }
    render() {
        var index: number = 0;
        var rows: React.ReactElement<Contracts.IProps>[] = [];
        for (var i = 0; i < this.props.size; i++) {
            var cells: React.ReactElement<Contracts.ICellProps>[] = [];
            for (var j = 0; j < this.props.size; j++) {
                var cell = React.createElement(((BoardCell.default as any) as React.ComponentClass<Contracts.ICellProps>), this.props.Cells[index], {});
                cells.push(cell);
                index++;
            }
            var rowId: string = "tile_" + (i + 1);
            var row = React.createElement("tr",
                {
                    id: rowId,
                    key: rowId,
                    ref: rowId,
                    className: "row",
                    title: "Row",
                }, cells);
            rows.push(row);
        }
        var tbody = React.createElement("tbody",
            {
            }, rows);
        var table = React.createElement("table",
            {
                id: "table",
                key: "table",
                ref: "table",
                className: "table",
                title: "Table",
            }, tbody);
        var blocks = React.createElement('div',
            {
                id: "board",
                key: "board",
                ref: "board",
                className: "board",
                title: "Board Area",
            }, [table]);
        return blocks;
    }
}
export default BoardArea;