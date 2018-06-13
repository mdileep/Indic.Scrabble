//---------------------------------------------------------------------------------------------
// <copyright file="AskServer.ts" company="Chandam-ఛందం">
//    Copyright © 2013 - 2018 'Chandam-ఛందం' : http://chandam.apphb.com
//    Original Author : Dileep Miriyala (m.dileep@gmail.com)
//    Last Updated    : 27-Mar-2018 14:38EST
//    Revisions:
//       Version    | Author                   | Email                     | Remarks
//       1.0        | Dileep Miriyala          | m.dileep@gmail.com        | Initial Commit
//       _._        | <TODO>                   |   <TODO>                  | <TODO>
// </copyright>
//---------------------------------------------------------------------------------------------

import * as axios from 'axios';
import * as Contracts from 'Contracts';
import * as Indic from "Indic";
import * as GS from 'GameStore';
import * as GA from 'GameActions';
import * as U from 'Util';
import * as M from 'Messages';
import * as WL from 'WordLoader';
declare var Config: any;

export class AskServer {

    static NextMove(): void {
        GS.GameStore.Dispatch({
            type: Contracts.Actions.BotMove,
            args: {}
        });
    }
    static Validate(): void {
        GS.GameStore.Dispatch({
            type: Contracts.Actions.ResolveWords,
            args: {}
        });
    }

    static Suggest(post: any): void {
        //Decide between Server or Client
        AskServer.SuggestClient(post);
    }
    static BotMove(post: any): void {
        //Decide between Server or Client
        AskServer.BotMoveClient(post);
    }
    static Resolve(words: string[]): void {
        //Decide between Server or Client
        AskServer.ResolveClient(words);
    }

    static SendMetrics(metrics: any): void {
        axios
            .post("/API.ashx?postmetrics", metrics)
            .then(response => {

            })
            .catch(error => {
                //TODO...
            });
    }

    static SuggestServer(post: any): void {
        //TODO...
    }
    static SuggestClient(post: any): void {
        setTimeout(function () {

            var st = performance.now();
            var move: Contracts.ProbableMove = new RegexV2Engine().BestMove(post.Board);
            var effort = U.Util.ElapsedTime(performance.now() - st);

            var response =
                {
                    Action: "suggest",
                    Result: move,
                    Effort: effort
                };

            GS.GameStore.Dispatch({
                type: Contracts.Actions.ReciveSuggestion,
                args: response
            });

        }, Contracts.Settings.ServerWait);
    }

    static BotMoveServer(post: any): void {
        axios
            .post("/API.ashx?nextmove", post.Board)
            .then(response => {
                GS.GameStore.Dispatch({
                    type: Contracts.Actions.BotMoveResponse,
                    args: response.data
                });
            })
            .catch(error => {
                //TODO...
            });
    }
    static BotMoveClient(post: any): void {
        setTimeout(function () {

            var st2 = performance.now();
            var move2: Contracts.ProbableMove = new RegexV2Engine().BestMove(post.Board);
            var effort2 = U.Util.ElapsedTime(performance.now() - st2);

            var response =
                {
                    Action: "nextmove",
                    Result: move2,
                    Effort: effort2
                };

            GS.GameStore.Dispatch({
                type: Contracts.Actions.BotMoveResponse,
                args: response
            });

        }, Contracts.Settings.ServerWait);
    }

    static ResolveServer(words: string[]): void {
        //TODO...
    }
    static ResolveClient(words: string[]): void {
        setTimeout(function () {

            var st = performance.now();
            var invalid = WL.WordLoader.Resolve(words);
            var effort = U.Util.ElapsedTime(performance.now() - st);

            var response =
                {
                    Action: "resolve",
                    Result: invalid,
                    Effort: effort
                };

            GS.GameStore.Dispatch
                ({
                    type: response.Result.length == 0 ?
                        Contracts.Actions.Award :
                        Contracts.Actions.TakeConsent,
                    args: response.Result
                });

        }, Contracts.Settings.ServerWait);
    }
}
export class BoardUtil {
    public static FindNeighbors(index: number, size: number): Contracts.Neighbor {
        var arr: Contracts.Neighbor = ({ Right: -1, Left: -1, Top: -1, Bottom: -1 } as any) as Contracts.Neighbor;
        var pos = BoardUtil.Position(index, size);
        var bottom = BoardUtil.Abs(pos.X + 1, pos.Y, size);
        var top = BoardUtil.Abs(pos.X - 1, pos.Y, size);
        var left = BoardUtil.Abs(pos.X, pos.Y - 1, size);
        var right = BoardUtil.Abs(pos.X, pos.Y + 1, size);
        arr = ({ Right: right, Left: left, Top: top, Bottom: bottom } as any) as Contracts.Neighbor;
        return arr;
    }
    public static Position(N: number, size: number): Contracts.Point {
        var X = Math.floor(N / size);
        var Y = (N % size);
        return ({ X: X, Y: Y } as any) as Contracts.Point;
    }
    public static Abs(X: number, Y: number, size: number): number {
        var min = 0;
        var max = size - 1;
        if ((X < min || X > max) || (Y < min || Y > max)) {
            return -1;
        }
        return (size * (X + 1)) + Y - size;
    }
}
export class ProbableWordComparer {
    static Distinct(_Words: Contracts.ProbableWord[]): Contracts.ProbableWord[] {
        var Words: Contracts.ProbableWord[] = [];
        for (var indx in _Words) {
            if (ProbableWordComparer.Contains(Words, _Words[indx])) {
                continue;
            }
            Words.push(_Words[indx]);
        }
        return Words;
    }
    public static Equals(x: Contracts.ProbableWord, y: Contracts.ProbableWord): boolean {
        if (x.Cells.length != y.Cells.length) { return false; }
        for (var i: number = 0; i < x.Cells.length; i++) {
            if (x.Cells[i].Index != y.Cells[i].Index) {
                return false;
            }
            if (x.Cells[i].Target != y.Cells[i].Target) {
                return false;
            }
        }
        return true;
    }
    public static Contains(Words: Contracts.ProbableWord[], Word: Contracts.ProbableWord): boolean {
        for (var indx in Words) {
            if (ProbableWordComparer.Equals(Words[indx], Word)) {
                return true;
            }
        }
        return false;
    }
}
export class EngineBase {
    static TryHarizontal(Mode: number, Star: number, Cells: string[], size: number, Index: number, offset: number, Pre: string[], Centers: string[], Post: string[]): Contracts.ProbableMove {
        var Moves: Contracts.Word[] = [] as Contracts.Word[];
        var PreCount = Pre.length;
        var PostCount = Post.length;
        var NewCells: string[] = Cells.Clone();
        var Impacted: number[] = [] as number[];

        if (Pre.length != 0) {
            for (var x = Pre.length - 1; x >= 0; x--) {
                var n = BoardUtil.FindNeighbors(Index - x, size);
                if (n.Left != -1) {
                    NewCells[n.Left] += Pre[x];
                    Impacted.push(n.Left);
                    if (Pre[x] == null || Pre[x] == "") {
                        debugger;
                    }
                    Moves.push({ Tiles: Pre[x], Index: n.Left } as Contracts.Word);
                }
                else {
                    return { Words: [] as Contracts.ProbableWord[], Direction: "H", WordsCount: 0, Moves: [] as Contracts.Word[] } as Contracts.ProbableMove;
                }
            }
        }

        if (Centers.length != 0) {
            for (var c = 0; c < Centers.length; c++) {
                var cellIndex = Index + c;
                if (cellIndex == -1 || Centers[c] == "") {
                    continue;
                }

                NewCells[cellIndex] += Centers[c];
                Impacted.push(cellIndex);
                if (Centers[c] == null || Centers[c] == "") {
                    debugger;
                }
                Moves.push({ Tiles: Centers[c], Index: cellIndex } as Contracts.Word);
            }
        }

        if (Post.length != 0) {
            for (var x = 0; x < Post.length; x++) {
                var n = BoardUtil.FindNeighbors(Index + offset + x, size);
                if (n.Right != -1) {
                    NewCells[n.Right] += Post[x];
                    Impacted.push(n.Right);
                    if (Post[x] == null || Post[x] == "") {
                        debugger;
                    }
                    Moves.push({ Tiles: Post[x], Index: n.Right } as Contracts.Word);
                }
                else {
                    return { Words: [] as Contracts.ProbableWord[], Direction: "H", WordsCount: 0, Moves: [] as Contracts.Word[] } as Contracts.ProbableMove;
                }
            }
        }

        var W = [] as Contracts.ProbableWord[];
        if (Star < 0 || (Star >= 0 && NewCells[Star] != "")) {
            for (var i in Impacted) {
                var index = Impacted[i];
                W = W.concat(EngineBase.WordsAt(NewCells, size, index));
            }
        }
        return { Mode: Mode, Words: W, Moves: Moves, WordsCount: W.length, Direction: "H" } as Contracts.ProbableMove;
    }
    static TryVertical(Mode: number, Star: number, Cells: string[], size: number, Index: number, offset: number, Pre: string[], Centers: string[], Post: string[]): Contracts.ProbableMove {
        var Moves = [] as Contracts.Word[];
        var PreCount = Pre.length;
        var PostCount = Post.length;
        var Pos: Contracts.Point = BoardUtil.Position(Index, size);
        var NewCells = Cells.Clone();
        var Impacted = [] as number[];

        if (Pre.length != 0) {
            for (var x = Pre.length - 1; x >= 0; x--) {
                var cellIndex = BoardUtil.Abs(Pos.X - x, Pos.Y, size);
                var n = BoardUtil.FindNeighbors(cellIndex, size);
                if (n.Top != -1) {
                    NewCells[n.Top] += Pre[x];
                    Impacted.push(n.Top);
                    if (Pre[x] == null || Pre[x] == "") {
                        debugger;
                    }
                    Moves.push({ Tiles: Pre[x], Index: n.Top } as Contracts.Word);
                }
                else {
                    return { Words: [] as Contracts.ProbableWord[], Direction: "V", WordsCount: 0, Moves: [] as Contracts.Word[] } as Contracts.ProbableMove;
                }
            }
        }

        if (Centers.length != 0) {
            for (var c = 0; c < Centers.length; c++) {
                var cellIndex = BoardUtil.Abs(Pos.X + c, Pos.Y, size);
                if (cellIndex == -1 || Centers[c] == "") {
                    continue;
                }
                NewCells[cellIndex] += Centers[c];
                Impacted.push(cellIndex);
                if (Centers[c] == null || Centers[c] == "") {
                    debugger;
                }
                Moves.push({ Tiles: Centers[c], Index: cellIndex } as Contracts.Word);
            }
        }

        if (Post.length != 0) {
            for (var x = 0; x < Post.length; x++) {
                var cellIndex = BoardUtil.Abs(Pos.X + offset + x, Pos.Y, size);
                var n = BoardUtil.FindNeighbors(cellIndex, size);
                if (n.Bottom != -1) {
                    NewCells[n.Bottom] += Post[x];
                    Impacted.push(n.Bottom);
                    if (Post[x] == null || Post[x] == "") {
                        debugger;
                    }
                    Moves.push({ Tiles: Post[x], Index: n.Bottom } as Contracts.Word);
                }
                else {
                    return { Words: [] as Contracts.ProbableWord[], Direction: "V", WordsCount: 0, Moves: [] as Contracts.Word[] } as Contracts.ProbableMove;
                }
            }
        }

        var W: Contracts.ProbableWord[] = [] as Contracts.ProbableWord[];
        if (Star < 0 || (Star >= 0 && NewCells[Star] != "")) {
            for (var i in Impacted) {
                var index = Impacted[i];
                W = W.concat(EngineBase.WordsAt(NewCells, size, index));
            }
        }
        return { Mode: Mode, Words: W, Moves: Moves, WordsCount: W.length, Direction: "V" } as Contracts.ProbableMove;
    }
    static RefreshScores(Moves: Contracts.ProbableMove[], Weights: number[], tileWeights: any, size: number): void {
        for (var indx in Moves) {
            var Move = Moves[indx];
            var score: number = 0;
            for (var indx2 in Move.Words) {
                var w = Move.Words[indx2];
                var wordScore = 0;
                for (var indx3 in w.Cells) {
                    var cell = w.Cells[indx3];
                    var weight = Weights[cell.Index];
                    var cellScore = weight;
                    var tiles = cell.Target.split(',');
                    for (var indx4 in tiles) {
                        var tile = tiles[indx4];
                        if (tile == "" || tileWeights[tile] == null) {
                            debugger;//Shouldn't reach here..
                            continue;
                        }
                        cellScore += tileWeights[tile];
                    }
                    cell.Score = cellScore;
                    wordScore += cellScore;
                }
                w.Score = wordScore;
                score = score + wordScore;
            }
            Move.Score = score;
        }
        Moves.sort(function (x: Contracts.ProbableMove, y: Contracts.ProbableMove) { return x.Score - y.Score; });
        Moves.reverse();
    }

