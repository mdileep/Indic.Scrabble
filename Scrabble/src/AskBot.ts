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
import * as GameLoader from 'GameLoader';
import * as Contracts from 'Contracts';
import * as U from 'Util';

export class AskBot {

    static NextMove(): void {
        GameLoader.GameLoader.store.dispatch({
            type: Contracts.Actions.BotMove,
            args: {
            }
        });
    }
    static BotMove(post: any): void {
        //Decide between Server or Client
        AskBot.BotMoveServer(post);
    }
    static BotMoveServer(post: any): void {
        axios
            .post("/API.ashx?nextmove", post)
            .then(response => {
                GameLoader.GameLoader.store.dispatch({
                    type: Contracts.Actions.BotMoveResponse,
                    args: response.data
                });
            })
            .catch(error => { });
    }

    static BotMoveClient(post: any): void {
    }
}

//Port of C# : Game Server

export interface Neighbor {
    Left: number;
    Right: number;
    Top: number;
    Bottom: number;
}

export interface Point {
    X: number;
    Y: number;
}

export interface Word {
    Index: number;
    Tiles: string;
    Syllables: number;
    Position: string;
}

export interface ProbableMove {
    Direction: string;
    Score: number;
    Moves: Word[];
    Words: ProbableWord[];
}

export interface ProbableWord {
    Cells: TargetCell[];
    Display: string;
    String: string;
    Score: number;
}

