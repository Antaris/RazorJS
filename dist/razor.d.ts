declare module Razor {
    interface IEquatable<T> {
        equals(other: T): boolean;
    }
}
declare module Razor {
    interface IComparable<T> {
        compareTo(other: T): number;
    }
}
declare module Razor {
    class Environment {
        static NewLine: string;
    }
}
declare module Razor.Parser {
    class ParserHelpers {
        static isNewLine(value: string): boolean;
    }
}
declare module Razor.Text {
    class SourceLocationTracker {
        private _absoluteIndex;
        private _lineIndex;
        private _characterIndex;
        private _currentLocation;
        constructor(currentLocationOrAbsoluteIndex?: SourceLocation | number, lineIndex?: number, characterIndex?: number);
        currentLocation: SourceLocation;
        static calculateNewLocation(lastPosition: SourceLocation, newContent: string): SourceLocation;
        private recalculateSourceLocation();
        private updateCharacterCore(characterRead, nextCharacter);
        private updateInternalState();
        updateLocation(contentOrCharacterRead: string, nextCharacter?: string): SourceLocationTracker;
    }
}
declare module Razor {
    class SourceLocation implements IEquatable<SourceLocation>, IComparable<SourceLocation> {
        absoluteIndex: number;
        lineIndex: number;
        characterIndex: number;
        static Undefined: SourceLocation;
        static Zero: SourceLocation;
        constructor(absoluteIndex: number, lineIndex: number, characterIndex: number);
        static add(left: SourceLocation, right: SourceLocation): SourceLocation;
        static advance(left: SourceLocation, text: string): SourceLocation;
        compareTo(other: SourceLocation): number;
        equals(other: SourceLocation): boolean;
        static greaterThan(left: SourceLocation, right: SourceLocation): boolean;
        static lessThan(left: SourceLocation, right: SourceLocation): boolean;
        static subtract(left: SourceLocation, right: SourceLocation): SourceLocation;
        toString(): string;
    }
}
declare module Razor {
    interface IDisposable {
        dispose(): void;
    }
}
declare module Razor {
    class DisposableAction implements IDisposable {
        private _action;
        private _context;
        constructor(action: Function, context?: any);
        dispose(): void;
    }
}
declare module Razor {
    function Using(contextOrDisposable: any | IDisposable, disposableOrAction: IDisposable | Function, action?: Function): void;
}
declare module Razor.Parser.SyntaxTree {
    class Span {
        content: string;
        start: SourceLocation;
    }
}
declare module Razor.Text {
    class BacktrackContext {
        location: SourceLocation;
        bufferIndex: number;
        constructor(location: SourceLocation, bufferIndex?: number);
    }
}
declare module Razor.Text {
    class TextReader implements IDisposable {
        dispose(): void;
        peek(): string | number;
        read(buffer?: string[], index?: number, count?: number): string | number;
        readBlock(buffer: string[], index: number, count: number): number;
        readLine(): string;
        readToEnd(): string;
    }
}
declare module Razor.Text {
    class LookaheadTextReader extends TextReader {
        currentLocation: SourceLocation;
        beginLookahead(): IDisposable;
        cancelBacktrack(): void;
    }
}
declare module Razor.Text {
    class BufferingTextReader extends LookaheadTextReader {
        private _backtrackStack;
        private _currentBufferPosition;
        private _currentCharacter;
        private _locationTracker;
        private _source;
        constructor(source: TextReader);
        buffer: string[];
        buffering: any;
        boolean: any;
        currentCharacter: string | number;
        currentLocation: SourceLocation;
        innerReader: TextReader;
        beginLookahead(): IDisposable;
        cancelBacktrack(): void;
        dispose(): void;
        private endLookahead(context);
        private expandBuffer();
        private nextCharacter();
        read(buffer?: string[], index?: number, count?: number): string | number;
        peek(): string | number;
        private updateCurrentCharacter();
    }
}
declare module Razor.Text {
    class CharacterReference {
        private _char;
        private _loc;
        constructor(character: string, location: SourceLocation);
        character: string;
        location: SourceLocation;
    }
}
declare module Razor.Text {
    interface ITextBuffer {
        length: number;
        position: number;
        peek(): string | number;
        read(): string | number;
        readToEnd(): string;
    }
}
declare module Razor.Text {
    interface ITextDocument extends ITextBuffer {
        location: SourceLocation;
    }
}
declare module Razor.Text {
    class TextLine {
        start: number;
        index: number;
        content: string;
        constructor(start: number, index: number, content?: string);
        end: number;
        length: number;
        contains(index: number): boolean;
    }
}
declare module Razor.Text {
    class LineTrackingStringBuffer {
        private _currentLine;
        private _endLine;
        private _lines;
        constructor();
        endLocation: SourceLocation;
        length: number;
        append(content: string): void;
        charAt(absoluteIndex: number): CharacterReference;
        private findLine(absoluteIndex);
        private scanLines(absoluteIndex, start);
        private pushNewLine();
    }
}
declare module Razor.Text {
    class LocationTagged<T> implements IEquatable<LocationTagged<T>> {
        private _location;
        private _value;
        constructor(value: T, locationOrOffset: SourceLocation | number, line?: number, col?: number);
        location: SourceLocation;
        value: T;
        equals(other: LocationTagged<T>): boolean;
        toString(): string;
        toFormattedString(): string;
    }
}
declare module Razor.Text {
    class LookaheadToken extends DisposableAction {
        private _accepted;
        constructor(action: Function, context?: any);
        dispose(): void;
    }
}
declare module Razor.Text {
    class SeekableTextReader extends TextReader implements ITextDocument {
        private _position;
        private _buffer;
        private _location;
        private _current;
        constructor(content: string | TextReader | ITextBuffer);
        buffer: LineTrackingStringBuffer;
        location: SourceLocation;
        length: number;
        position: number;
        peek(): string | number;
        read(buffer?: string[], index?: number, count?: number): string | number;
        private updateState();
    }
}
declare module Razor.Text {
    class SourceSpan {
        begin: SourceLocation;
        end: SourceLocation;
    }
}
declare module Razor.Text {
    class StringTextReader extends TextReader {
        private _string;
        private _position;
        private _length;
        constructor(str: string);
        peek(): string | number;
        read(): string | number;
        readLine(): string;
        readToEnd(): string;
    }
}
declare module Razor.Text {
    class TextBufferReader extends LookaheadTextReader {
        private _bookmarks;
        private _tracker;
        private _buffer;
        constructor(buffer: ITextBuffer);
        buffer: ITextBuffer;
        location: SourceLocation;
        beginLookahead(): IDisposable;
        cancelBacktrack(): void;
        private endLookahead(context);
        dispose(): void;
        peek(): string | number;
        read(buffer?: string[], index?: number, count?: number): string | number;
    }
}
declare module Razor.Text {
    import Span = Razor.Parser.SyntaxTree.Span;
    class TextChange implements IEquatable<TextChange> {
        private _oldPosition;
        private _oldLength;
        private _oldBuffer;
        private _oldText;
        private _newPosition;
        private _newLength;
        private _newBuffer;
        private _newText;
        constructor(oldPosition: number, oldLength: number, oldBuffer: ITextBuffer, newPositionOrLength: number, newLengthOrBuffer: number | ITextBuffer, newBuffer?: ITextBuffer);
        isDelete: boolean;
        isInsert: boolean;
        isReplace: boolean;
        newBuffer: ITextBuffer;
        newLength: number;
        newPosition: number;
        newText: string;
        oldBuffer: ITextBuffer;
        oldLength: number;
        oldPosition: number;
        oldText: string;
        applyChange(contentOrSpan: string | Span, changeOffset?: number): string;
        equals(other: TextChange): boolean;
        static getText(buffer: ITextBuffer, position: number, length: number): string;
        normalize(): TextChange;
        toString(): string;
    }
}
declare module Razor.Text {
    enum TextChangeType {
        Insert = 0,
        Remove = 1,
    }
}
declare module Razor.Text {
    class TextDocumentReader extends TextReader implements ITextDocument {
        private _document;
        constructor(source: ITextDocument);
        document: ITextDocument;
        length: number;
        location: SourceLocation;
        position: number;
        peek(): string | number;
        read(buffer?: string[], index?: number, count?: number): string | number;
    }
}