    static WordsAt(Cells: string[], size: number, index: number): Contracts.ProbableWord[] {
        var List: Contracts.ProbableWord[] = [] as Contracts.ProbableWord[];
        var Neighbor: Contracts.Neighbor = BoardUtil.FindNeighbors(index, size);

        var r = Neighbor.Right != -1 ? Cells[Neighbor.Right] : "";
        var l = Neighbor.Left != -1 ? Cells[Neighbor.Left] : "";
        var t = Neighbor.Top != -1 ? Cells[Neighbor.Top] : "";
        var b = Neighbor.Bottom != -1 ? Cells[Neighbor.Bottom] : "";

        var Lefties: Contracts.Word[] = [] as Contracts.Word[];
        var Righties: Contracts.Word[] = [] as Contracts.Word[];

        if (r != "") {
            //Move Right..
            Righties.push({ Tiles: r, Index: Neighbor.Right } as Contracts.Word);
            var index_: number = Neighbor.Right;
            var flg: boolean = true;
            while (flg) {
                var n = BoardUtil.FindNeighbors(index_, size);
                var r_ = n.Right != -1 ? Cells[n.Right] : "";
                if (r_ == "") {
                    flg = false;
                    break;
                }
                Righties.push({ Tiles: r_, Index: n.Right } as Contracts.Word);
                index_ = n.Right;
            }
        }
        if (l != "") {
            //Move Left..
            Lefties.push({ Tiles: l, Index: Neighbor.Left } as Contracts.Word);

            var index_ = Neighbor.Left;
            var flg: boolean = true;
            while (flg) {
                var n: Contracts.Neighbor = BoardUtil.FindNeighbors(index_, size);
                var l_ = n.Left != -1 ? Cells[n.Left] : "";
                if (l_ == "") {
                    flg = false;
                    break;
                }
                Lefties.push({ Tiles: l_, Index: n.Left } as Contracts.Word);
                index_ = n.Left;
            }
        }

        var Topies: Contracts.Word[] = [] as Contracts.Word[];
        var Downies: Contracts.Word[] = [] as Contracts.Word[];

        if (t != "") {
            //Move Top..
            Topies.push({ Tiles: t, Index: Neighbor.Top } as Contracts.Word);
            var index_ = Neighbor.Top;
            var flg = true;
            while (flg) {
                var n = BoardUtil.FindNeighbors(index_, size);
                var t_: string = n.Top != -1 ? Cells[n.Top] : "";
                if (t_ == "") {
                    flg = false;
                    break;
                }
                Topies.push({ Tiles: t_, Index: n.Top } as Contracts.Word);
                index_ = n.Top;
            }
        }

        if (b != "") {
            //Move Bottom..
            Downies.push({ Tiles: b, Index: Neighbor.Bottom } as Contracts.Word);
            var index_ = Neighbor.Bottom;
            var flg = true;
            while (flg) {
                var n = BoardUtil.FindNeighbors(index_, size);
                var d_ = n.Bottom != -1 ? Cells[n.Bottom] : "";
                if (d_ == "") {
                    flg = false;
                    break;
                }
                Downies.push({ Tiles: d_, Index: n.Bottom } as Contracts.Word);
                index_ = n.Bottom;
            }
        }

        Topies.reverse();
        Lefties.reverse();

        if (Topies.length + Downies.length > 0) {
            var Vertical = EngineBase.MakeAWord(Topies, { Tiles: Cells[index], Index: index } as Contracts.Word, Downies);
            List.push(Vertical);
        }
        if (Lefties.length + Righties.length > 0) {
            var Harizontal = EngineBase.MakeAWord(Lefties, { Tiles: Cells[index], Index: index } as Contracts.Word, Righties);
            List.push(Harizontal);
        }
        return List;
    }
    static MakeAWord(F1: Contracts.Word[], C: Contracts.Word, F2: Contracts.Word[]): Contracts.ProbableWord {
        var W = {} as Contracts.ProbableWord;
        var List: Contracts.TargetCell[] = [] as Contracts.TargetCell[];
        var ret: string = "";
        for (var indx in F1) {
            var s = F1[indx];
            ret = ret + s.Tiles.Replace(",", "") + ",";
            var Cell: Contracts.TargetCell = { Target: s.Tiles, Index: s.Index } as Contracts.TargetCell;
            List.push(Cell);
        }
        {
            ret = ret + C.Tiles.Replace(",", "") + ",";
            var Cell: Contracts.TargetCell = { Target: C.Tiles, Index: C.Index } as Contracts.TargetCell;
            List.push(Cell);
        }
        for (var indx in F2) {
            var s = F2[indx];
            ret = ret + s.Tiles.Replace(",", "") + ",";
            var Cell: Contracts.TargetCell = { Target: s.Tiles, Index: s.Index } as Contracts.TargetCell;
            List.push(Cell);
        }
        ret = ret.Trim(',');
        W.String = ret;
        W.Cells = List;
        return W;
    }
}
export class RegexEngineBase extends EngineBase {
    public BestMove(Board: Contracts.ScrabbleBoard): Contracts.ProbableMove {
        var Moves = this.Probables(Board);
        if (Moves.length == 0) {
            return null;
        }
        return Moves[0];
    }

    public Probables(Board: Contracts.ScrabbleBoard): Contracts.ProbableMove[] {
        return [];
    }

    Validate(InputDict: any, CharCount: any): boolean {
        if (InputDict == null) {
            return true;
        }
        var isValid = true;
        for (var key in CharCount) {
            var item = CharCount[key];
            if (InputDict[key] == null) {
                isValid = false;
                break;
            }
            if (InputDict[item.Key] < item.Value) {
                isValid = false;
                break;
            }
        }
        return isValid;
    }

