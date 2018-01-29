import * as Contracts from 'Contracts';
export class Parser {
    public static Parse(JSON: any): Contracts.IGameState {
        if (console) console.log("Parse");
        //No Error Handling assuming clean -input
        var left: Contracts.ILeftProps = Parser.ParseLeft(JSON.Left);
        var center: Contracts.IBoardProps = Parser.ParseCenter(JSON.Center);
        var right: Contracts.ITrashProps = Parser.ParseRight(JSON.Right);
        var gameState: Contracts.IGameState = {
            id: JSON.id,
            key: JSON.id,
            Left: left,
            Right: right,
            Center: center
        };
        return gameState;
    }
    public static ParseLeft(JSON: any): Contracts.ILeftProps {
        var raw: Contracts.ILeftProps = ({} as any) as Contracts.ILeftProps;
        raw.key = "Left";
        raw.items = [];
        var index = 0;
        for (var i = 0; i < JSON.Items.length; i++) {
            var item = JSON.Items[i];
            var props: Contracts.ITilesProps = ({} as any) as Contracts.ITilesProps;
            props.id = item.Id;
            props.key = item.Id;
            props.className = item.Id;
            props.title = item.Title;
            props.show = item.Show;
            props.disabled = false;
            props.index = i;
            props.items = [];
            for (var j = 0; j < item.Set.length; j++) {
                var prop: Contracts.ITileProps = ({} as any) as Contracts.ITileProps;
                prop.id = "T_" + (index + 1).toString();
                prop.key = prop.id;
                prop.text = item.Set[j];
                prop.count = item.Count;
                prop.index = j;
                prop.groupIndex = i;
                props.items.push(prop);
                index++;
            }
            raw.items.push(props);
        }
        return raw;
    }
    public static ParseRight(JSON: any): Contracts.ITrashProps {
        var raw: Contracts.ITrashProps = ({} as any) as Contracts.ITrashProps;
        return raw;
    }
    public static ParseCenter(JSON: any): Contracts.IBoardProps {
        var raw: Contracts.IBoardProps = ({} as any) as Contracts.IBoardProps;
        raw.key = "Center";
        raw.size = JSON.Size;
        raw.Cells = [];
        var index = 0;

        for (var i = 0; i < JSON.Size; i++) {
            for (var j = 0; j < JSON.Size; j++) {
                var cell: Contracts.ICellProps = ({} as any) as Contracts.ICellProps;
                cell.id = "C_" + (index + 1).toString();
                cell.key = cell.id;
                cell.weight = JSON.Weights[index];
                cell.current = " ";
                cell.index = index;
                cell.last = "";
                cell.waiting = [];
                cell.confirmed = [];
                raw.Cells.push(cell); index++;
            }
        }
        return raw;
    }
}