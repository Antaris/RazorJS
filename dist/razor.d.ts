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
        static isBinaryDigit(value: string): boolean;
        static isOctalDigit(value: string): boolean;
        static isDecimalDigit(value: string): boolean;
        static isHexDigit(value: string): boolean;
        static isLetter(value: string): boolean;
        static isLetterOrDecimalDigit(value: string): boolean;
        static isNewLine(value: string): boolean;
        static isWhiteSpace(value: string): boolean;
        static isWhiteSpaceOrNewLine(value: string): boolean;
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
    class RazorError implements IEquatable<RazorError> {
        message: string;
        location: SourceLocation;
        length: number;
        constructor(message: string, location: SourceLocation, length: number);
        equals(other: RazorError): boolean;
    }
}
declare module Razor {
    class StateResult<T> {
        constructor(nextOrOutput: State<T> | T, next?: State<T>);
        hasOutput: boolean;
        output: T;
        next: State<T>;
    }
}
declare module Razor {
    interface State<T> {
        (): StateResult<T>;
    }
}
declare module Razor {
    class StateMachine<T> {
        protected startState: State<T>;
        protected currentState: State<T>;
        protected stay(output?: T): StateResult<T>;
        protected stop(): StateResult<T>;
        protected transition(outputOrNewState: T | State<T>, newState?: State<T>): StateResult<T>;
        protected turn(): T;
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
    function Using(contextOrDisposable: any | IDisposable, disposableOrAction: IDisposable | Function, action?: (disposable: IDisposable) => void): void;
}
declare module Razor.Parser.SyntaxTree {
    class Span {
        content: string;
        start: SourceLocation;
    }
}
declare module Razor.Text {
    class LookaheadToken extends DisposableAction {
        private _accepted;
        constructor(action: Function, context?: any);
        accept(): void;
        dispose(): void;
    }
}
declare module Razor.Text {
    interface ITextDocument extends ITextBuffer {
        location: SourceLocation;
    }
}
declare module Razor.Text {
    interface ITextBuffer {
        length: number;
        position: number;
        beginLookahead(): LookaheadToken;
        peek(): string | number;
        read(): string | number;
        readToEnd(): string;
        seek(count: number): void;
        toDocument(): ITextDocument;
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
    class CharacterReference {
        private _char;
        private _loc;
        constructor(character: string, location: SourceLocation);
        character: string;
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
        beginLookahead(): LookaheadToken;
        peek(): string | number;
        read(buffer?: string[], index?: number, count?: number): string | number;
        seek(count: number): void;
        private updateState();
        toDocument(): ITextDocument;
    }
}
declare module Razor.Tests {
    import ITextBuffer = Razor.Text.ITextBuffer;
    import ITextDocument = Razor.Text.ITextDocument;
    import LookaheadToken = Razor.Text.LookaheadToken;
    class StringTextBuffer implements ITextBuffer {
        private _position;
        private _length;
        private _buffer;
        constructor(buffer?: string);
        length: number;
        position: number;
        beginLookahead(): LookaheadToken;
        peek(): string | number;
        read(): string | number;
        readToEnd(): string;
        seek(count: number): void;
        toDocument(): ITextDocument;
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
    class LookaheadTextReader extends TextReader {
        currentLocation: SourceLocation;
        beginLookahead(): IDisposable;
        cancelBacktrack(): void;
    }
}
declare module Razor.Text {
    class StringBuilder {
        private _buffer;
        constructor(content?: string);
        length: number;
        append(content: string, startIndexOrRepeat?: number, count?: number): StringBuilder;
        appendLine(content: string): StringBuilder;
        private appendCore(content, startIndex, count);
        charAt(index: number): string;
        clear(): void;
        toString(): string;
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
        buffer: StringBuilder;
        buffering: boolean;
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
        currentLocation: SourceLocation;
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
        beginLookahead(): LookaheadToken;
        peek(): string | number;
        read(buffer?: string[], index?: number, count?: number): string | number;
        seek(count: number): void;
        toDocument(): ITextDocument;
    }
}
declare module Razor.Tokenizer.Symbols {
    interface ISymbol {
        content: string;
        start: SourceLocation;
        typeName: string;
        changeStart(newStart: SourceLocation): void;
        offsetStart(documentStart: SourceLocation): void;
    }
}
declare module Razor.Tokenizer.Symbols {
    import LocationTagged = Razor.Text.LocationTagged;
    class SymbolBase<T> implements ISymbol, IEquatable<SymbolBase<T>> {
        start: SourceLocation;
        content: string;
        type: T;
        errors: RazorError[];
        constructor(start: SourceLocation, content: string, type: T, errors: RazorError[]);
        typeName: string;
        changeStart(newStart: SourceLocation): void;
        getContent(): LocationTagged<string>;
        equals(other: SymbolBase<T>): boolean;
        offsetStart(documentStart: SourceLocation): void;
        toString(): string;
    }
}
declare module Razor.Tokenizer.Symbols {
    enum HtmlSymbolType {
        Unknown = 0,
        Text = 1,
        WhiteSpace = 2,
        NewLine = 3,
        OpenAngle = 4,
        Bang = 5,
        ForwardSlash = 6,
        QuestionMark = 7,
        DoubleHyphen = 8,
        LeftBracket = 9,
        CloseAngle = 10,
        RightBracket = 11,
        Equals = 12,
        DoubleQuote = 13,
        SingleQuote = 14,
        Transition = 15,
        Colon = 16,
        RazorComment = 17,
        RazorCommentStar = 18,
        RazorCommentTransition = 19,
    }
}
declare module Razor.Tokenizer.Symbols {
    class HtmlSymbol extends SymbolBase<HtmlSymbolType> {
        constructor(start: SourceLocation, content: string, type: HtmlSymbolType, errors?: RazorError[]);
        typeName: string;
    }
}
declare module Razor.Tokenizer {
    import ISymbol = Razor.Tokenizer.Symbols.ISymbol;
    import ITextDocument = Razor.Text.ITextDocument;
    interface ITokenizer {
        sourceDocument: ITextDocument;
        nextSymbol(): ISymbol;
        reset(): void;
    }
}
declare module Razor.Tokenizer {
    import ITextDocument = Razor.Text.ITextDocument;
    import TextDocumentReader = Razor.Text.TextDocumentReader;
    import StringBuilder = Razor.Text.StringBuilder;
    import ISymbol = Razor.Tokenizer.Symbols.ISymbol;
    class Tokenizer<TSymbol extends ISymbol, TSymbolType> extends StateMachine<TSymbol> implements ITokenizer {
        private _source;
        private _buffer;
        private _currentErrors;
        private _currentStart;
        constructor(source: ITextDocument);
        protected buffer: StringBuilder;
        protected currentCharacter: string;
        protected currentErrors: RazorError[];
        protected currentLocation: SourceLocation;
        protected currentStart: SourceLocation;
        protected endOfFile: boolean;
        protected haveContent: boolean;
        razorCommentStarType: TSymbolType;
        razorCommentType: TSymbolType;
        razorCommentTransitionType: TSymbolType;
        source: TextDocumentReader;
        sourceDocument: ITextDocument;
        protected afterRazorCommentTransition(): StateResult<TSymbol>;
        protected at(expected: string, caseSensitive: boolean): boolean;
        protected createSymbol(start: SourceLocation, content: string, type: TSymbolType, errors: RazorError[]): TSymbol;
        protected charOrWhiteSpace(character: string): (c: string) => boolean;
        protected endSymbol(startOrType: SourceLocation | TSymbolType, type?: TSymbolType): TSymbol;
        private lookahead(expected, takeIfMatch, caseSensitive);
        protected moveNext(): void;
        nextSymbol(): TSymbol;
        protected peek(): string;
        protected razorCommentBody(): StateResult<TSymbol>;
        reset(): void;
        protected resumeSymbol(previous: TSymbol): void;
        protected single(type: TSymbolType): TSymbol;
        protected startSymbol(): void;
        protected takeAll(expected: string, caseSensitive: boolean): boolean;
        protected takeCurrent(): void;
        protected takeString(input: string, caseSensitive: boolean): boolean;
        protected takeUntil(predicate: (c: string) => boolean): boolean;
    }
}
declare module Razor.Tokenizer {
    import HtmlSymbol = Razor.Tokenizer.Symbols.HtmlSymbol;
    import HtmlSymbolType = Razor.Tokenizer.Symbols.HtmlSymbolType;
    import ITextDocument = Razor.Text.ITextDocument;
    class HtmlTokenizer extends Tokenizer<HtmlSymbol, HtmlSymbolType> {
        constructor(source: ITextDocument);
        protected startState: State<HtmlSymbol>;
        razorCommentStarType: HtmlSymbolType;
        razorCommentType: HtmlSymbolType;
        razorCommentTransitionType: HtmlSymbolType;
        private atSymbol();
        protected createSymbol(start: SourceLocation, content: string, type: HtmlSymbolType, errors: RazorError[]): HtmlSymbol;
        private data();
        private newLine();
        private symbol();
        private text();
        static tokenize(content: string): HtmlSymbol[];
        private whiteSpace();
    }
}
declare module Razor.Tokenizer {
    class JavaScriptHelpers {
        static isIdentifierStart(character: string): boolean;
        static isIdentifierPart(character: string): boolean;
    }
}
declare module Razor.Tokenizer.Symbols {
    enum JavaScriptKeyword {
        Await = 0,
        Break = 1,
        Case = 2,
        Class = 3,
        Catch = 4,
        Const = 5,
        Continue = 6,
        Debugger = 7,
        Default = 8,
        Delete = 9,
        Do = 10,
        Else = 11,
        Enum = 12,
        Export = 13,
        Extends = 14,
        False = 15,
        Finally = 16,
        For = 17,
        Function = 18,
        If = 19,
        Implements = 20,
        Import = 21,
        In = 22,
        Interface = 23,
        Instanceof = 24,
        Let = 25,
        New = 26,
        Null = 27,
        Package = 28,
        Private = 29,
        Protected = 30,
        Public = 31,
        Return = 32,
        Static = 33,
        Super = 34,
        Switch = 35,
        This = 36,
        Throw = 37,
        True = 38,
        Try = 39,
        Typeof = 40,
        Var = 41,
        Void = 42,
        While = 43,
        Yield = 44,
    }
}
declare module Razor.Tokenizer {
    import JavaScriptKeyword = Razor.Tokenizer.Symbols.JavaScriptKeyword;
    class JavaScriptKeywordDetector {
        static symbolTypeForIdentifier(id: string): JavaScriptKeyword;
    }
}
declare module Razor.Tokenizer.Symbols {
    enum JavaScriptSymbolType {
        Unknown = 0,
        Identifier = 1,
        Keyword = 2,
        Transition = 3,
        IntegerlLiteral = 4,
        BinaryLiteral = 5,
        OctalLiteral = 6,
        HexLiteral = 7,
        RealLiteral = 8,
        StringLiteral = 9,
        RegularExpressionLiteral = 10,
        NewLine = 11,
        WhiteSpace = 12,
        Comment = 13,
        Dot = 14,
        Assignment = 15,
        LeftBracket = 16,
        RightBracket = 17,
        LeftParen = 18,
        RightParen = 19,
        LeftBrace = 20,
        RightBrace = 21,
        Plus = 22,
        Minus = 23,
        Modulo = 24,
        Increment = 25,
        Decrement = 26,
        BitwiseNot = 27,
        LogicalNot = 28,
        Divide = 29,
        Multiply = 30,
        Exponentiation = 31,
        LessThan = 32,
        LessThanEqualTo = 33,
        GreaterThan = 34,
        GreaterThenEqualTo = 35,
        Equal = 36,
        StrictEqual = 37,
        NotEqual = 38,
        StrictNotEqual = 39,
        BitwiseLeftShift = 40,
        BitwiseRightShift = 41,
        BitwiseUnsignedRightShift = 42,
        BitwiseAnd = 43,
        BitwiseOr = 44,
        BitwiseXor = 45,
        LogicalAnd = 46,
        LogicalOr = 47,
        QuestionMark = 48,
        Colon = 49,
        MultiplicationAssignment = 50,
        DivisionAssignment = 51,
        ModuloAssignment = 52,
        AdditionAssignment = 53,
        SubtractionAssignment = 54,
        BitwiseLeftShiftAssignment = 55,
        BitwiseRightShiftAssignment = 56,
        BitwiseUnsignedRightShiftAssignment = 57,
        BitwiseAndAssignment = 58,
        BitwiseOrAssignment = 59,
        BitwiseXorAssignment = 60,
        Comma = 61,
        DoubleQuote = 62,
        SingleQuote = 63,
        Backslash = 64,
        Semicolon = 65,
        RazorCommentTransition = 66,
        RazorCommentStar = 67,
        RazorComment = 68,
    }
}
declare module Razor.Tokenizer.Symbols {
    class JavaScriptSymbol extends SymbolBase<JavaScriptSymbolType> {
        constructor(start: SourceLocation, content: string, type: JavaScriptSymbolType, errors?: RazorError[], keyword?: JavaScriptKeyword);
        keyword: JavaScriptKeyword;
        typeName: string;
    }
}
declare module Razor.Tokenizer {
    import JavaScriptSymbolType = Razor.Tokenizer.Symbols.JavaScriptSymbolType;
    interface OperatorHandler {
        (): JavaScriptSymbolType;
    }
}
declare module Razor.Tokenizer {
    import JavaScriptSymbol = Razor.Tokenizer.Symbols.JavaScriptSymbol;
    import JavaScriptSymbolType = Razor.Tokenizer.Symbols.JavaScriptSymbolType;
    import ITextDocument = Razor.Text.ITextDocument;
    import RazorError = Razor.RazorError;
    class JavaScriptTokenizer extends Tokenizer<JavaScriptSymbol, JavaScriptSymbolType> {
        private _operatorHandlers;
        constructor(source: ITextDocument);
        protected startState: State<JavaScriptSymbol>;
        razorCommentStarType: JavaScriptSymbolType;
        razorCommentType: JavaScriptSymbolType;
        razorCommentTransitionType: JavaScriptSymbolType;
        private atSymbol();
        private bangOperator();
        private binaryLiteral();
        private blockComment();
        private createTwoCharOperatorHandler(typeIfOnlyFirst, option1?, typeIfOption1?, option2?, typeIfOption2?);
        protected createSymbol(start: SourceLocation, content: string, type: JavaScriptSymbolType, errors: RazorError[]): JavaScriptSymbol;
        private data();
        private decimalLiteral();
        private equalityOperator();
        private greaterThanOperator();
        private hexLiteral();
        private identifier();
        private lessThanOperator();
        private numericLiteral();
        private octalLiteral();
        private operator();
        private quotedLiteral(quote);
        private realLiteral();
        private realLiteralExponentPart();
        private regularExpressionLiteral();
        private singleLineComment();
        private solidus();
    }
}
declare module Razor.Tokenizer {
    import ISymbol = Razor.Tokenizer.Symbols.ISymbol;
    import ITextDocument = Razor.Text.ITextDocument;
    class TokenizerView<TTokenizer extends ITokenizer, TSymbol extends ISymbol, TSymbolType> {
        private _tokenizer;
        private _endOfFile;
        private _current;
        constructor(tokenizer: TTokenizer);
        current: TSymbol;
        endOfFile: boolean;
        source: ITextDocument;
        tokenizer: TTokenizer;
        next(): boolean;
        putBack(symbol: TSymbol): void;
    }
}
declare module Razor.Tokenizer.Symbols {
    enum KnownSymbolType {
        WhiteSpace = 0,
        Newline = 1,
        Identifier = 2,
        Keyword = 3,
        Transition = 4,
        Unknown = 5,
        CommentStart = 6,
        CommentStar = 7,
        CommentBody = 8,
    }
}