    static Resolve2(prev: string, Tiles: string[], SpeicalList: any): any {
        if (U.Util.IsNullOrEmpty(prev)) {
            return { res: true, temp: "" };
        }
        if (prev.length == 1) {
            if (Tiles.Contains(prev)) {
                Tiles.Remove(prev);
                return { res: true, temp: prev };
            }
            else {
                return { res: false, temp: prev }; //Can't be Reoslved for Sure.
            }
        }
        else {
            if (SpeicalList.hasOwnProperty(prev)) {
                if (Tiles.Contains(prev)) {
                    Tiles.Remove(prev);
                    return { res: true, temp: prev };
                }
                //More checks needed
            }

            //region Is a Set of Specials
            for (var key in SpeicalList) {
                var special = SpeicalList[key];
                if (!special.test(prev)) {
                    continue;
                }

                if (Tiles.Contains(key)) {
                    Tiles.Remove(key);
                }
                else {
                    continue;
                }
                var order = [] as string[];

                var M = special.exec(prev);
                var Pre = M.groups["Pre"];
                var Center = M.groups["Center"];
                var Post = M.groups["Post"];

                if (!U.Util.IsNullOrEmpty(Pre)) {
                    var temp = "";
                    var resolved = RegexEngine.Resolve2(Pre, Tiles, SpeicalList);
                    if (!resolved.res) {
                        return { res: false, temp: Pre };
                    }
                    temp = resolved.temp;
                    order.push(U.Util.IsNullOrEmpty(temp) ? Pre : temp);
                }
                order.push(special.Key);

                if (!U.Util.IsNullOrEmpty(Center)) {
                    var temp = "";
                    var resolved = RegexEngine.Resolve2(Center, Tiles, SpeicalList);
                    if (!resolved.res) {
                        return { res: false, temp: Center };
                    }
                    order.push(U.Util.IsNullOrEmpty(temp) ? Center : temp);
                }

                if (!U.Util.IsNullOrEmpty(Post)) {
                    var temp = "";
                    var resolved = RegexEngine.Resolve2(Post, Tiles, SpeicalList);
                    if (!resolved) {
                        return { res: false, temp: "" };
                    }
                    order.push(U.Util.IsNullOrEmpty(temp) ? Post : temp);
                }
                return { res: true, temp: order.join(',') };
            }
            //Now Every Char must be resovled.
            {
                var order = [] as string[];
                for (var i: number = 0; i < prev.length; i++) {
                    var c = prev[i];
                    if (Tiles.Contains(c)) {
                        Tiles.Remove(c);
                        order.push(c);
                    }
                    else {
                        return { res: false, temp: c }; //Can't be Reoslved for Sure.
                    }
                }
                return { res: true, temp: order.join(',') };
            }
        }
    }
    static Resolve(Pres: string[], Centers: string[], Posts: string[], Tiles: string[], SpeicalDict: any): boolean {
        //var st = performance.now();

        var res: boolean = true;
        for (var i = 0; i < Pres.length; i++) {
            var tile = Pres[i];
            var result = RegexEngine.Resolve2(tile, Tiles, SpeicalDict);
            if (!result.res) {
                return false;
            }
            var temp = result.temp;
            if (!U.Util.IsNullOrEmpty(temp)) {
                Pres[i] = temp;
            }
        }
        for (var i = 0; i < Centers.length; i++) {
            var tile = Centers[i];
            var result = RegexEngine.Resolve2(tile, Tiles, SpeicalDict);
            if (!result.res) {
                return false;
            }
            var temp = result.temp;
            if (!U.Util.IsNullOrEmpty(temp)) {
                Centers[i] = temp;
            }
        }
        for (var i = 0; i < Posts.length; i++) {
            var tile = Posts[i];
            var result = RegexEngine.Resolve2(tile, Tiles, SpeicalDict);
            if (!result.res) {
                return false;
            }
            var temp = result.temp;
            if (!U.Util.IsNullOrEmpty(temp)) {
                Posts[i] = temp;
            }
        }

        //if (console) { console.log(U.Util.Format("\t\tResolve: {0}", [U.Util.ElapsedTime(performance.now() - st)])); }
        return true;
    }

    MatchedWords(words: Contracts.Word[], Pattern: string): Contracts.Word[] {
        var r = RegExp(Pattern);
        var List = words.filter(function (s: Contracts.Word) { return r.test(s.Tiles); });
        return List;
    }
    static MatchedString(group: any, seperator: string): string {
        if (group == null) {
            return "";
        }
        var ret: string = "";
        for (var indx in group) {
            var capture = group[indx];
            ret = ret + capture + seperator;
        }
        if (!U.Util.IsNullOrEmpty(seperator)) {
            ret = ret.TrimEnd(seperator);
        }
        return ret;
    }

    static GetWordsOnBoard(Cells: string[], size: number, includeDuplicates: boolean): Contracts.Word[] {
        var Words: Contracts.Word[] = [] as Contracts.Word[];
        for (var i = 0; i < size; i++) {
            var R = RegexEngine.GetWords(Cells, "R", i, size, includeDuplicates);
            var C = RegexEngine.GetWords(Cells, "C", i, size, includeDuplicates);
            Words = Words.concat(R);
            Words = Words.concat(C);
        }
        return Words;
    }
    static GetWords(Cells: string[], option: string, r: number, size: number, includeDuplicates: boolean): Contracts.Word[] {
        var Words: Contracts.Word[] = [] as Contracts.Word[];
        var pending = "";
        var cnt = 0;
        for (var i = 0; i < size; i++) {
            var index = -1;
            switch (option) {
                case "R":
                    index = BoardUtil.Abs(r, i, size);
                    break;
                case "C":
                    index = BoardUtil.Abs(i, r, size);
                    break;
            }
            var cell = Cells[index];
            if (cell != "") {
                pending += "(" + cell + ")|";
                cnt++;
                continue;
            }
            if (pending != "" && cell == "") {
                if (cnt > 1) {
                    var word = pending.TrimEnd('|');
                    if (includeDuplicates) {
                        var startIndex: number = RegexEngine.GetStartIndex(option, r, i, size, cnt);
                        Words.push({ Tiles: word, Syllables: cnt, Position: option, Index: startIndex } as Contracts.Word);
                    }
                    else {
                        var X: Contracts.Word[] = Words.filter(x => x.Tiles == word);
                        if (X == null || X.length == 0) {
                            var startIndex: number = RegexEngine.GetStartIndex(option, r, i, size, cnt);
                            Words.push({ Tiles: word, Syllables: cnt, Position: option, Index: startIndex } as Contracts.Word);
                        }
                    }
                }
                pending = "";
                cnt = 0;
                continue;
            }
        }
        if (cnt > 1) {
            var word = pending.TrimEnd('|');
            if (includeDuplicates) {
                var startIndex = RegexEngine.GetStartIndex(option, r, size, size, cnt);
                Words.push({ Tiles: word, Syllables: cnt, Position: option, Index: startIndex } as Contracts.Word);
            }
            else {
                var X: Contracts.Word[] = Words.filter(x => x.Tiles == word);
                if (X == null || X.length == 0) {
                    var startIndex = RegexEngine.GetStartIndex(option, r, size, size, cnt);
                    Words.push({ Tiles: word, Syllables: cnt, Position: option, Index: startIndex } as Contracts.Word);
                }
            }
        }
        return Words;
    }

    static GetStartIndex(option: string, r: number, pos: number, size: number, move: number): number {
        switch (option) {
            case "R":
                return BoardUtil.Abs(r, pos - move, size);

            case "C":
                return BoardUtil.Abs(pos - move, r, size);

        }
        return -1;
    }

