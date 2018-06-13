interface GenericDict {
    [key: string]: any;
}

interface CSSStyleDeclaration {
    [key: string]: any;
}

interface String {
    Replace(needle: string, replacement: string): string;
    TrimEnd(trimChar: string): string;
    TrimStart(trimChar: string): string;
    Trim(trimChar: string): string;
    StartsWith(c: string): boolean;
}

interface Array<T> {
    Contains(item: T): boolean;
    Remove(item: T): void;
    Find(callbackfn: (value: T) => boolean, thisArg?: any): T;
    Clone(): Array<T>;
}

interface HTMLElement {
    attachEvent(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
}
