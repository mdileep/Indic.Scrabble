export interface IProps {
}

export interface ITileProps {
    id: string;
    key: string;
    text: string;
    count: number;
    index: number;
    groupIndex: number;
}

export interface ITilesProps {
    id: string;
    key: string;
    className: string;
    title: string;
    index: number;
    items: ITileProps[];
    show: boolean;
    disabled: boolean;
}

export interface IBoardProps {
    key: string;
    size: number;
    Cells: ICellProps[]
}

export interface ICellProps {
    id: string;
    key: string;
    className: string;
    title: string;
    current: string;
    index: number;
    last: string;
    weight: number;
    waiting: string[];
    confirmed: string[];
}

export interface ITrashProps {

}

export interface ILeftProps {
    key: string;
    items: ITilesProps[];
}
export interface IGameState {
    id: string;
    key: string;
    Left: ILeftProps;
    Center: IBoardProps;
    Right: ITrashProps;
}
export interface IActionArgs {
    type: string;
    args: any;
}

export interface IArgs {
    index: number;
    groupIndex: number;
    tileIndex: number;
    cellIndex: number;
    src: string;
}