    static GetSyllableList2(Cells: string[], size: number, filter: boolean, free: boolean): Contracts.Word[] {
        var List: Contracts.Word[] = [] as Contracts.Word[];
        for (var index: number = 0; index < Cells.length; index++) {
            var cell: string = Cells[index];
            if (cell == "") {
                continue;
            }
            var Neighbor = BoardUtil.FindNeighbors(index, size);

            var r = Neighbor.Right != -1 ? Cells[Neighbor.Right] : "";
            var l = Neighbor.Left != -1 ? Cells[Neighbor.Left] : "";
            var t = Neighbor.Top != -1 ? Cells[Neighbor.Top] : "";
            var b = Neighbor.Bottom != -1 ? Cells[Neighbor.Bottom] : "";

            if (filter) {
                if ((r != "" || l != "") && (t != "" || b != "")) {
                }
                else {
                    var x = free ? cell : "(" + cell + ")";
                    List.push({ Tiles: x, Index: index } as Contracts.Word);
                }
            }
            else {
                var x = free ? cell : "(" + cell + ")";
                List.push({ Tiles: x, Index: index } as Contracts.Word);
            }
        }
        return List;
    }
    GetSyllableList(Cells: string[], size: number, fetchAll: boolean, filterEdges: boolean, asGroups: boolean): string[] {
        var List: string[] = [] as string[];
        for (var index = 0; index < Cells.length; index++) {
            var cell: string = Cells[index];
            if (cell == "") {
                continue;
            }
            var Neighbor: Contracts.Neighbor = BoardUtil.FindNeighbors(index, size);

            var r: string = Neighbor.Right != -1 ? Cells[Neighbor.Right] : "";
            var l: string = Neighbor.Left != -1 ? Cells[Neighbor.Left] : "";
            var t: string = Neighbor.Top != -1 ? Cells[Neighbor.Top] : "";
            var b: string = Neighbor.Bottom != -1 ? Cells[Neighbor.Bottom] : "";

            if (!fetchAll) {
                if ((r != "" || l != "") && (t != "" || b != "")) {
                    if (!filterEdges) {
                        var x: string = asGroups ? cell : "(" + cell + ")";
                        if (!List.Contains(x)) {
                            List.push(x);
                        }
                    }
                }
                else {
                    if (filterEdges) {
                        var x: string = asGroups ? cell : "(" + cell + ")";
                        if (!List.Contains(x)) {
                            List.push(x);
                        }
                    }
                }
            }
            else {
                var x: string = asGroups ? cell : "(" + cell + ")";
                if (!List.Contains(x)) {
                    List.push(x);
                }
            }
        }
        return List;
    }
    static GetSpecialSyllablePattern2(CharSet: Contracts.CharSet, specialOptions: string): string {
        if (U.Util.IsNullOrEmpty(specialOptions)) {
            return "";
        }

        var ret: string = "";
        {
            var temp: string = "";

            var Consos: string[] = [] as string[];
            var Vowels: string[] = [] as string[];
            RegexEngineBase.Classify2(CharSet, specialOptions, Consos, Vowels);

            if (Vowels.length > 0 && Consos.length > 0) {
                //Both Exists
                //(మ[ConsoOptions]ఉ)
                for (var indx in Consos) {
                    var a: string = Consos[indx];
                    temp = temp + a;
                }
                temp = temp + "(?<Center>.*?)";
                for (var indx in Vowels) {
                    var a: string = Vowels[indx];
                    temp = temp + a;
                }
                temp = "(?<Pre>.*?)" + temp + "(?<Post>.*?)";
            }
            else {
                //Both Exists
                //(కష)
                for (var indx in Consos) {
                    var a: string = Consos[indx];
                    temp = temp + a;
                }
                for (var indx in Vowels) {
                    var a: string = Vowels[indx];
                    temp = temp + a;
                }
                temp = "(?<Pre>.*?)" + temp + "(?<Post>.*?)";
            }
            ret = "^" + temp + "$";
        }
        return ret;
    }
    static GetSyllablePattern(CharSet: Contracts.CharSet, syllable: string, consoPatternNoComma: string, sunnaPattern: string, allPatternNoComma: string): string {
        var temp: string = "";
        var Consos: string[] = [] as string[];
        var Vowels: string[] = [] as string[];
        RegexEngineBase.Classify(CharSet, syllable, Consos, Vowels);

        if (Vowels.length > 0 && Consos.length > 0) {
            // H-V:
            //       H1 ConsoPatternNoComma V1 AllPattern
            var tempC: string = "";
            for (var indx in Consos) {
                var a = Consos[indx];
                tempC = tempC + a;
            }

            var tempA: string = "";
            for (var indx in Vowels) {
                var a = Vowels[indx];
                tempA = tempA + a;
            }
            ////కష(ConsoNoComma)ఇ(Sunna)
            temp = U.Util.Format("{0}{1}{2}{3}", [tempC, consoPatternNoComma, tempA, sunnaPattern]);
        }
        else {
            for (var indx in Consos) {
                var a = Consos[indx];
                temp = temp + a;
            }
            if (Vowels.length == 0) {
                //కష(AllNoComma)
                temp = U.Util.Format("{0}{1}", [temp, allPatternNoComma == "" ? "" : (allPatternNoComma)]);
            }

            for (var indx in Vowels) {
                var a = Vowels[indx];
                temp = temp + a;
            }

            if (Consos.length == 0) {
                //అ(Sunna)
                temp = U.Util.Format("{0}{1}", [temp, sunnaPattern]);
            }

            if (Vowels.length == 0 && Consos.length == 0) {
                debugger;
            }

        }
        return temp;
    }
    static GetSyllablePattern2(CharSet: Contracts.CharSet, syllable: string, consoPatternNoComma: string, prePattern: string, PostPattern: string): string {
        var temp: string = "";
        var Consos: string[] = [] as string[];
        var Vowels: string[] = [] as string[];
        RegexEngineBase.Classify(CharSet, syllable, Consos, Vowels);

        if (Vowels.length > 0 && Consos.length > 0) {
            // H-V:
            //       AllPattern H1 ConsoPatternNoComma V1 AllPattern
            var tempC: string = "";
            for (var indx in Consos) {
                var a: string = Consos[indx];
                tempC = tempC + a;
            }

            var tempA: string = "";
            for (var indx in Vowels) {
                var a: string = Vowels[indx];
                tempA = tempA + a;
            }
            temp = U.Util.Format("({3}({0}{1}{2}){4})", [tempC, consoPatternNoComma, tempA, prePattern, PostPattern]);
        }
        else {
            // Accu or Hallu:
            //      AllPattern Accu AllPattern
            for (var indx in Consos) {
                var a: string = Consos[indx];
                temp = temp + a;
            }
            for (var indx in Vowels) {
                var a: string = Vowels[indx];
                temp = temp + a;
            }
            temp = U.Util.Format("({1}{0}{2})", [temp, prePattern, PostPattern]);
        }
        return temp;
    }

    static Join(str: string, join: string): string {
        var ret: string = "";
        for (var indx = 0; indx < str.length; indx++) {
            var ch: string = str[indx];
            ret = ret + ch + join;
        }
        ret = ret.TrimEnd(join);
        return ret;
    }

    GetFlatList2(inputs: string[]): string {
        var list = inputs.Clone();
        list.sort();

        var X: string[] = [] as string[];
        for (var indx in list) {
            var input: string = list[indx];
            if (!X.Contains(input)) {
                X.push(input);
            }
        }

        return this.GetFlatList(X, ' ').Replace(" ", "");
    }
    GetFlatList(List: string[], Seperator: string): string {
        var ret = "";
        for (var indx in List) {
            var s: string = List[indx];
            ret = ret + s + Seperator;
        }
        ret = ret.TrimEnd(Seperator);
        return ret;
    }
    GetFlatList3(List: Contracts.Word[], Seperator: string): string {
        var ret: string = "";
        for (var indx in List) {
            var s: Contracts.Word = List[indx];
            ret = ret + s.Tiles + Seperator;
        }
        ret = ret.TrimEnd(Seperator);
        return ret;
    }

    DistinctList(Set: string, Seperator: string): string[] {
        var List = [] as string[];
        var arr: string[] = Set.split(Seperator);
        for (var indx in arr) {
            var s: string = arr[indx];
            if (U.Util.IsNullOrEmpty(s)) {
                continue;
            }
            if (!List.Contains(s)) {
                List.push(s);
            }
        }
        return List;
    }
    GetCountDict2(input: string): any {
        var Dict = {} as any;
        var arr: string[] = input.split(',');
        for (var indx in arr) {
            var s = arr[indx];
            for (var indx2 = 0; indx2 < s.length; indx2++) {
                var c = s[indx2];
                if (Dict.hasOwnProperty(c)) {
                    Dict[c]++;
                }
                else {
                    Dict[c] = 1;
                }
            }
        }
        return Dict;
    }
    GetCountDict(inputs: string[]): any {
        if (inputs == null) {
            return null;
        }
        var Dict: any = {};
        for (var indx in inputs) {
            var input: string = inputs[indx];
            if (U.Util.IsNullOrEmpty(input)) {
                continue;
            }
            if (Dict.hasOwnProperty(input)) {
                Dict[input]++;
            }
            else {
                Dict[input] = 1;
            }
        }
        return Dict;
    }

    static Classify(CharSet: Contracts.CharSet, syllable: string, Consos: string[], Vowels: string[]): void {
        var Sunna = [] as string[];
        var arr = syllable.split(',');
        for (var indx in arr) {
            var c = arr[indx];
            if (CharSet.SunnaSet.Contains(c)) {
                Sunna.push(c);
            }
            else {
                if (CharSet.Vowels.Contains(c)) {
                    Vowels.push(c);
                }
                else if (CharSet.Consonents.Contains(c)) {
                    Consos.push(c);
                }
                else {
                    debugger;
                }
            }
        }
        Vowels = Vowels.concat(Sunna);
    }
    static Classify2(CharSet: Contracts.CharSet, syllable: string, Consos: string[], Vowels: string[]): void {
        var Sunna = [] as string[];
        for (var indx = 0; indx < syllable.length; indx++) {
            var c = syllable[indx];
            if (CharSet.SunnaSet.Contains(c)) {
                Sunna.push(c);
            }
            else {
                if (CharSet.Vowels.Contains(c)) {
                    Vowels.push(c);
                }
                else if (CharSet.Consonents.Contains(c)) {
                    Consos.push(c);
                }
                else {
                    debugger;
                }
            }
        }
        Vowels = Vowels.concat(Sunna);
    }

    static GenWordPattern(CharSet: Contracts.CharSet, word: string, consoPatternNoComma: string, sunnaPattern: string, allPatternNoComma: string, prePattern: string, postPattern: string, useSyllableIndex: boolean): string {
        var temp: string = "";
        var arr = word.split('|');
        for (var i = 0; i < arr.length; i++) {
            var syllable: string = arr[i];
            var pattern: String = "";
            if (useSyllableIndex) {
                pattern = RegexEngine.GetSyllablePattern(CharSet,
                    syllable.Replace("(", "").Replace(")", ""),
                    U.Util.Format(consoPatternNoComma, [i + 1]),
                    U.Util.Format(sunnaPattern, [i + 1]),
                    i == arr.length - 1 ? "" : U.Util.Format(allPatternNoComma, [i + 1]));
            }
            else {
                pattern = RegexEngine.GetSyllablePattern(CharSet,
                    syllable.Replace("(", "").Replace(")", ""),
                    consoPatternNoComma,
                    sunnaPattern,
                    i == arr.length - 1 ? "" : allPatternNoComma);
            }
            temp = temp + pattern + ",";
        }
        temp = temp.TrimEnd(',');
        temp = prePattern + temp + postPattern;
        temp = U.Util.Format("({0})|", [temp]);
        return temp;
    }

