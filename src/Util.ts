//---------------------------------------------------------------------------------------------
// <copyright file="Util.ts" company="Chandam-ఛందం">
//    Copyright © 2013 - 2018 'Chandam-ఛందం' : http://chandam.apphb.com
//    Original Author : Dileep Miriyala (m.dileep@gmail.com)
//    Last Updated    : 03-Feb-2018 10:22EST
//    Revisions:
//       Version    | Author                   | Email                     | Remarks
//       1.0        | Dileep Miriyala          | m.dileep@gmail.com        | Initial Commit
//       _._        | <TODO>                   |   <TODO>                  | <TODO>
// </copyright>
//---------------------------------------------------------------------------------------------
import * as Contracts from 'Contracts';
export class Util {
    public static Format(s: string, args: any): string {
        var formatted = s;
        for (var arg in args) {
            formatted = formatted.replace("{" + arg + "}", args[arg]);
        }
        return formatted;
    }
    public static Merge(...args: any[]): any {
        var resObj = {} as any;
        for (var i = 0; i < arguments.length; i += 1) {
            var obj = arguments[i],
                keys = Object.keys(obj);
            for (var j = 0; j < keys.length; j += 1) {
                resObj[keys[j]] = obj[keys[j]];
            }
        }
        return resObj;
    }
    public static Abs(X: number, Y: number, size: number): number {
        const min = 0;
        var max: number = size - 1;

        if ((X < min || X > max) || (Y < min || Y > max)) {
            return -1;
        }
        return (size * (X + 1)) + Y - size;
    }
    public static Position(N: number, size: number): Contracts.iPosition {
        var X: number = Math.floor(N / size);
        var Y: number = (N % size);
        return { X: X, Y: Y };
    }
    static FindNeighbors(index: number, size: number): number[] {
        var arr: number[] = [];
        var pos: Contracts.iPosition = Util.Position(index, size);
        var bottom: number = Util.Abs(pos.X + 1, pos.Y, size);
        var top: number = Util.Abs(pos.X - 1, pos.Y, size);
        var left: number = Util.Abs(pos.X, pos.Y - 1, size);
        var right: number = Util.Abs(pos.X, pos.Y + 1, size);
        var a = [right, left, top, bottom];
        for (var i = 0; i < a.length; i++) {
            if (a[i] != -1) {
                arr.push(a[i]);
            }
        }
        return arr;
    }
    static Contains(word: Contracts.iWord, arr: Contracts.iWord[]) {
        var res = false;
        for (var key in arr) {
            if (arr[key].Text == word.Text) {
                return true;
            }
        }
        return res;
    }
}