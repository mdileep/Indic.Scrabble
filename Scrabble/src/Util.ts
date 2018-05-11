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
    public static ElapsedTime(timeSpan: number): string {
        if (timeSpan < 1000) {
            return Util.Format("{0}ms", [timeSpan.toFixed(2)]);
        }
        var totalSeconds = timeSpan / 1000;
        if (totalSeconds < 60) {
            return Util.Format("{0}sec", [totalSeconds.toFixed(2)]);
        }
        var totalMinutes = timeSpan / (1000 * 60);
        if (totalMinutes < 60) {
            return Util.Format("{0}min", [totalMinutes.toFixed(2)]);
        }
        var totalHours = timeSpan / (1000 * 60 * 60);
        return Util.Format("{0}Hours", [totalHours.toFixed(2)]);
    }
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
    public static Draw(available: string[], max: number): string[] {
        var size = max;
        if (available.length < max) {
            size = available.length;
        }

        var ret: string[] = [];
        for (var i = 0; i < size; i++) {
            var indx = Math.round(Math.random() * (available.length - 1));
            ret.push(available[indx]);
        }
        ret.sort();

        return ret;
    }

    public static IsNullOrEmpty(input: string) {
        return input == null || input.trim().length == 0;
    }
}

export class DOMUtil {
    public static SelectedValue(id: string): string {
        var e: HTMLSelectElement = document.getElementById(id) as HTMLSelectElement;
        if (e == null) { return ""; }
        var value = (e.options[e.selectedIndex] as (HTMLOptionElement)).value;
        if (value == null) { return ""; }
        return value;
    }

    public static RegisterClick = function (id: string, elementEventListener: EventListener) {
        DOMUtil.RegisterEvent(document.getElementById(id), 'click', elementEventListener);
    }

    public static RegisterEvent = function (E: HTMLElement | Window, eventName: string, elementEventListener: EventListener) {
        if (E == null) {
            return;
        }
        if (E.addEventListener != null) {
            E.addEventListener(eventName, elementEventListener, false);
        }
        else if ((E as any).attachEvent != null) {//TODO.. any to me removed..
            (E as any).attachEvent('on' + eventName, elementEventListener);
        }
        else {
            (E as any)['on' + eventName] = elementEventListener;
        }
    }

    public static ApplyTemplate = function (target: string, templateId: string, data: any) {
        var template = document.getElementById(templateId).innerHTML;
        var html: string = DOMUtil._ApplyTemplate(template, data);
        document.getElementById(target).innerHTML = html;
    }

    public static _ApplyTemplate = function (html: string, data: any) {
        //http://krasimirtsonev.com/blog/article/Javascript-template-engine-in-just-20-line
        var re = /<%([^%>]+)?%>/g, reExp = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g, code = 'var r=[];\n', cursor = 0;

        var add = function (line: string, js?: any): any {
            js ? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') :
                (code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
            return add;
        }
        var match: any = null;
        while (match = re.exec(html)) {
            add(html.slice(cursor, match.index))(match[1], true);
            cursor = match.index + match[0].length;
        }

        add(html.substr(cursor, html.length - cursor));
        code += 'return r.join("");';
        return new Function(code.replace(/[\r\t\n]/g, '')).apply(data);
    }
}

Object.defineProperty(String.prototype, 'StartsWith',
    {
        enumerable: false,
        value: function (needle: string): boolean {
            return this.indexOf(needle) == 0;
        }
    });
Object.defineProperty(String.prototype, 'Replace',
    {
        enumerable: false,
        value: function (needle: string, replacement: string): string {
            return this.replace(new RegExp("\\" + needle, 'g'), replacement);
        }
    });
Object.defineProperty(String.prototype, 'TrimEnd',
    {
        enumerable: false,
        value: function (c: string) {
            for (var i = this.length - 1; i >= 0 && this.charAt(i) == c; i--);
            return this.substring(0, i + 1);
        }
    });
Object.defineProperty(String.prototype, 'TrimStart',
    {
        enumerable: false,
        value: function (c: string): string {
            for (var i = 0; i < this.length && this.charAt(i) == c; i++);
            return this.substring(i);
        }
    });
Object.defineProperty(String.prototype, 'Trim',
    {
        enumerable: false,
        value: function (c: string) {
            return this.TrimStart(c).TrimEnd(c);
        }
    });
Object.defineProperty(Array.prototype, 'Contains',
    {
        enumerable: false,
        value: function (item: any): boolean {
            return this.indexOf(item) > -1;
        }
    });
Object.defineProperty(Array.prototype, 'Remove',
    {
        enumerable: false,
        value: function (item: any): void {
            var indx = this.indexOf(item);
            if (indx < 0) {
                return;
            }
            delete this[indx];
        }
    });
Object.defineProperty(Array.prototype, 'Find',
    {
        enumerable: false,
        value: function (item: any): any {
            var indx = this.indexOf(item);
            if (indx < 0) {
                return;
            }
            return this[indx];
        }
    });
Object.defineProperty(Array.prototype, 'Clone',
    {
        enumerable: false,
        value: function (): any {
            return [].concat(this);
        }
    });