export interface TargetCell {
    Index: number;
    Target: string;
    Score: number;
}
export interface ScrabbleBoard {
    Name: string;
    Bot: string;
    //
    Reference: string;
    //Dynamic
    Cells: string[];
    Vowels: string;
    Conso: string;
    Special: string;
}
export interface Bot {
    Id: string;
    Name: string;
    Language: string;
    Dictionary: string;
}
export interface CharSet {
    Name: string;
    SunnaSet: string[];
    Vowels: string[];
    Consonents: string[];
    Synonyms: any;
    Virama: string;
}
export interface KnownBoard {
    Size: number;
    Weights: number[];
}
export class BoardUtil {
    public static FindNeighbors(index: number, size: number): Neighbor {
        var arr: Neighbor = ({ Right: -1, Left: -1, Top: -1, Bottom: -1 } as any) as Neighbor;
        var pos = BoardUtil.Position(index, size);
        var bottom = BoardUtil.Abs(pos.X + 1, pos.Y, size);
        var top = BoardUtil.Abs(pos.X - 1, pos.Y, size);
        var left = BoardUtil.Abs(pos.X, pos.Y - 1, size);
        var right = BoardUtil.Abs(pos.X, pos.Y + 1, size);
        arr = ({ Right: right, Left: left, Top: top, Bottom: bottom } as any) as Neighbor;
        return arr;
    }
    public static Position(N: number, size: number): Point {
        var X = Math.floor(N / size);
        var Y = (N % size);
        return ({ X: X, Y: Y } as any) as Point;
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

export class WordLoader {
    static LoadWords(file: string): Word[] {
        var arr: Word[] = [];
        //TODO:...
        return arr;
    }
    static Load(file: string): Word[] {
        //TODO..
        //Apply Cache or Read DB...
        return WordLoader.LoadWords(file);
    }
}

export class ProbableWordComparer {
    public Equals(x: ProbableWord, y: ProbableWord): boolean {
        if (x.Cells.length == y.Cells.length) { return true; }
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

}
export class Config2 {
    static GetBot(bot: string): Bot {
        //TODO..
        return null;
    }
    static GetBoard(name: string): KnownBoard {
        //TODO..
        return null;
    }
    static GetCharSet(lang: string): CharSet {
        //TODO..
        return null;
    }
}
export class Runner2 {
    public BestMove(Board: ScrabbleBoard): ProbableMove {
        var Moves = this.Probables(Board);
        if (Moves.length == 0) {
            return null;
        }
        return Moves[0];
    }
    public Probables(Board: ScrabbleBoard): ProbableMove[] {
        var Moves = [] as ProbableMove[];

        if (Board == null) {
            return;
        }

        var bot: Bot = Config2.GetBot(Board.Bot);
        if (bot == null) {
            return;
        }
        //
        var board: KnownBoard = Config2.GetBoard(Board.Name);
        if (board == null) {
            return;
        }
        //

        var CharSet = Config2.GetCharSet(bot.Language);
        //
        var size = board.Size;
        var weights = board.Weights;
        //
        var cells = Board.Cells;
        var vowels = Board.Vowels;
        var conso = Board.Conso;
        var special = Board.Special;
        var file = bot.Dictionary;

        //if (!new FileInfo(file).Exists) {
        //    return Moves;
        //}

        if (CharSet == null || cells == null || weights == null || U.Util.IsNullOrEmpty(file) ||
            (U.Util.IsNullOrEmpty(vowels) && U.Util.IsNullOrEmpty(conso) && U.Util.IsNullOrEmpty(special))) {
            return Moves;
        }
        if (cells.length != size * size || weights.length != size * size) {
            return Moves;
        }

        var All = [] as string[];
        var NonCornerTiles = [] as string[];

        var AllPattern = "";
        var NonCornerPattern = "";

        var Movables = (vowels + " " + conso + " " + special);
        var MovableList = Movables.Replace("(", " ").Replace(")", " ").Replace(",", "").split(' ');

        //MovableList.RemoveAll(x => x.Length == 0);

        var SpecialList = this.DistinctList(special.Replace("(", " ").Replace(")", " ").Replace(",", ""), ' ');

        //var EverySyllableOnBoard = GetSyllableList(cells, size, false, true);
        //var NonCornerSyllables = GetSyllableList(cells, size, true, false);

        ////
        //All = (GetFlatList(EverySyllableOnBoard, ',') + " " + Movables).Replace("(", " ").Replace(")", " ").Replace(",", " ").Replace("|", " ").Split(' ');
        //AllPattern = string.Format("^(?<All>[{0},])*$", GetFlatList2(All));

        ////
        //NonCornerTiles = (GetFlatList2(NonCornerSyllables.ToArray()) + " " + Movables).Replace("(", " ").Replace(")", " ").Replace(",", " ").Replace("|", " ").Split(' ');
        //NonCornerPattern = string.Format("^(?<All>[{0},])*$", GetFlatList2(NonCornerTiles));

        //var AllDict = GetCountDict(All);
        //var NonCornerDict = GetCountDict(NonCornerTiles);

        //var WordsDictionary = WordLoader.Load(file); //Large Set of Words

        //WordsDictionary = ShortList(WordsDictionary, AllPattern, AllDict); // Probables 

        //var NonCornerProbables = ShortList(WordsDictionary, NonCornerPattern, NonCornerDict);  //Non Corner Probables
        //var SpeicalDict = GetSpecialDict(SpecialList);

        //if (EverySyllableOnBoard.Count > 0) {
        //    Moves = Moves.concat(SyllableExtensions(cells, size, CharSet, WordsDictionary, NonCornerProbables, MovableList, SpeicalDict));
        //    Moves = Moves.concat(WordExtensions(cells, size, CharSet, WordsDictionary, MovableList, SpeicalDict));
        //}
        //else {
        //    var maxIndex: number = MaxWeightIndex(weights);
        //    Moves = Moves.concat(EmptyExtensions(cells, size, CharSet, maxIndex, WordsDictionary, MovableList, SpeicalDict));
        //}

        //WordsDictionary = null;
        //RefreshScores(Moves, weights, size);
        return Moves;
    }

    //    static string Join(string str, char join)
    //		{
    //    string ret = "";
    //    foreach(char ch in str)
    //    {
    //        ret = ret + ch + join;
    //    }
    //    ret = ret.TrimEnd(join);
    //    return ret;
    //}
    //string GetFlatList2(string[] inputs)
    //{
    //    var list = inputs.ToList(); list.Sort();

    //    List < string > X = new List<string>();
    //    foreach(string input in list)
    //    {
    //        if (!X.Contains(input)) {
    //            X.Add(input);
    //        }
    //    }

    //    return GetFlatList(X, ' ').Replace(" ", "");
    //}
    //string GetFlatList(List < string > List, char Seperator)
    //{
    //    string ret = "";
    //    foreach(string s in List)
    //    {
    //        ret = ret + s + Seperator;
    //    }
    //    ret = ret.TrimEnd(Seperator);
    //    return ret;
    //}
    //GetFlatList(List < Word > List, char Seperator):string
    //{
    //    string ret = "";
    //    foreach(Word s in List)
    //    {
    //        ret = ret + s.Tiles + Seperator;
    //    }
    //    ret = ret.TrimEnd(Seperator);
    //    return ret;
    //}

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
            if (Dict.ContainsKey(input)) {
                Dict[input]++;
            }
            else {
                Dict[input] = 1;
            }
        }
        return Dict;
    }


    static Classify(CharSet: CharSet, syllable: string, Consos: string[], Vowels: string[]): void {
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
    static Classify2(CharSet: CharSet, syllable: string, Consos: string[], Vowels: string[]): void {
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

    static GenWordPattern(CharSet: CharSet, word: string, consoPatternNoComma: string, sunnaPattern: string, allPatternNoComma: string, prePattern: string, postPattern: string, useSyllableIndex: boolean): string {
        var temp: string = "";
        var arr = word.split('|');
        for (var i = 0; i < arr.length; i++) {
            var syllable: string = arr[i];
            var pattern: String = "";
            if (useSyllableIndex) {
                //pattern = GetSyllablePattern(CharSet,
                //    syllable.Replace("(", "").Replace(")", ""),
                //    U.Util.Format(consoPatternNoComma, [i + 1]),
                //    U.Util.Format(sunnaPattern, [i + 1]),
                //    i == arr.length - 1 ? "" : U.Util.Format(allPatternNoComma, [i + 1]));
            }
            else {
                //pattern = GetSyllablePattern(CharSet,
                //    syllable.Replace("(", "").Replace(")", ""),
                //    consoPatternNoComma,
                //    sunnaPattern,
                //    i == arr.length - 1 ? "" : allPatternNoComma);
            }
            temp = temp + pattern + ",";
        }
        temp = temp.TrimEnd(',');
        temp = prePattern + temp + postPattern;
        temp = U.Util.Format("({0})|", [temp]);
        return temp;
    }

    GetSpecialDict(SpecialList: string[]): any[] {
        var SpeicalDict = [] as any[];
        for (var indx in SpecialList) {
            var sp = SpecialList[indx];
            //var pattern: string = GetSpecialSyllablePattern2(CharSet, sp);
            //SpeicalDict.push({ sp: new RegExp(pattern) });
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