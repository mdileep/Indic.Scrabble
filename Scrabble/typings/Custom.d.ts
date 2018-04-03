interface CSSStyleDeclaration {
    [key: string]: any;
}

interface String {
    Replace(needle: string, replacement: string): string;
    TrimEnd(trimChar: string): string;
    TrimStart(trimChar: string): string;
}

interface Array<T> {
    Contains(item: T): boolean;
}