    GetSpecialDict(CharSet: Contracts.CharSet, SpecialList: string[]): any {
        var SpeicalDict = {} as any;
        for (var indx in SpecialList) {
            var sp = SpecialList[indx];
            var pattern: string = RegexEngine.GetSpecialSyllablePattern2(CharSet, sp);
            SpeicalDict[sp] = new RegExp(pattern);
        }
        return SpeicalDict;
    }
    MaxWeightIndex(Weights: number[]): number {
        var maxIndex = 0;
        var maxVal = 0;
        var index = 0;
        for (var indx in Weights) {
            var weight = Weights[index];
            if (weight > maxVal) {
                maxVal = weight;
                maxIndex = index;
            }
            index++;
        }
        return maxIndex;
    }
}
export class RegexEngine extends RegexEngineBase {
    public Probables(Board: Contracts.ScrabbleBoard): Contracts.ProbableMove[] {
        var Moves = [] as Contracts.ProbableMove[];

        if (Board == null) {
            return;
        }

        var bot: Contracts.Bot = GameConfig.GetBot(Board.Bot);

        //
        var board: Contracts.KnownBoard = GameConfig.GetBoard(Board.Name);
        if (board == null) {
            return;
        }

        //
        var CharSet = GameConfig.GetCharSet(board.Language);
        var id = bot.Id + Board.Id;
        //
        var size = board.Size;
        var weights = board.Weights;
        var tileWeights = board.TileWeights;
        var start = board.Star;
        //
        var cells = Board.Cells;
        var vowels = Board.Vowels;
        var conso = Board.Conso;
        var special = Board.Special;
        var file = (bot == null) ? CharSet.Dictionary : bot.Dictionary;

        if (CharSet == null || cells == null || weights == null || U.Util.IsNullOrEmpty(file) ||
            (U.Util.IsNullOrEmpty(vowels) && U.Util.IsNullOrEmpty(conso) && U.Util.IsNullOrEmpty(special))) {
            return Moves;
        }
        if (cells.length != size * size || weights.length != size * size) {
            return Moves;
        }

        var All = [] as string[];
        var AllPattern = "";

        var Movables = (vowels + " " + conso + " " + special);
        var MovableList = Movables.Replace("(", " ").Replace(")", " ").Replace(",", "").split(' ');
        MovableList = MovableList.filter(function (x) { return x.length != 0; });

        var SpecialList = this.DistinctList(special.Replace("(", " ").Replace(")", " ").Replace(",", ""), ' ');
        var SpeicalDict = this.GetSpecialDict(CharSet, SpecialList);

        var EverySyllableOnBoard = this.GetSyllableList(cells, size, true, false, true);
        var NonCornerSyllables = this.GetSyllableList(cells, size, false, true, false);
        //
        All = (this.GetFlatList(EverySyllableOnBoard, ',') + " " + Movables).Replace("(", " ").Replace(")", " ").Replace(",", " ").Replace("|", " ").split(' ');
        AllPattern = U.Util.Format("^(?<All>[{0},])*$", [this.GetFlatList2(All)]);
        var AllDict = this.GetCountDict(All);

        var WordsDictionary = WL.WordLoader.LoadWords(file, (bot == null)); //Large Set of Words
        WordsDictionary = this.ShortList(WordsDictionary, AllPattern, AllDict); // Probables 

        //if (console) { console.log("\t\tProbables: V1: " + WordsDictionary.length); }

        if (EverySyllableOnBoard.length > 0) {
            var NonCornerTiles = [] as string[];
            var NonCornerPattern = "";
            //
            NonCornerTiles = (this.GetFlatList2(NonCornerSyllables) + " " + Movables).Replace("(", " ").Replace(")", " ").Replace(",", " ").Replace("|", " ").split(' ');
            NonCornerPattern = U.Util.Format("^(?<All>[{0},])*$", [this.GetFlatList2(NonCornerTiles)]);
            var NonCornerDict = this.GetCountDict(NonCornerTiles);
            var NonCornerProbables = this.ShortList(WordsDictionary, NonCornerPattern, NonCornerDict);  //Non Corner Probables

            Moves = Moves.concat(RegexEngine.SyllableExtensions(cells, size, CharSet, WordsDictionary, NonCornerProbables, MovableList, SpeicalDict));
            Moves = Moves.concat(RegexEngine.WordExtensions(cells, size, CharSet, WordsDictionary, MovableList, SpeicalDict));
        }
        else {
            Moves = Moves.concat(RegexEngine.EmptyExtensions(cells, size, CharSet, start, WordsDictionary, MovableList, SpeicalDict));
        }

        WordsDictionary = null;
        EngineBase.RefreshScores(Moves, weights, tileWeights, size);
        return Moves;
    }

    static EmptyExtensions(Cells: string[], size: number, CharSet: Contracts.CharSet, startIndex: number, AllWords: Contracts.Word[], Movables: string[], SpeicalDict: any): Contracts.ProbableMove[] {
        //var st = performance.now();
        var Moves = [] as Contracts.ProbableMove[];
        {
            for (var indx in AllWords) {
                var word: Contracts.Word = AllWords[indx];
                var Pre = "";
                var Center = "";
                var Post = "";
                var f = word.Tiles.indexOf(',');

                Center = word.Tiles.substring(0, f);
                Post = word.Tiles.substring(f + 1);

                var Pres = Pre == "" ? [] as string[] : Pre.TrimEnd(',').split(',');
                var Centers = Center.split(',');
                var Posts = Post == "" ? [] as string[] : Post.TrimStart(',').split(',');

                var Tiles = Movables.slice(0, Movables.length);
                var res = RegexEngine.Resolve(Pres, Centers, Posts, Tiles, SpeicalDict);
                if (!res) {
                    continue;
                }
                var totalCells = Pres.length + Centers.length + Posts.length;
                var centroid = totalCells % 2 == 0 ? (Math.floor(totalCells / 2) - 1) : Math.floor(totalCells / 2);

                var WH = EngineBase.TryHarizontal(0, startIndex, Cells, size, startIndex - centroid, 0, Pres, Centers, Posts);
                var WV = EngineBase.TryVertical(0, startIndex, Cells, size, startIndex - centroid, 0, Pres, Centers, Posts);

                var WHValid = RegexEngine.Validate3(WH, AllWords);
                var WVValid = RegexEngine.Validate3(WV, AllWords);

                if (WHValid) {
                    Moves.push(WH);
                }
                if (WVValid) {
                    Moves.push(WV);
                }
            }
        }
        //if (console) { console.log(U.Util.Format("\tEmpty Extensions: V1: {1} {0}", [U.Util.ElapsedTime(performance.now() - st), AllWords.length])); }
        return Moves;
    }
    static SyllableExtensions(Cells: string[], size: number, CharSet: Contracts.CharSet, AllWords: Contracts.Word[], Probables: Contracts.Word[], Movables: string[], SpeicalDict: any): Contracts.ProbableMove[] {
        //var st = performance.now();
        var Moves = [] as Contracts.ProbableMove[];
        {
            var All = RegexEngine.GetSyllableList2(Cells, size, false, true);
            for (var indx in All) {
                var syllable = All[indx];
                var pattern = RegexEngine.GetSyllablePattern2(CharSet, syllable.Tiles.Replace("(", "").Replace(")", ""), "(?<Center>.*?)", "(?<Pre>.*?)", "(?<Post>.*?)");
                pattern = U.Util.Format("^{0}$", [pattern]);
                var R = new RegExp(pattern);
                {
                    for (var indx2 in Probables) {
                        var probable: Contracts.Word = Probables[indx2];

                        if (!R.test(probable.Tiles)) {
                            continue;
                        }
                        var M: any = R.exec(probable.Tiles);
                        var Pre = RegexEngine.MatchedString(M.groups["Pre"], "");
                        var Center = RegexEngine.MatchedString(M.groups["Conso"], "");
                        var Post = RegexEngine.MatchedString(M.groups["Post"], "");

                        var Pres = Pre == "" ? [] as string[] : Pre.TrimEnd(',').split(',');
                        var Centers = Center == "" ? [] as string[] : Center.split(',');
                        var Posts = Post == "" ? [] as string[] : Post.TrimStart(',').split(',');

                        if (!Post.StartsWith(",") && Posts.length > 0) {
                            Centers = (Center + Posts[0]).split(',');
                            Posts = Posts.slice(1);
                        }
                        var Tiles = Movables.slice(0, Movables.length);
                        var res = RegexEngine.Resolve(Pres, Centers, Posts, Tiles, SpeicalDict);
                        if (!res) {
                            continue;
                        }

                        var WH = EngineBase.TryHarizontal(1, -1, Cells, size, syllable.Index, 0, Pres, Centers, Posts);
                        var WV = EngineBase.TryVertical(1, -1, Cells, size, syllable.Index, 0, Pres, Centers, Posts);

                        var WHValid = RegexEngine.Validate3(WH, AllWords);
                        var WVValid = RegexEngine.Validate3(WV, AllWords);

                        if (WHValid) {
                            Moves.push(WH);
                        }
                        if (WVValid) {
                            Moves.push(WV);
                        }
                    }
                }
            }
        }
        //if (console) { console.log(U.Util.Format("\tSyllable Extensions: V1: {0}", [U.Util.ElapsedTime(performance.now() - st)])); }
        return Moves;
    }
    static WordExtensions(Cells: string[], size: number, CharSet: Contracts.CharSet, AllWords: Contracts.Word[], Movables: string[], SpeicalDict: any): Contracts.ProbableMove[] {
        //var st = performance.now();
        var Moves = [] as Contracts.ProbableMove[];
        {
            var WordsOnBoard = RegexEngine.GetWordsOnBoard(Cells, size, false);
            for (var indx in WordsOnBoard) {
                var wordOnBoard: Contracts.Word = WordsOnBoard[indx];
                var raw = wordOnBoard.Tiles.Replace("(", "").Replace(")", "").Replace(",", "").Replace("|", ",");
                var len: number = raw.split(',').length;

                var pattern = RegexEngine.GenWordPattern(CharSet, wordOnBoard.Tiles, "(?<Center{0}>.*?)", "", "(?<Center{0}>.*?)", "(?<Pre>.*?)", "(?<Post>.*?)", true);
                pattern = U.Util.Format("^{0}$", [pattern.TrimEnd('|')]);
                var R = new RegExp(pattern);
                {
                    for (var indx2 in AllWords) {
                        var word: Contracts.Word = AllWords[indx2];
                        if (raw == word.Tiles) {
                            continue;
                        }

                        if (!R.test(word.Tiles)) {
                            continue;
                        }

                        var M: any = R.exec(word.Tiles);
                        var Pre = "";
                        var Post = "";
                        var Center = "";

                        Pre = RegexEngine.MatchedString(M.groups["Pre"], "");
                        for (var i = 0; i < word.Syllables; i++) {
                            Center = Center + RegexEngine.MatchedString(M.groups["Center" + (i + 1)], ",") + ":";
                        }
                        Center = Center.TrimEnd(':');
                        Post = RegexEngine.MatchedString(M.groups["Post"], "");


                        var Pres = Pre == "" ? [] as string[] : Pre.TrimEnd(',').split(',');
                        var Centers: string[] = Center.split(':');
                        var Posts = Post == "" ? [] as string[] : Post.TrimStart(',').split(',');

                        if (Centers.length != len) {
                            if (!Post.StartsWith(",") && Posts.length > 0) {
                                Centers.push(Posts[0]);
                                Posts = Posts.slice(1);
                            }
                        }

                        var Tiles = Movables.slice(0, Movables.length);
                        var res = RegexEngine.Resolve(Pres, Centers, Posts, Tiles, SpeicalDict);
                        if (!res) {
                            continue;
                        }

                        if (wordOnBoard.Position == "R") {
                            var WH = EngineBase.TryHarizontal(3, -1, Cells, size, wordOnBoard.Index, wordOnBoard.Syllables - 1, Pres, Centers, Posts);
                            var WHValid = RegexEngine.Validate3(WH, AllWords);
                            if (WHValid) {
                                Moves.push(WH);
                            }
                        }
                        if (wordOnBoard.Position == "C") {
                            var WH = EngineBase.TryVertical(3, -1, Cells, size, wordOnBoard.Index, wordOnBoard.Syllables - 1, Pres, Centers, Posts);
                            var WHValid = RegexEngine.Validate3(WH, AllWords);
                            if (WHValid) {
                                Moves.push(WH);
                            }
                        }
                    }
                }
            }
        }
        //if (console) { console.log(U.Util.Format("\tWord Extensions: V1: {0}", [U.Util.ElapsedTime(performance.now() - st)])); }
        return Moves;
    }

