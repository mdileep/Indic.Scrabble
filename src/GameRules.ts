import * as Contracts from 'Contracts';

export class GameRules {
    public static ToTray(state: Contracts.IGameState, args: Contracts.IArgs): void {
        var cell: Contracts.ICellProps = state.Center.Cells[args.index];
        if (cell.last == cell.current) {
            return;
        }
        debugger;
        if (cell.waiting.length > 0) {
            var toRemove = cell.waiting[cell.waiting.length - 1];
            cell.waiting.pop();
            cell.current = Indic.Merge(cell.confirmed.concat(cell.waiting));
            var fnd = GameRules.FindTray(state, toRemove);
            var group: Contracts.ITilesProps = state.Left.items[fnd.groupIndex];
            var tile: Contracts.ITileProps = group.items[fnd.index];
            tile.count++;
        }
    }
    public static ToBoard(state: Contracts.IGameState, args: Contracts.IArgs): void {
        var group: Contracts.ITilesProps = state.Left.items[args.groupIndex];
        var tile: Contracts.ITileProps = group.items[args.tileIndex];
        if (tile.count == 0) {
            return;
        }

        var cell: Contracts.ICellProps = state.Center.Cells[args.cellIndex];
        var list: string[] = cell.confirmed.concat(cell.waiting);
        list.push(args.src);

        var isValid = Indic.IsValid(list);
        if (!isValid) {
            return;
        }

        cell.waiting.push(args.src);
        list = cell.confirmed.concat(cell.waiting);
        cell.current = Indic.Merge(list);
        tile.count--;
    }


    public static FindTray(state: Contracts.IGameState, char: string): any {
        for (var i = 0; i < state.Left.items.length; i++) {
            var groups: Contracts.ITilesProps = state.Left.items[i];
            for (var j = 0; j < groups.items.length; j++) {
                var group: Contracts.ITileProps = groups.items[j];
                if (group.text == char) { return { groupIndex: i, index: j }; }
            }
        }

        return null;
    }
    public static GroupsDisplay(state: Contracts.IGameState, args: Contracts.IArgs) {
        var group: Contracts.ITilesProps = state.Left.items[args.groupIndex];
        group.show = !group.show;
        //To make sure atleast one group is available.
        //Restrict from hiding all groups
        var cnt: number = 0; var last = -1;
        for (var i = 0; i < state.Left.items.length; i++) {
            if (cnt > 1) {
                break;
            }
            if (state.Left.items[i].show) {
                cnt++;
                last = i;
            }
        }
        if (cnt == 1) {
            state.Left.items[last].disabled = true;
        } else {
            for (var i = 0; i < state.Left.items.length; i++) {
                state.Left.items[i].disabled = false;
            }
        }
    }
}
export class Indic {

    public static IsValid(arr: string[]): boolean {
        //Tobe improved.
        if (arr.length == 1 && Indic.IsFullSpecialSet(arr[0])) {
            return false;
        }


        var special: number = 0;
        var conso: number = 0;
        var vowel: number = 0;
        var sunnaSet: number = 0;

        for (var i = 0; i < arr.length; i++) {

            if (Indic.IsFullSpecialSet(arr[i])) {
                special++;
                if (Indic.IsSunnaSet(arr[i])) {
                    sunnaSet++;
                }
                continue;
            }
            if (Indic.IsConsonent(arr[i])) {
                conso++;
                continue;
            }
            if (Indic.IsVowel(arr[i])) {
                vowel++;
                continue;
            }
        }

        if (conso > 0 && vowel > 0) {
            return false;
        }
        if (vowel > 0 && special > 0 && (sunnaSet != special)) {
            return false;
        }
        if (vowel > 1) {
            return false;
        }
        if (special > 1) {
            return false;
        }
        return true;
    }

    public static Merge(arr: string[]): string {
        var res = "";
        var pending = "";
        var isConso: boolean = false;

        for (var i = 0; i < arr.length; i++) {
            if (Indic.IsFullSpecialSet(arr[i])) {
                pending = arr[i];
                continue;
            }
            var isCurrConso: boolean = Indic.IsConsonent(arr[i]);
            if (isConso && isCurrConso) {
                res = res + Indic.Virama + arr[i];
            }
            else {
                res = res + arr[i];
            }
            isConso = isCurrConso;
        }
        res = res + pending;
        return res;
    }


    public static Contains(arr: string[], char: string): boolean {
        var index: number = arr.indexOf(char);
        return index >= 0;
    }

    public static IsVowel(char: string): boolean {
        return Indic.Contains(Indic.Vowels, char);
    }

    public static IsConsonent(char: string): boolean {
        return Indic.Contains(Indic.Consonents, char);
    }
    public static IsSpecialSet(char: string): boolean {
        return Indic.Contains(Indic.SpecialSet, char);
    }
    public static IsFullSpecialSet(char: string): boolean {
        return Indic.Contains(Indic.FullSpecialSet, char);
    }

    public static IsSunnaSet(char: string): boolean {
        return Indic.Contains(Indic.SunnaSet, char);
    }

    public static FullSpecialSet: string[] = ["ా",
        "ి", "ీ",
        "ు", "ూ",
        "ృ", "ౄ",
        "ె", "ే",
        "ై",
        "ొ", "ో",
        "ౌ", "్",// Including Virama
        "ం", "ః"];

    public static SpecialSet: string[] = [
        "ా",
        "ి", "ీ",
        "ు", "ూ",
        "ృ", "ౄ",
        "ె", "ే",
        "ై",
        "ొ", "ో",
        "ౌ", // Excluding Virama
        "ం", "ః"];

    public static SunnaSet: string[] = ["ం", "ః"];

    public static Vowels: string[] = [
        "అ", "ఆ",
        "ఇ", "ఈ",
        "ఉ", "ఊ",
        "ఎ", "ఏ", "ఐ",
        "ఒ", "ఓ", "ఔ",
        "ఋ", "ౠ",
        "అం", "అః"];
    public static Consonents = [
        "క", "ఖ", "గ", "ఘ", "ఙ",
        "చ", "ఛ", "జ", "ఝ", "ఞ",
        "ట", "ఠ", "డ", "ఢ", "ణ",
        "త", "థ", "ద", "ధ", "న",
        "ప", "ఫ", "బ", "భ", "మ",
        "య", "ర", "ల", "వ",
        "శ", "ష", "స",
        "హ", "ళ", "ఱ",
        "క్ష"];
    public static Virama: string = "్";

}



    //public static SetCurrent(current: string, src: string): string {
    //    if (current.trim().length == 0) {
    //        return src;
    //    }
    //    var isCurrVowel: boolean = Indic.IsVowel(current);
    //    if (isCurrVowel) {
    //        return current; // No Changes
    //    }
    //    var isTargetVowel: boolean = Indic.IsVowel(src);
    //    if (isTargetVowel) {
    //        return current; // No Changes
    //    }
    //    var lastChar: string = current.charAt(current.length - 1);
    //    var isLastSpecial: boolean = Indic.IsSpecialSet(lastChar);
    //    var isTargetSpecial: boolean = Indic.IsSpecialSet(src);
    //    if (isTargetSpecial) {
    //        if (isLastSpecial) {
    //            return current; // No Changes
    //        }
    //        return current + src;
    //    }
    //    var isTargetConso: boolean = Indic.IsConsonent(src);
    //    var isCurrConso: boolean = true;
    //    if (isTargetConso) {
    //        if (!isLastSpecial) {
    //            return current + Indic.virama + src;
    //        }
    //    }
    //    var pending: string = current.substring(0, current.length - 1);
    //    return pending + Indic.virama + src + lastChar;
    //}