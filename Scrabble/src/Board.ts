//---------------------------------------------------------------------------------------------
// <copyright file="Board.ts" company="Chandam-ఛందం">
//    Copyright © 2013 - 2018 'Chandam-ఛందం' : http://chandam.apphb.com
//    Original Author : Dileep Miriyala (m.dileep@gmail.com)
//    Last Updated    : 29-Jan-2018 21:49EST
//    Revisions:
//       Version    | Author                   | Email                     | Remarks
//       1.0        | Dileep Miriyala          | m.dileep@gmail.com        | Initial Commit
//       _._        | <TODO>                   |   <TODO>                  | <TODO>
// </copyright>
//---------------------------------------------------------------------------------------------

import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Contracts from 'Contracts';
import * as BoardCell from 'BoardCell';
import * as U from  'Util';
import * as M from  'Messages';

class Board extends React.Component<Contracts.iBoardProps, Contracts.iBoardProps> {
    constructor(props: Contracts.iBoardProps) {
        super(props);
        this.state = props;
    }
    render() {
        var index: number = 0;
        var rows: React.ReactElement<Contracts.iProps>[] = [];
        for (var i = 0; i < this.props.Size; i++) {
            var cells: React.ReactElement<Contracts.iCellProps>[] = [];
            for (var j = 0; j < this.props.Size; j++) {
                var cell = React.createElement(((BoardCell.default as any) as React.ComponentClass<Contracts.iCellProps>), U.Util.Merge(this.props.Cells[index], { ReadOnly: this.props.Cells[index].ReadOnly || this.props.ReadOnly }), {});
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
                    title: U.Util.Format(M.Messages.Row, [i + 1]),
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
                className: "table"
            }, tbody);
        var elem = React.createElement('div',
            {
                id: "board",
                key: "board",
                ref: "board",
                className: "board",
                title: M.Messages.Board,
            }, [table]);
        return elem;
    }
}
export default Board;