    ShortList(Words: Contracts.Word[], NonCornerPattern: string, Dict: any): Contracts.Word[] {
        if (U.Util.IsNullOrEmpty(NonCornerPattern)) {
            return [] as Contracts.Word[];
        }

        //var st = performance.now();

        var Matches = this.MatchedWords(Words, NonCornerPattern);
        var Shortlisted = [] as Contracts.Word[];
        {
            for (var indx in Matches) {
                var word: Contracts.Word = Matches[indx];
                if (word.Syllables == 1) {
                    continue;
                }

                var CharCount = this.GetCountDict2(word.Tiles);
                var isValid = this.Validate(Dict, CharCount);
                if (!isValid) {
                    continue;
                }

                Shortlisted.push(word);
            }
        }
        //if (console) { console.log(U.Util.Format("\tContextual: V1: {1} {0}", [U.Util.ElapsedTime(performance.now() - st), Shortlisted.length])); }
        return Shortlisted;
    }

    static Validate3(WV: Contracts.ProbableMove, AllWords: Contracts.Word[]): boolean {
        WV.Words = ProbableWordComparer.Distinct(WV.Words);
        WV.WordsCount = WV.Words.length;
        if (WV.Words.length == 0 || WV.Moves.length == 0) {
            return false;
        }
        return RegexEngine.Validate2(WV.Words, AllWords);
    }
    static Validate2(WV: Contracts.ProbableWord[], AllWords: Contracts.Word[]): boolean {
        for (var indx in WV) {
            var w: Contracts.ProbableWord = WV[indx];
            var v = AllWords.filter(function (x: Contracts.Word) { return x.Tiles == w.String });
            if (v == null || v.length == 0) {
                return false;
            }
        }
        return true;
    }

}
export class RegexV2Engine extends RegexEngineBase {
    static SM: boolean = false;//Memorize Syllables
    static WM: boolean = true;//Memorize Words
    static CL: boolean = true;//Use Contextual List
    static Threshlod: number = 0.33;//Threshold to use switch Contextual List
    static WS: number = 2;//Skip Memorizing Words with Syllables Length upto.

    public Probables(Board: Contracts.ScrabbleBoard): Contracts.ProbableMove[] {
        var st = performance.now();

        var Moves = [] as Contracts.ProbableMove[];

        if (Board == null) {
            return;
        }

        var bot: Contracts.Bot = GameConfig.GetBot(Board.Bot);
        //
        var board: Contracts.KnownBoard = GameConfig.GetBoard(Board.Name);
        if (board == null) {
            return;
        }
        //
        var CharSet = GameConfig.GetCharSet(board.Language);
        var id = (bot == null ? board.Name : bot.Id) + Board.Id;
        //
        var size = board.Size;
        var weights = board.Weights;
        var tileWeights = board.TileWeights;
        var star = board.Star;
        //
        var cells = Board.Cells;
        var vowels = Board.Vowels;
        var conso = Board.Conso;
        var special = Board.Special;
        var file = (bot == null) ? CharSet.Dictionary : bot.Dictionary;

        if (CharSet == null || cells == null || weights == null || U.Util.IsNullOrEmpty(file) ||
            (U.Util.IsNullOrEmpty(vowels) && U.Util.IsNullOrEmpty(conso) && U.Util.IsNullOrEmpty(special))) {
            return Moves;
        }
        if (cells.length != size * size || weights.length != size * size) {
            return Moves;
        }
        var All = [] as string[];
        var AllPattern = "";
        //
        var Movables = (vowels + " " + conso + " " + special);
        var MovableTiles = Movables.Replace("(", " ").Replace(")", " ").Replace(",", "").split(' ');
        MovableTiles = MovableTiles.filter(function (x) { return x.length != 0; });
        //
        var SpecialList = this.DistinctList(special.Replace("(", " ").Replace(")", " ").Replace(",", ""), ' ');
        var SpeicalDict = this.GetSpecialDict(CharSet, SpecialList);

        var EverySyllableOnBoard = this.GetSyllableList(cells, size, true, false, true);
        //
        All = (this.GetFlatList(EverySyllableOnBoard, ',') + " " + Movables).Replace("(", " ").Replace(")", " ").Replace(",", " ").Replace("|", " ").split(' ');
        AllPattern = U.Util.Format("^(?<All>[{0},])*$", [this.GetFlatList2(All)]);
        var AllDict = this.GetCountDict(All);
        //
        var WordsDictionary = WL.WordLoader.LoadWords(file, (bot == null)); //Large Set of Words
        var ContextualList: number[] = [];
        //
        if (RegexV2Engine.CL) {
            ContextualList = this.ShortList2(WordsDictionary, AllPattern, AllDict); // Probables 
            if (ContextualList.length > WordsDictionary.length * RegexV2Engine.Threshlod) {
                RegexV2Engine.CL = false;
            }
        }
        //
        if (EverySyllableOnBoard.length > 0) {
            {
                var NonCornerSyllables = this.GetSyllableList(cells, size, false, true, false);
                var NonCornerTiles = [] as string[];
                var NonCornerPattern = "";
                var NonCornerDict = {};
                //
                NonCornerTiles = (this.GetFlatList2(NonCornerSyllables) + " " + Movables).Replace("(", " ").Replace(")", " ").Replace(",", " ").Replace("|", " ").split(' ');
                NonCornerPattern = U.Util.Format("^(?<All>[{0},])*$", [this.GetFlatList2(NonCornerTiles)]);
                NonCornerDict = this.GetCountDict(NonCornerTiles);
                //
                var NonCornerProbables: number[] = [];
                if (RegexV2Engine.CL) {
                    NonCornerProbables = this.ShortList3(WordsDictionary, ContextualList, NonCornerPattern, NonCornerDict);  //Non Corner Probables
                } else {
                    NonCornerProbables = this.ShortList2(WordsDictionary, NonCornerPattern, NonCornerDict);
                }
                Moves = Moves.concat(RegexV2Engine.SyllableExtensions2(cells, size, CharSet, id, WordsDictionary, NonCornerProbables, MovableTiles, SpeicalDict));
                //
                NonCornerDict = null;
                NonCornerProbables = null;
                NonCornerTiles = null;
            }

            {
                var CornerSyllables = this.GetSyllableList(cells, size, false, false, false);
                var CornerTiles = [] as string[];
                var CornerPattern = "";
                var CornerDict = {};
                //
                CornerTiles = (this.GetFlatList2(CornerSyllables) + " " + Movables).Replace("(", " ").Replace(")", " ").Replace(",", " ").Replace("|", " ").split(' ');
                CornerPattern = U.Util.Format("^(?<All>[{0},])*$", [this.GetFlatList2(CornerTiles)]);
                CornerDict = this.GetCountDict(CornerTiles);
                //
                var CornerProbables: number[] = [];
                if (RegexV2Engine.CL) {
                    CornerProbables = this.ShortList3(WordsDictionary, ContextualList, CornerPattern, CornerDict);  //Corner Probables
                } else {
                    CornerProbables = this.ShortList2(WordsDictionary, CornerPattern, CornerDict);
                }
                Moves = Moves.concat(RegexV2Engine.WordExtensions2(cells, size, CharSet, id, WordsDictionary, CornerProbables, MovableTiles, SpeicalDict));
                //
                CornerDict = null;
                CornerProbables = null;
                CornerTiles = null;
            }
        }
        else {
            Moves = Moves.concat(RegexV2Engine.EmptyExtensions2(cells, size, CharSet, star, WordsDictionary, ContextualList, MovableTiles, SpeicalDict));
        }
        WordsDictionary = null;
        EngineBase.RefreshScores(Moves, weights, tileWeights, size);

        if (console) { console.log(U.Util.Format("Moves: V2: {0}", [U.Util.ElapsedTime(performance.now() - st)])); }
        if (console && Moves.length > 0) { console.log(U.Util.Format("Mode: {0}", [Moves[0].Mode])); }
        if (console) { console.log("\t\t"); }
        return Moves;
    }

    ShortList2(Words: Contracts.Word[], Pattern: string, Dict: any): number[] {
        if (U.Util.IsNullOrEmpty(Pattern)) {
            return [] as number[];
        }

        var st = performance.now();

        var R = RegExp(Pattern);
        var Matches = this.MatchedWords(Words, Pattern);
        var Shortlisted = [] as number[];
        {
            for (var indx in Matches) {
                var word: Contracts.Word = Matches[indx];
                if (word.Syllables == 1) {
                    continue;
                }

                var CharCount = this.GetCountDict2(word.Tiles);
                var isValid = this.Validate(Dict, CharCount);
                if (!isValid) {
                    continue;
                }

                Shortlisted.push(word.Index);
            }
        }
        if (console) { console.log(U.Util.Format("\tContextual: V2: {1} {0}", [U.Util.ElapsedTime(performance.now() - st), Shortlisted.length])); }
        return Shortlisted;
    }
    ShortList3(Words: Contracts.Word[], Probables: number[], NonCornerPattern: string, Dict: any): number[] {
        if (U.Util.IsNullOrEmpty(NonCornerPattern)) {
            return [] as number[];
        }
        var st = performance.now();

        var R = RegExp(NonCornerPattern);
        var Shortlisted = [] as number[];
        {
            for (var indx in Probables) {
                var wordIndx: number = Probables[indx];
                var word: Contracts.Word = Words[wordIndx];
                if (word.Syllables == 1) {
                    continue;
                }
                var isMatch = R.test(word.Tiles);
                if (!isMatch) {
                    continue;
                }

                var CharCount = this.GetCountDict2(word.Tiles);
                var isValid = this.Validate(Dict, CharCount);
                if (!isValid) {
                    continue;
                }

                Shortlisted.push(word.Index);
            }
            if (console) { console.log(U.Util.Format("\tShortlist: V2: {1} {0}", [U.Util.ElapsedTime(performance.now() - st), Shortlisted.length])); }
        }
        return Shortlisted;
    }

    static ShortList4(r: RegExp, words: Contracts.Word[]): number[] {
        //var st = performance.now();
        var List = words.filter(function (s: Contracts.Word) { return r.test(s.Tiles); });
        var Probables: number[] = [] as number[];
        for (var indx in List) {
            Probables.push(List[indx].Index);
        }
        List = null;
        //if (console) {
        //    console.log(U.Util.Format("\t\t\tMemorize: {0} {1} : {2}",
        //        [words.length,Probables.length,
        //         U.Util.ElapsedTime(performance.now() - st)]));
        //}
        return Probables;
    }
    static ShortList5(block: string, key: string, R: RegExp, AllWords: Contracts.Word[], Probables: number[]): number[] {
        //Cache Mechanism:
        //	Word Extension: WW1
        //		CachedList: Cache all Possible Extesnsion Indexes
        //	ShortListed: Intersection of Probables and CachedList
        //
        //var st = performance.now();
        var CachedList = EngineMemory.Memorize(block, key, R, AllWords, RegexV2Engine.ShortList4, RegexV2Engine.ShouldCache);
        var ShortListed: number[] = [];
        for (var indx in CachedList) {
            var probable = CachedList[indx];
            if (!Probables.Contains(probable)) {
                continue;
            }
            ShortListed.push(probable);
        }
        //if (console) { console.log(U.Util.Format("\t\t\tShortlist: {0} ", [U.Util.ElapsedTime(performance.now() - st)])); }
        return ShortListed;
    }
    static ShortList6(r: RegExp, words: Contracts.Word[], Probables: number[]): number[] {
        //var st = performance.now();
        var List = Probables.filter(function (s: number) { return r.test(words[s].Tiles); });
        //if (console) { console.log(U.Util.Format("\t\t\tShortlist: {0} ", [U.Util.ElapsedTime(performance.now() - st)])); }
        return List;
    }

    static ShouldCache(t1: number, t2: number): boolean {
        return t1 < t2;
    }

    static EmptyExtensions2(Cells: string[], size: number, CharSet: Contracts.CharSet, startIndex: number, AllWords: Contracts.Word[], Probables: number[], Movables: string[], SpeicalDict: any): Contracts.ProbableMove[] {
        //var st = performance.now();
        var Moves = [] as Contracts.ProbableMove[];
        {
            for (var indx in Probables) {
                var wordIndx: number = Probables[indx];
                var word: Contracts.Word = AllWords[wordIndx];
                var Pre = "";
                var Center = "";
                var Post = "";

                var f = word.Tiles.indexOf(',');

                Center = word.Tiles.substring(0, f);
                Post = word.Tiles.substring(f + 1);

                var Pres = Pre == "" ? [] as string[] : Pre.TrimEnd(',').split(',');
                var Centers = Center.split(',');
                var Posts = Post == "" ? [] as string[] : Post.TrimStart(',').split(',');

                var Tiles = Movables.slice(0, Movables.length);
                var res = RegexEngine.Resolve(Pres, Centers, Posts, Tiles, SpeicalDict);
                if (!res) {
                    continue;
                }
                var totalCells = Pres.length + Centers.length + Posts.length;
                var centroid = totalCells % 2 == 0 ? (Math.floor(totalCells / 2) - 1) : Math.floor(totalCells / 2);

                var WH = EngineBase.TryHarizontal(0, startIndex, Cells, size, startIndex - centroid, 0, Pres, Centers, Posts);
                var WV = EngineBase.TryVertical(0, startIndex, Cells, size, startIndex - centroid, 0, Pres, Centers, Posts);

                var WHValid = RegexV2Engine.Validate4(WH, AllWords, Probables);
                var WVValid = RegexV2Engine.Validate4(WV, AllWords, Probables);

                if (WHValid) {
                    Moves.push(WH);
                }
                if (WVValid) {
                    Moves.push(WV);
                }
            }
        }
        //if (console) { console.log(U.Util.Format("\tEmpty Extensions: V1: {1} {0}", [U.Util.ElapsedTime(performance.now() - st), Probables.length])); }
        return Moves;
    }
    static SyllableExtensions2(Cells: string[], size: number, CharSet: Contracts.CharSet, botId: string, AllWords: Contracts.Word[], Probables: number[], Movables: string[], SpeicalDict: any): Contracts.ProbableMove[] {
        var st = performance.now();
        var Moves = [] as Contracts.ProbableMove[];
        {
            var All = RegexEngine.GetSyllableList2(Cells, size, true, true);
            if (RegexV2Engine.SM) { EngineMemory.RefreshCache(botId + ":S", All); }
            for (var indx in All) {
                var st2 = performance.now();
                var syllable = All[indx];
                var pattern = RegexEngine.GetSyllablePattern2(CharSet, syllable.Tiles.Replace("(", "").Replace(")", ""), "(?<Center>.*?)", "(?<Pre>.*?)", "(?<Post>.*?)");
                pattern = U.Util.Format("^{0}$", [pattern]);
                var R = new RegExp(pattern);
                {
                    var Probables2: number[] = [];
                    if (RegexV2Engine.SM) {
                        Probables2 = RegexV2Engine.ShortList5(botId + ":S", syllable.Tiles, R, AllWords, Probables);
                    }
                    else {
                        Probables2 = RegexV2Engine.ShortList6(R, AllWords, Probables);
                    }
                    for (var indx2 in Probables2) {
                        var probableIndx: number = Probables2[indx2];
                        var probable: Contracts.Word = AllWords[probableIndx];
                        if (!R.test(probable.Tiles)) {
                            continue;
                        }
                        var M: any = R.exec(probable.Tiles);
                        var Pre = RegexEngine.MatchedString(M.groups["Pre"], "");
                        var Center = RegexEngine.MatchedString(M.groups["Conso"], "");
                        var Post = RegexEngine.MatchedString(M.groups["Post"], "");

                        var Pres = Pre == "" ? [] as string[] : Pre.TrimEnd(',').split(',');
                        var Centers = Center == "" ? [] as string[] : Center.split(',');
                        var Posts = Post == "" ? [] as string[] : Post.TrimStart(',').split(',');

                        if (!Post.StartsWith(",") && Posts.length > 0) {
                            Centers = (Center + Posts[0]).split(',');
                            Posts = Posts.slice(1);
                        }
                        var Tiles = Movables.slice(0, Movables.length);
                        var res = RegexEngine.Resolve(Pres, Centers, Posts, Tiles, SpeicalDict);
                        if (!res) {
                            continue;
                        }

                        var WH = EngineBase.TryHarizontal(1, -1, Cells, size, syllable.Index, 0, Pres, Centers, Posts);
                        var WV = EngineBase.TryVertical(1, -1, Cells, size, syllable.Index, 0, Pres, Centers, Posts);

                        var WHValid = RegexV2Engine.Validate4(WH, AllWords, Probables);
                        var WVValid = RegexV2Engine.Validate4(WV, AllWords, Probables);

                        if (WHValid) {
                            Moves.push(WH);
                        }
                        if (WVValid) {
                            Moves.push(WV);
                        }
                    }
                }
                if (console) { console.log(U.Util.Format("\t\tSyllable Extension: {1}: {0}", [U.Util.ElapsedTime(performance.now() - st2), syllable.Tiles])); }
            }
        }
        if (console) { console.log(U.Util.Format("\tSyllable Extensions: V2: {0}", [U.Util.ElapsedTime(performance.now() - st)])); }
        return Moves;
    }
    static WordExtensions2(Cells: string[], size: number, CharSet: Contracts.CharSet, botId: string, AllWords: Contracts.Word[], Probables: number[], Movables: string[], SpeicalDict: any): Contracts.ProbableMove[] {
        var st = performance.now();
        var Moves = [] as Contracts.ProbableMove[];
        {
            var WordsOnBoard = RegexEngineBase.GetWordsOnBoard(Cells, size, false);
            if (RegexV2Engine.WM) { EngineMemory.RefreshCache(botId + ":W", WordsOnBoard); }

            for (var indx in WordsOnBoard) {
                var st2 = performance.now();

                var wordOnBoard: Contracts.Word = WordsOnBoard[indx];
                var raw = wordOnBoard.Tiles.Replace("(", "").Replace(")", "").Replace(",", "").Replace("|", ",");
                var len: number = raw.split(',').length;

                var pattern = RegexEngineBase.GenWordPattern(CharSet, wordOnBoard.Tiles, "(?<Center{0}>.*?)", "", "(?<Center{0}>.*?)", "(?<Pre>.*?)", "(?<Post>.*?)", true);
                pattern = U.Util.Format("^{0}$", [pattern.TrimEnd('|')]);
                var R = new RegExp(pattern);
                {
                    var Probables2: number[] = [];
                    if (RegexV2Engine.WM && len > RegexV2Engine.WS) {
                        Probables2 = RegexV2Engine.ShortList5(botId + ":W", wordOnBoard.Tiles, R, AllWords, Probables);
                    }
                    else {
                        Probables2 = RegexV2Engine.ShortList6(R, AllWords, Probables);
                    }
                    for (var indx2 in Probables2) {
                        var wordIndx: number = Probables2[indx2];
                        var word: Contracts.Word = AllWords[wordIndx];
                        if (raw == word.Tiles) {
                            continue;
                        }

                        if (!R.test(word.Tiles)) {
                            continue;
                        }

                        var M: any = R.exec(word.Tiles);
                        var Pre = "";
                        var Post = "";
                        var Center = "";

                        Pre = RegexEngine.MatchedString(M.groups["Pre"], "");
                        for (var i = 0; i < word.Syllables; i++) {
                            Center = Center + RegexEngine.MatchedString(M.groups["Center" + (i + 1)], ",") + ":";
                        }
                        Center = Center.TrimEnd(':');
                        Post = RegexEngine.MatchedString(M.groups["Post"], "");

                        var Pres = Pre == "" ? [] as string[] : Pre.TrimEnd(',').split(',');
                        var Centers: string[] = Center.split(':');
                        var Posts = Post == "" ? [] as string[] : Post.TrimStart(',').split(',');

                        if (Centers.length != len) {
                            if (!Post.StartsWith(",") && Posts.length > 0) {
                                Centers.push(Posts[0]);
                                Posts = Posts.slice(1);
                            }
                        }

                        var Tiles = Movables.slice(0, Movables.length);
                        var res = RegexEngine.Resolve(Pres, Centers, Posts, Tiles, SpeicalDict);
                        if (!res) {
                            continue;
                        }

                        if (wordOnBoard.Position == "R") {
                            var WH = EngineBase.TryHarizontal(2, -1, Cells, size, wordOnBoard.Index, wordOnBoard.Syllables - 1, Pres, Centers, Posts);
                            var WHValid = RegexV2Engine.Validate4(WH, AllWords, Probables);
                            if (WHValid) {
                                Moves.push(WH);
                            }
                        }
                        if (wordOnBoard.Position == "C") {
                            var WH = EngineBase.TryVertical(2, -1, Cells, size, wordOnBoard.Index, wordOnBoard.Syllables - 1, Pres, Centers, Posts);
                            var WHValid = RegexV2Engine.Validate4(WH, AllWords, Probables);
                            if (WHValid) {
                                Moves.push(WH);
                            }
                        }
                    }
                }
                if (console) { console.log(U.Util.Format("\t\tWord Extension: {1}: {0}", [U.Util.ElapsedTime(performance.now() - st2), wordOnBoard.Tiles])); }
            }
        }
        if (console) { console.log(U.Util.Format("\tWord Extensions: V2: {0}", [U.Util.ElapsedTime(performance.now() - st)])); }
        return Moves;
    }

    static Validate4(WV: Contracts.ProbableMove, AllWords: Contracts.Word[], Probables: number[]): boolean {
        WV.Words = ProbableWordComparer.Distinct(WV.Words);
        WV.WordsCount = WV.Words.length;
        if (WV.Words.length == 0 || WV.Moves.length == 0) {
            return false;
        }
        return RegexV2Engine.Validate5(WV.Words, AllWords, Probables);
    }
    static Validate5(WV: Contracts.ProbableWord[], AllWords: Contracts.Word[], Probables: number[]): boolean {
        for (var indx in WV) {
            var w: Contracts.ProbableWord = WV[indx];
            var v = Probables.filter(function (x: number) { return AllWords[x].Tiles == w.String });
            if (v == null || v.length == 0) {
                return false;
            }
        }
        return true;
    }
}
export class EngineMemory {
    static Cache: any = {};
    static Memorize(Block: string, Key: string, r: RegExp, Words: Contracts.Word[],
        Callback: (r: RegExp, Words: Contracts.Word[]) => number[],
        CanCache: (t1: number, t2: number) => boolean): number[] {
        var Dict = EngineMemory.Cache[Block];
        if (Dict == null) {
            Dict = {};
        }
        if (Dict[Key] != null) {
            return Dict[Key];
        }
        var obj = Callback(r, Words);
        Dict[Key] = obj;
        if (CanCache(obj.length, Words.length)) {
            EngineMemory.Cache[Block] = Dict;
        }
        return obj;
    }

    static Retrieve(Key: string): any {
        var Val = EngineMemory.Cache[Key];
        if (Val == null) {
            return {};
        }
        return Val;
    }

    static RefreshCache(block: string, Items: Contracts.Word[]): void {
        var Dict = EngineMemory.Retrieve(block);
        if (Dict == null) { return; }
        var RemoveList: string[] = [];
        //Remove all Words that are part of the WordsOnBoard
        //Those are nolonger needed
        for (var indx in Dict) {
            var KVP = Dict[indx];
            var found: boolean = false;
            for (var indx2 in Items) {
                var word = Items[indx2];
                if (word.Tiles == indx) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                RemoveList.push(indx);
            }
        }
        for (var indx3 in RemoveList) {
            var item = RemoveList[indx3];
            delete Dict[item];
        }
    }
}
export class GameConfig {
    static GetBot(bot: string): Contracts.Bot {
        var players: Contracts.iPlayer[] = Config.Players;
        for (var i = 0; i < players.length; i++) {
            var player: Contracts.iPlayer = players[i];
            var isBot: boolean = player.Bot != null;
            if (!isBot) {
                continue;
            }
            if (player.Bot.Id == bot) {
                return (player.Bot as any) as Contracts.Bot;
            }
        }
        return null;
    }
    static GetBoard(name: string): Contracts.KnownBoard {
        if (Config.Board.TileWeights == null) {
            Config.Board.TileWeights = GameConfig.GetTileWeights(Config.Board.Trays as Contracts.GameTray[]);
        }
        return Config.Board;
    }
    static GetCharSet(lang: string): Contracts.CharSet {
        return Config.CharSet;
    }
    static GetTileWeights(trays: Contracts.GameTray[]): any {
        var Weights: any = {};
        for (var indx in trays) {
            var tray = trays[indx];
            for (var indx2 in tray.Set) {
                var tiles = tray.Set[indx2];
                for (var indx3 in tiles) {
                    var tile: Contracts.WC = tiles[indx3];
                    Weights[indx3] = tile.W;
                    if (indx3.length > 1 && Indic.Indic.GetSyllableTiles(indx3) != null) {
                        Weights[Indic.Indic.GetSyllableTiles(indx3).join('')] = tile.W;
                        continue;
                    }
                    var sym = Indic.Indic.GetSynonym(indx3);
                    if (sym != null) {
                        Weights[sym] = tile.W;
                    }
                }
            }
        }
        return Weights;
    }
}