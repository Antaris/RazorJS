var Razor;
(function (Razor) {
    var Environment = (function () {
        function Environment() {
        }
        Environment.NewLine = '\r\n';
        return Environment;
    })();
    Razor.Environment = Environment;
})(Razor || (Razor = {}));
/// <reference path="../Internals/Environment.ts" />
var Razor;
(function (Razor) {
    var Parser;
    (function (Parser) {
        var ParserHelpers = (function () {
            function ParserHelpers() {
            }
            ParserHelpers.isNewLine = function (value) {
                if (!!value) {
                    if (value.length == 1) {
                        return value === '\r' ||
                            value === '\n' ||
                            value === '\u0085' ||
                            value === '\u2028' ||
                            value === '\u2029';
                    }
                    return value === Razor.Environment.NewLine;
                }
                return false;
            };
            return ParserHelpers;
        })();
        Parser.ParserHelpers = ParserHelpers;
    })(Parser = Razor.Parser || (Razor.Parser = {}));
})(Razor || (Razor = {}));
/// <reference path="../Parser/ParserHelpers.ts" />
/// <reference path="../SourceLocation.ts" />
/// <reference path="../Internals/Environment.ts" />
var Razor;
(function (Razor) {
    var Text;
    (function (Text) {
        var ParserHelpers = Razor.Parser.ParserHelpers;
        var SourceLocationTracker = (function () {
            function SourceLocationTracker(currentLocationOrAbsoluteIndex, lineIndex, characterIndex) {
                if (arguments.length === 0) {
                    this._currentLocation = Razor.SourceLocation.Zero;
                }
                else if (currentLocationOrAbsoluteIndex instanceof Razor.SourceLocation) {
                    this._currentLocation = currentLocationOrAbsoluteIndex;
                }
                else {
                    this._currentLocation = new Razor.SourceLocation(currentLocationOrAbsoluteIndex, lineIndex, characterIndex);
                }
                this.updateInternalState();
            }
            Object.defineProperty(SourceLocationTracker.prototype, "currentLocation", {
                get: function () {
                    return this._currentLocation;
                },
                set: function (value) {
                    if (!!value) {
                        if (!value.equals(this.currentLocation)) {
                            this._currentLocation = value;
                            this.updateInternalState();
                        }
                    }
                },
                enumerable: true,
                configurable: true
            });
            SourceLocationTracker.calculateNewLocation = function (lastPosition, newContent) {
                return new SourceLocationTracker(lastPosition).updateLocation(newContent).currentLocation;
            };
            SourceLocationTracker.prototype.recalculateSourceLocation = function () {
                this._currentLocation = new Razor.SourceLocation(this._absoluteIndex, this._lineIndex, this._characterIndex);
            };
            SourceLocationTracker.prototype.updateCharacterCore = function (characterRead, nextCharacter) {
                this._absoluteIndex++;
                if (Razor.Environment.NewLine.length === 1 && characterRead === Razor.Environment.NewLine ||
                    ParserHelpers.isNewLine(characterRead) && (characterRead !== '\r' || nextCharacter !== '\n')) {
                    this._lineIndex++;
                    this._characterIndex = 0;
                }
                else {
                    this._characterIndex++;
                }
            };
            SourceLocationTracker.prototype.updateInternalState = function () {
                this._absoluteIndex = this.currentLocation.absoluteIndex;
                this._lineIndex = this.currentLocation.lineIndex;
                this._characterIndex = this.currentLocation.characterIndex;
            };
            SourceLocationTracker.prototype.updateLocation = function (contentOrCharacterRead, nextCharacter) {
                if (!!nextCharacter) {
                    this.updateCharacterCore(contentOrCharacterRead, nextCharacter);
                }
                else {
                    var i = 0, l = contentOrCharacterRead.length;
                    for (; i < l; i++) {
                        nextCharacter = '\0';
                        if (i < (l - 1)) {
                            nextCharacter = contentOrCharacterRead[i + 1];
                        }
                        this.updateCharacterCore(contentOrCharacterRead[i], nextCharacter);
                    }
                }
                this.recalculateSourceLocation();
                return this;
            };
            return SourceLocationTracker;
        })();
        Text.SourceLocationTracker = SourceLocationTracker;
    })(Text = Razor.Text || (Razor.Text = {}));
})(Razor || (Razor = {}));
/// <reference path="Internals/IEquatable.ts" />
/// <reference path="Internals/IComparable.ts" />
/// <reference path="Text/SourceLocationTracker.ts" />
var Razor;
(function (Razor) {
    var SourceLocationTracker = Razor.Text.SourceLocationTracker;
    var SourceLocation = (function () {
        function SourceLocation(absoluteIndex, lineIndex, characterIndex) {
            this.absoluteIndex = absoluteIndex;
            this.lineIndex = lineIndex;
            this.characterIndex = characterIndex;
        }
        SourceLocation.add = function (left, right) {
            if (right.lineIndex > 0) {
                return new SourceLocation(left.absoluteIndex + right.absoluteIndex, left.lineIndex + right.lineIndex, right.characterIndex);
            }
            return new SourceLocation(left.absoluteIndex + right.absoluteIndex, left.lineIndex + right.lineIndex, left.characterIndex + right.characterIndex);
        };
        SourceLocation.advance = function (left, text) {
            var tracker = new SourceLocationTracker(left);
            tracker.updateLocation(text);
            return tracker.currentLocation;
        };
        SourceLocation.prototype.compareTo = function (other) {
            if (!other) {
                return -1;
            }
            return ((this.absoluteIndex < other.absoluteIndex) ? -1 : (this.absoluteIndex === other.absoluteIndex) ? 0 : 1);
        };
        SourceLocation.prototype.equals = function (other) {
            return this.compareTo(other) === 0;
        };
        SourceLocation.greaterThan = function (left, right) {
            return left.compareTo(right) > 0;
        };
        SourceLocation.lessThan = function (left, right) {
            return left.compareTo(right) < 0;
        };
        SourceLocation.subtract = function (left, right) {
            var characterIndex = (left.lineIndex != right.lineIndex) ? left.characterIndex : (left.characterIndex - right.characterIndex);
            return new SourceLocation(left.absoluteIndex - right.absoluteIndex, left.lineIndex - right.lineIndex, characterIndex);
        };
        SourceLocation.prototype.toString = function () {
            return ['(', this.absoluteIndex, ':', this.lineIndex, ',', this.characterIndex, ')'].join('');
        };
        SourceLocation.Undefined = new SourceLocation(-1, -1, -1);
        SourceLocation.Zero = new SourceLocation(0, 0, 0);
        return SourceLocation;
    })();
    Razor.SourceLocation = SourceLocation;
})(Razor || (Razor = {}));
/// <reference path="IDisposable.ts" />
var Razor;
(function (Razor) {
    var DisposableAction = (function () {
        function DisposableAction(action, context) {
            this._action = action;
            this._context = context || null;
        }
        DisposableAction.prototype.dispose = function () {
            this._action.apply(this._context, []);
        };
        return DisposableAction;
    })();
    Razor.DisposableAction = DisposableAction;
})(Razor || (Razor = {}));
/// <reference path="IDisposable.ts" />"
var Razor;
(function (Razor) {
    function Using(contextOrDisposable, disposableOrAction, action) {
        if (arguments.length === 2) {
            action = disposableOrAction;
            disposableOrAction = contextOrDisposable;
            contextOrDisposable = null;
        }
        try {
            action.apply(contextOrDisposable, [disposableOrAction]);
        }
        finally {
            disposableOrAction.dispose();
        }
    }
    Razor.Using = Using;
})(Razor || (Razor = {}));
/// <reference path="../../SourceLocation.ts" />
var Razor;
(function (Razor) {
    var Parser;
    (function (Parser) {
        var SyntaxTree;
        (function (SyntaxTree) {
            var Span = (function () {
                function Span() {
                }
                return Span;
            })();
            SyntaxTree.Span = Span;
        })(SyntaxTree = Parser.SyntaxTree || (Parser.SyntaxTree = {}));
    })(Parser = Razor.Parser || (Razor.Parser = {}));
})(Razor || (Razor = {}));
/// <reference path="../Text/ITextBuffer.ts" />
var Razor;
(function (Razor) {
    var Tests;
    (function (Tests) {
        var EOF = -1;
        var StringTextBuffer = (function () {
            function StringTextBuffer(buffer) {
                this._buffer = buffer || '';
                this._position = 0;
                this._length = this._buffer.length;
            }
            Object.defineProperty(StringTextBuffer.prototype, "length", {
                get: function () {
                    return this._length;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(StringTextBuffer.prototype, "position", {
                get: function () {
                    return this._position;
                },
                set: function (value) {
                    this._position = value;
                },
                enumerable: true,
                configurable: true
            });
            StringTextBuffer.prototype.peek = function () {
                if (this.position >= this._buffer.length) {
                    return EOF;
                }
                return this._buffer[this.position];
            };
            StringTextBuffer.prototype.read = function () {
                if (this.position >= this._buffer.length) {
                    return EOF;
                }
                return this._buffer[this.position++];
            };
            StringTextBuffer.prototype.readToEnd = function () {
                return this._buffer.substr(this.position);
            };
            return StringTextBuffer;
        })();
        Tests.StringTextBuffer = StringTextBuffer;
    })(Tests = Razor.Tests || (Razor.Tests = {}));
})(Razor || (Razor = {}));
/// <reference path="../SourceLocation.ts" />
var Razor;
(function (Razor) {
    var Text;
    (function (Text) {
        var BacktrackContext = (function () {
            function BacktrackContext(location, bufferIndex) {
                this.location = location;
                this.bufferIndex = bufferIndex;
                this.bufferIndex = this.bufferIndex || 0;
            }
            return BacktrackContext;
        })();
        Text.BacktrackContext = BacktrackContext;
    })(Text = Razor.Text || (Razor.Text = {}));
})(Razor || (Razor = {}));
/// <reference path="../Internals/IDisposable.ts" />
var Razor;
(function (Razor) {
    var Text;
    (function (Text) {
        var EOF = -1;
        var TextReader = (function () {
            function TextReader() {
            }
            TextReader.prototype.dispose = function () {
            };
            TextReader.prototype.peek = function () {
                return EOF;
            };
            TextReader.prototype.read = function (buffer, index, count) {
                if (arguments.length === 3) {
                    var n = 0, ch;
                    do {
                        ch = this.read();
                        if (ch === EOF) {
                            break;
                        }
                        buffer[index + n++] = ch;
                    } while (n < count);
                    return n;
                }
                return EOF;
            };
            TextReader.prototype.readBlock = function (buffer, index, count) {
                var i, n = 0;
                do {
                    n += (i = this.read(buffer, index + n, count - n));
                } while (i > 0 && n < count);
                return n;
            };
            TextReader.prototype.readLine = function () {
                var buffer = [], ch;
                while (true) {
                    ch = this.read();
                    if (ch === EOF) {
                        break;
                    }
                    if (ch === '\r' || ch === '\n') {
                        if (ch === '\r' && this.peek() === '\n') {
                            this.read();
                        }
                        return buffer.join('');
                    }
                    buffer.push(ch);
                }
                if (buffer.length) {
                    return buffer.join('');
                }
                return null;
            };
            TextReader.prototype.readToEnd = function () {
                var size = 4096;
                var buffer = (new Array(size)), len, res = [];
                while ((len = this.read(buffer, 0, size)) !== 0) {
                    res = res.concat(buffer.slice(0, len));
                }
                return res.join('');
            };
            return TextReader;
        })();
        Text.TextReader = TextReader;
    })(Text = Razor.Text || (Razor.Text = {}));
})(Razor || (Razor = {}));
/// <reference path="TextReader.ts" />
/// <reference path="../SourceLocation.ts" />
/// <reference path="../Internals/IDisposable.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Razor;
(function (Razor) {
    var Text;
    (function (Text) {
        var LookaheadTextReader = (function (_super) {
            __extends(LookaheadTextReader, _super);
            function LookaheadTextReader() {
                _super.apply(this, arguments);
            }
            Object.defineProperty(LookaheadTextReader.prototype, "currentLocation", {
                get: function () {
                    return null;
                },
                enumerable: true,
                configurable: true
            });
            LookaheadTextReader.prototype.beginLookahead = function () {
                return null;
            };
            LookaheadTextReader.prototype.cancelBacktrack = function () {
            };
            return LookaheadTextReader;
        })(Text.TextReader);
        Text.LookaheadTextReader = LookaheadTextReader;
    })(Text = Razor.Text || (Razor.Text = {}));
})(Razor || (Razor = {}));
/// <reference path="BacktrackContext.ts" />
/// <reference path="SourceLocationTracker.ts" />
/// <reference path="TextReader.ts" />
/// <reference path="../SourceLocation.ts" />
/// <reference path="../Internals/DisposableAction.ts" />
/// <reference path="LookaheadTextReader.ts" />
var Razor;
(function (Razor) {
    var Text;
    (function (Text) {
        var EOF = -1;
        var BufferingTextReader = (function (_super) {
            __extends(BufferingTextReader, _super);
            function BufferingTextReader(source) {
                _super.call(this);
                this._backtrackStack = [];
                this.buffer = null;
                this._source = source;
                this._locationTracker = new Text.SourceLocationTracker();
                this.updateCurrentCharacter();
            }
            Object.defineProperty(BufferingTextReader.prototype, "currentCharacter", {
                get: function () {
                    return this._currentCharacter;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BufferingTextReader.prototype, "currentLocation", {
                get: function () {
                    return this._locationTracker.currentLocation;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BufferingTextReader.prototype, "innerReader", {
                get: function () {
                    return this._source;
                },
                enumerable: true,
                configurable: true
            });
            BufferingTextReader.prototype.beginLookahead = function () {
                var _this = this;
                if (this.buffer === null) {
                    this.buffer = [];
                }
                if (!this.buffering) {
                    this.expandBuffer();
                    this.buffering = true;
                }
                var context = new Text.BacktrackContext(this.currentLocation, this._currentBufferPosition);
                this._backtrackStack.push(context);
                return new Razor.DisposableAction(function () { return _this.endLookahead(context); }, this);
            };
            BufferingTextReader.prototype.cancelBacktrack = function () {
                this._backtrackStack.pop();
            };
            BufferingTextReader.prototype.dispose = function () {
                this._source.dispose();
                _super.prototype.dispose.call(this);
            };
            BufferingTextReader.prototype.endLookahead = function (context) {
                if (this._backtrackStack.length > 0 && this._backtrackStack[this._backtrackStack.length - 1] === context) {
                    this._backtrackStack.pop();
                    this._currentBufferPosition = context.bufferIndex;
                    this._locationTracker.currentLocation = context.location;
                    this.updateCurrentCharacter();
                }
            };
            BufferingTextReader.prototype.expandBuffer = function () {
                var ch = this.innerReader.read();
                if (ch !== EOF) {
                    this.buffer.push(ch);
                    this._currentBufferPosition = this.buffer.length = -1;
                    return true;
                }
                return false;
            };
            BufferingTextReader.prototype.nextCharacter = function () {
                var prevChar = this.currentCharacter;
                if (prevChar === EOF) {
                    return;
                }
                if (this.buffering) {
                    if (this._currentBufferPosition >= this.buffer.length) {
                        if (this._backtrackStack.length === 0) {
                            this.buffer = [];
                            this._currentBufferPosition = 0;
                            this.buffering = false;
                        }
                        else if (!this.expandBuffer()) {
                            this._currentBufferPosition = this.buffer.length;
                        }
                    }
                    else {
                        this._currentBufferPosition++;
                    }
                }
                else {
                    this.innerReader.read();
                }
                this.updateCurrentCharacter();
                this._locationTracker.updateLocation(prevChar, this.currentCharacter);
            };
            BufferingTextReader.prototype.read = function (buffer, index, count) {
                if (arguments.length === 3) {
                    return _super.prototype.read.call(this, buffer, index, count);
                }
                var chr = this.currentCharacter;
                this.nextCharacter();
                return chr;
            };
            BufferingTextReader.prototype.peek = function () {
                return this.currentCharacter;
            };
            BufferingTextReader.prototype.updateCurrentCharacter = function () {
                if (this.buffering && this._currentBufferPosition < this.buffer.length) {
                    this._currentCharacter = this.buffer[this._currentBufferPosition];
                }
                else {
                    this._currentCharacter = this.innerReader.peek();
                }
            };
            return BufferingTextReader;
        })(Text.LookaheadTextReader);
        Text.BufferingTextReader = BufferingTextReader;
    })(Text = Razor.Text || (Razor.Text = {}));
})(Razor || (Razor = {}));
/// <reference path="../SourceLocation.ts" />
var Razor;
(function (Razor) {
    var Text;
    (function (Text) {
        var CharacterReference = (function () {
            function CharacterReference(character, location) {
                this._char = character;
                this._loc = location;
            }
            Object.defineProperty(CharacterReference.prototype, "character", {
                get: function () {
                    return this._char;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CharacterReference.prototype, "location", {
                get: function () {
                    return this._loc;
                },
                enumerable: true,
                configurable: true
            });
            return CharacterReference;
        })();
        Text.CharacterReference = CharacterReference;
    })(Text = Razor.Text || (Razor.Text = {}));
})(Razor || (Razor = {}));
/// <reference path="../SourceLocation.ts" />
/// <reference path="ITextBuffer.ts" />
var Razor;
(function (Razor) {
    var Text;
    (function (Text) {
        var TextLine = (function () {
            function TextLine(start, index, content) {
                this.start = start;
                this.index = index;
                this.content = content;
                if (!content) {
                    this.content = '';
                }
            }
            Object.defineProperty(TextLine.prototype, "end", {
                get: function () {
                    return this.start + this.length;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TextLine.prototype, "length", {
                get: function () {
                    return this.content.length;
                },
                enumerable: true,
                configurable: true
            });
            TextLine.prototype.contains = function (index) {
                return index < this.end && index >= this.start;
            };
            return TextLine;
        })();
        Text.TextLine = TextLine;
    })(Text = Razor.Text || (Razor.Text = {}));
})(Razor || (Razor = {}));
/// <reference path="CharacterReference.ts" />
/// <reference path="TextLine.ts" />
/// <reference path="../SourceLocation.ts" />
/// <reference path="../Parser/ParserHelpers.ts" />
var Razor;
(function (Razor) {
    var Text;
    (function (Text) {
        var ParserHelpers = Razor.Parser.ParserHelpers;
        var LineTrackingStringBuffer = (function () {
            function LineTrackingStringBuffer() {
                this._endLine = new Text.TextLine(0, 0);
                this._lines = [this._endLine];
            }
            Object.defineProperty(LineTrackingStringBuffer.prototype, "endLocation", {
                get: function () {
                    return new Razor.SourceLocation(this.length, this._lines.length - 1, this._lines[this._lines.length - 1].length);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LineTrackingStringBuffer.prototype, "length", {
                get: function () {
                    return this._endLine.end;
                },
                enumerable: true,
                configurable: true
            });
            LineTrackingStringBuffer.prototype.append = function (content) {
                for (var i = 0; i < content.length; i++) {
                    this._lines[this._lines.length - 1].content += content[i];
                    if ((content[i] === '\r' && (i + 1 === content.length || content[i + 1] !== '\n')) || (content[i] !== '\r' && ParserHelpers.isNewLine(content[i]))) {
                        this.pushNewLine();
                    }
                }
            };
            LineTrackingStringBuffer.prototype.charAt = function (absoluteIndex) {
                var line = this.findLine(absoluteIndex);
                if (line === null) {
                    throw "Argument out of range: " + absoluteIndex;
                }
                var idx = absoluteIndex - line.start;
                return new Text.CharacterReference(line.content[idx], new Razor.SourceLocation(absoluteIndex, line.index, idx));
            };
            LineTrackingStringBuffer.prototype.findLine = function (absoluteIndex) {
                var selected = null;
                if (this._currentLine != null) {
                    if (this._currentLine.contains(absoluteIndex)) {
                        selected = this._currentLine;
                    }
                    else if (absoluteIndex > this._currentLine.index && this._currentLine.index + 1 < this._lines.length) {
                        selected = this.scanLines(absoluteIndex, this._currentLine.index);
                    }
                }
                if (selected === null) {
                    selected = this.scanLines(absoluteIndex, 0);
                }
                this._currentLine = selected;
                return selected;
            };
            LineTrackingStringBuffer.prototype.scanLines = function (absoluteIndex, start) {
                for (var i = 0; i < this._lines.length; i++) {
                    var idx = (i + start) % this._lines.length;
                    if (this._lines[idx].contains(absoluteIndex)) {
                        return this._lines[idx];
                    }
                }
                return null;
            };
            LineTrackingStringBuffer.prototype.pushNewLine = function () {
                this._endLine = new Text.TextLine(this._endLine.end, this._endLine.index + 1);
                this._lines.push(this._endLine);
            };
            return LineTrackingStringBuffer;
        })();
        Text.LineTrackingStringBuffer = LineTrackingStringBuffer;
    })(Text = Razor.Text || (Razor.Text = {}));
})(Razor || (Razor = {}));
/// <reference path="../SourceLocation.ts" />
var Razor;
(function (Razor) {
    var Text;
    (function (Text) {
        var LocationTagged = (function () {
            function LocationTagged(value, locationOrOffset, line, col) {
                this._location = Razor.SourceLocation.Undefined;
                this._value = null;
                this._value = value;
                if (locationOrOffset instanceof Razor.SourceLocation) {
                    this._location = locationOrOffset;
                }
                else {
                    this._location = new Razor.SourceLocation(locationOrOffset, line, col);
                }
            }
            Object.defineProperty(LocationTagged.prototype, "location", {
                get: function () {
                    return this._location;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LocationTagged.prototype, "value", {
                get: function () {
                    return this._value;
                },
                enumerable: true,
                configurable: true
            });
            LocationTagged.prototype.equals = function (other) {
                if (!!other) {
                    if (this === other) {
                        return true;
                    }
                    return this.location.equals(other.location) &&
                        (this.value === other.value);
                }
                return false;
            };
            LocationTagged.prototype.toString = function () {
                return (this.value || "").toString();
            };
            LocationTagged.prototype.toFormattedString = function () {
                return [this.toString(), '@', this.location.toString()].join('');
            };
            return LocationTagged;
        })();
        Text.LocationTagged = LocationTagged;
    })(Text = Razor.Text || (Razor.Text = {}));
})(Razor || (Razor = {}));
/// <reference path="../Internals/DisposableAction.ts" />
var Razor;
(function (Razor) {
    var Text;
    (function (Text) {
        var LookaheadToken = (function (_super) {
            __extends(LookaheadToken, _super);
            function LookaheadToken(action, context) {
                _super.call(this, action, context);
                this._accepted = false;
            }
            LookaheadToken.prototype.dispose = function () {
                if (!this._accepted) {
                    _super.prototype.dispose.call(this);
                }
            };
            return LookaheadToken;
        })(Razor.DisposableAction);
        Text.LookaheadToken = LookaheadToken;
    })(Text = Razor.Text || (Razor.Text = {}));
})(Razor || (Razor = {}));
/// <reference path="TextReader.ts" />
/// <reference path="ITextBuffer.ts" />
/// <reference path="ITextDocument.ts" />
/// <reference path="../SourceLocation.ts" />
/// <reference path="LineTrackingStringBuffer.ts" />
/// <reference path="CharacterReference.ts" />
var Razor;
(function (Razor) {
    var Text;
    (function (Text) {
        var EOF = -1;
        var SeekableTextReader = (function (_super) {
            __extends(SeekableTextReader, _super);
            function SeekableTextReader(content) {
                _super.call(this);
                this._position = 0;
                this._buffer = new Text.LineTrackingStringBuffer();
                this._location = Razor.SourceLocation.Zero;
                if (content instanceof Text.TextReader) {
                    content = content.readToEnd();
                }
                else if (!(content instanceof String)) {
                    content = content.readToEnd();
                }
                this._buffer.append(content);
                this.updateState();
            }
            Object.defineProperty(SeekableTextReader.prototype, "buffer", {
                get: function () {
                    return this._buffer;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SeekableTextReader.prototype, "location", {
                get: function () {
                    return this._location;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SeekableTextReader.prototype, "length", {
                get: function () {
                    return this._buffer.length;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SeekableTextReader.prototype, "position", {
                get: function () {
                    return this._position;
                },
                set: function (value) {
                    if (this._position !== value) {
                        this._position = value;
                        this.updateState();
                    }
                },
                enumerable: true,
                configurable: true
            });
            SeekableTextReader.prototype.peek = function () {
                if (!this._current) {
                    return EOF;
                }
                return this._current;
            };
            SeekableTextReader.prototype.read = function (buffer, index, count) {
                if (arguments.length === 3) {
                    return _super.prototype.read.call(this, buffer, index, count);
                }
                if (!this._current) {
                    return EOF;
                }
                var chr = this._current;
                this._position++;
                this.updateState();
                return chr;
            };
            SeekableTextReader.prototype.updateState = function () {
                if (this._position < this._buffer.length) {
                    var ref = this._buffer.charAt(this._position);
                    this._current = ref.character;
                    this._location = ref.location;
                }
                else if (this._buffer.length === 0) {
                    this._current = null;
                    this._location = Razor.SourceLocation.Zero;
                }
                else {
                    this._current = null;
                    this._location = this._buffer.endLocation;
                }
            };
            return SeekableTextReader;
        })(Text.TextReader);
        Text.SeekableTextReader = SeekableTextReader;
    })(Text = Razor.Text || (Razor.Text = {}));
})(Razor || (Razor = {}));
/// <reference path="../SourceLocation.ts" />
var Razor;
(function (Razor) {
    var Text;
    (function (Text) {
        var SourceSpan = (function () {
            function SourceSpan() {
            }
            return SourceSpan;
        })();
        Text.SourceSpan = SourceSpan;
    })(Text = Razor.Text || (Razor.Text = {}));
})(Razor || (Razor = {}));
var Razor;
(function (Razor) {
    var Text;
    (function (Text) {
        var StringBuilder = (function () {
            function StringBuilder(content) {
                if (!!content) {
                    this._buffer = content.split('');
                }
                else {
                    this._buffer = [];
                }
            }
            Object.defineProperty(StringBuilder.prototype, "length", {
                get: function () {
                    return this._buffer.length;
                },
                enumerable: true,
                configurable: true
            });
            StringBuilder.prototype.append = function (content, startIndexOrRepeat, count) {
                if (!!content && content.length > 1) {
                    this.appendCore(content, 0, content.length);
                }
                else if (!!count) {
                    this.appendCore(content, startIndexOrRepeat, count);
                }
                else if (!!startIndexOrRepeat) {
                    for (var i = 0; i < startIndexOrRepeat; i++) {
                        this.appendCore(content[0], 0, 1);
                    }
                }
                else if (!!content) {
                    this.appendCore(content[0], 0, 1);
                }
                return this;
            };
            StringBuilder.prototype.appendCore = function (content, startIndex, count) {
                for (var i = startIndex; i < content.length && i < (startIndex + count); i++) {
                    this._buffer.push(content[i]);
                }
            };
            StringBuilder.prototype.charAt = function (index) {
                if (index >= this.length) {
                    throw "Index out of range: " + index;
                }
                return this._buffer[index];
            };
            StringBuilder.prototype.clear = function () {
                this._buffer = [];
            };
            StringBuilder.prototype.toString = function () {
                return this._buffer.join("");
            };
            return StringBuilder;
        })();
        Text.StringBuilder = StringBuilder;
    })(Text = Razor.Text || (Razor.Text = {}));
})(Razor || (Razor = {}));
/// <reference path="../Internals/IDisposable.ts" />
/// <reference path="TextReader.ts" />
var Razor;
(function (Razor) {
    var Text;
    (function (Text) {
        var EOF = -1;
        var StringTextReader = (function (_super) {
            __extends(StringTextReader, _super);
            function StringTextReader(str) {
                _super.call(this);
                this._string = str;
                this._position = 0;
                this._length = (!!str ? str.length : 0);
            }
            StringTextReader.prototype.peek = function () {
                if (!!this._string) {
                    if (this._position === this._length) {
                        return EOF;
                    }
                    return this._string[this._position];
                }
                return EOF;
            };
            StringTextReader.prototype.read = function () {
                if (!!this._string) {
                    if (this._position === this._length) {
                        return EOF;
                    }
                    return this._string[this._position++];
                }
                return EOF;
            };
            StringTextReader.prototype.readLine = function () {
                var val, i = this._position, chr;
                if (!!this._string) {
                    return '';
                }
                while (i < this._length) {
                    chr = this._string[i];
                    if (chr === '\r' || chr === '\n') {
                        val = this._string.substr(this._position, i - this._position);
                        this._position = i + 1;
                        if (chr === '\r' && this._position < this._length && this._string[this._position] === '\n') {
                            this._position++;
                        }
                        return val;
                    }
                    i++;
                }
                if (i > this._position) {
                    val = this._string[this._position, i - this._position];
                    this._position = i;
                    return val;
                }
                return null;
            };
            StringTextReader.prototype.readToEnd = function () {
                var val;
                if (!this._string) {
                    return null;
                }
                if (this._position === 0) {
                    return this._string;
                }
                val = this._string.substr(this._position, this._length - this._position);
                this._position = this._length;
                return val;
            };
            return StringTextReader;
        })(Text.TextReader);
        Text.StringTextReader = StringTextReader;
    })(Text = Razor.Text || (Razor.Text = {}));
})(Razor || (Razor = {}));
/// <reference path="LookaheadTextReader.ts" />
/// <reference path="../SourceLocation.ts" />
/// <reference path="../Internals/IDisposable.ts" />
/// <reference path="LookaheadToken.ts" />
/// <reference path="ITextBuffer.ts" />
/// <reference path="BacktrackContext.ts" />
/// <reference path="SourceLocationTracker.ts" />
var Razor;
(function (Razor) {
    var Text;
    (function (Text) {
        var EOF = -1;
        var TextBufferReader = (function (_super) {
            __extends(TextBufferReader, _super);
            function TextBufferReader(buffer) {
                _super.call(this);
                this._bookmarks = [];
                this._tracker = new Text.SourceLocationTracker();
                this._buffer = buffer;
            }
            Object.defineProperty(TextBufferReader.prototype, "buffer", {
                get: function () {
                    return this._buffer;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TextBufferReader.prototype, "currentLocation", {
                get: function () {
                    return this._tracker.currentLocation;
                },
                enumerable: true,
                configurable: true
            });
            TextBufferReader.prototype.beginLookahead = function () {
                var _this = this;
                var context = new Text.BacktrackContext(this.currentLocation);
                this._bookmarks.push(context);
                return new Razor.DisposableAction(function () {
                    _this.endLookahead(context);
                });
            };
            TextBufferReader.prototype.cancelBacktrack = function () {
                this._bookmarks.pop();
            };
            TextBufferReader.prototype.endLookahead = function (context) {
                if (this._bookmarks.length > 0 && this._bookmarks[this._bookmarks.length - 1] === context) {
                    this._bookmarks.pop();
                    this._tracker.currentLocation = context.location;
                    this._buffer.position = context.location.absoluteIndex;
                }
            };
            TextBufferReader.prototype.dispose = function () {
                var dis = this._buffer['dispose'];
                if (!!dis) {
                    dis.apply(this._buffer, []);
                }
            };
            TextBufferReader.prototype.peek = function () {
                return this._buffer.peek();
            };
            TextBufferReader.prototype.read = function (buffer, index, count) {
                if (arguments.length === 3) {
                    return _super.prototype.read.call(this, buffer, index, count);
                }
                var read = this._buffer.read();
                if (read !== EOF) {
                    var nextChar = '\0', next = this.peek();
                    if (next !== EOF) {
                        nextChar = next;
                    }
                    this._tracker.updateLocation(read, nextChar);
                }
                return read;
            };
            return TextBufferReader;
        })(Text.LookaheadTextReader);
        Text.TextBufferReader = TextBufferReader;
    })(Text = Razor.Text || (Razor.Text = {}));
})(Razor || (Razor = {}));
/// <reference path="ITextBuffer.ts" />
/// <reference path="../Internals/IEquatable.ts" />
/// <reference path="../Parser/SyntaxTree/Span.ts" />
var Razor;
(function (Razor) {
    var Text;
    (function (Text) {
        var Span = Razor.Parser.SyntaxTree.Span;
        var TextChange = (function () {
            function TextChange(oldPosition, oldLength, oldBuffer, newPositionOrLength, newLengthOrBuffer, newBuffer) {
                var newPosition, newLength;
                if (arguments.length === 5) {
                    newBuffer = newLengthOrBuffer;
                    newLength = newPositionOrLength;
                    newPosition = oldPosition;
                }
                else {
                    newPosition = newPositionOrLength;
                    newLength = newLengthOrBuffer;
                }
                this._oldPosition = oldPosition;
                this._oldLength = oldLength;
                this._oldBuffer = oldBuffer;
                this._newPosition = newPosition;
                this._newLength = newLength;
                this._newBuffer = newBuffer;
            }
            Object.defineProperty(TextChange.prototype, "isDelete", {
                get: function () {
                    return this._oldLength > 0 && this._newLength === 0;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TextChange.prototype, "isInsert", {
                get: function () {
                    return this._oldLength === 0 && this._newLength > 0;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TextChange.prototype, "isReplace", {
                get: function () {
                    return this._oldLength > 0 && this._newLength > 0;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TextChange.prototype, "newBuffer", {
                get: function () {
                    return this._newBuffer;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TextChange.prototype, "newLength", {
                get: function () {
                    return this._newLength;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TextChange.prototype, "newPosition", {
                get: function () {
                    return this._newPosition;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TextChange.prototype, "newText", {
                get: function () {
                    if (!this._newText) {
                        this._newText = TextChange.getText(this._newBuffer, this._newPosition, this._newLength);
                    }
                    return this._newText;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TextChange.prototype, "oldBuffer", {
                get: function () {
                    return this._oldBuffer;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TextChange.prototype, "oldLength", {
                get: function () {
                    return this._oldLength;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TextChange.prototype, "oldPosition", {
                get: function () {
                    return this._oldPosition;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TextChange.prototype, "oldText", {
                get: function () {
                    if (!this._oldText) {
                        this._oldText = TextChange.getText(this._oldBuffer, this._oldPosition, this._oldLength);
                    }
                    return this._oldText;
                },
                enumerable: true,
                configurable: true
            });
            TextChange.prototype.applyChange = function (contentOrSpan, changeOffset) {
                var content, changeRelativePosition, prefix, suffix;
                if (contentOrSpan instanceof Span) {
                    content = contentOrSpan.content;
                    changeOffset = contentOrSpan.start.absoluteIndex;
                }
                else {
                    content = contentOrSpan;
                }
                changeRelativePosition = this.oldPosition - changeOffset;
                prefix = content.substr(0, changeRelativePosition);
                suffix = content.substr(changeRelativePosition + changeOffset);
                return [prefix, this.newText, suffix].join('');
            };
            TextChange.prototype.equals = function (other) {
                if (!!other) {
                    return this._oldPosition === other.oldPosition &&
                        this._oldLength === other.oldLength &&
                        this._newPosition === other.newPosition &&
                        this._newLength === other.newLength &&
                        this._oldBuffer === other.oldBuffer &&
                        this._newBuffer === other.newBuffer;
                }
                return false;
            };
            TextChange.getText = function (buffer, position, length) {
                var oldPosition, builder, i = 0, c;
                if (length === 0) {
                    return '';
                }
                oldPosition = buffer.position;
                try {
                    buffer.position = position;
                    if (length === 1) {
                        return buffer.read();
                    }
                    else {
                        builder = [];
                        for (; i < length; i++) {
                            c = buffer.read();
                            builder.push(c);
                        }
                        return builder.join('');
                    }
                }
                finally {
                    buffer.position = oldPosition;
                }
            };
            TextChange.prototype.normalize = function () {
                if (!!this._oldBuffer &&
                    this.isReplace &&
                    this._newLength > this._oldLength &&
                    this._newPosition === this._oldPosition &&
                    this.newText.indexOf(this.oldText) >= 0) {
                    return new TextChange(this.oldPosition + this.oldLength, 0, this.oldBuffer, this.oldPosition + this.oldLength, this.newLength - this.oldLength, this.newBuffer);
                }
                return this;
            };
            TextChange.prototype.toString = function () {
                return ['(', this.oldPosition, ':', this.oldLength, ' "', this.oldText, '") => (', this.newPosition, ':', this.newLength, ' \"', this.newText, '\")'].join('');
            };
            return TextChange;
        })();
        Text.TextChange = TextChange;
    })(Text = Razor.Text || (Razor.Text = {}));
})(Razor || (Razor = {}));
var Razor;
(function (Razor) {
    var Text;
    (function (Text) {
        (function (TextChangeType) {
            TextChangeType[TextChangeType["Insert"] = 0] = "Insert";
            TextChangeType[TextChangeType["Remove"] = 1] = "Remove";
        })(Text.TextChangeType || (Text.TextChangeType = {}));
        var TextChangeType = Text.TextChangeType;
    })(Text = Razor.Text || (Razor.Text = {}));
})(Razor || (Razor = {}));
/// <reference path="../SourceLocation.ts" />
/// <reference path="ITextDocument.ts" />
/// <reference path="TextReader.ts" />"
var Razor;
(function (Razor) {
    var Text;
    (function (Text) {
        var TextDocumentReader = (function (_super) {
            __extends(TextDocumentReader, _super);
            function TextDocumentReader(source) {
                _super.call(this);
                this._document = source;
            }
            Object.defineProperty(TextDocumentReader.prototype, "document", {
                get: function () {
                    return this._document;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TextDocumentReader.prototype, "length", {
                get: function () {
                    return this._document.length;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TextDocumentReader.prototype, "location", {
                get: function () {
                    return this._document.location;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TextDocumentReader.prototype, "position", {
                get: function () {
                    return this._document.position;
                },
                set: function (value) {
                    this._document.position = value;
                },
                enumerable: true,
                configurable: true
            });
            TextDocumentReader.prototype.peek = function () {
                return this._document.peek();
            };
            TextDocumentReader.prototype.read = function (buffer, index, count) {
                if (arguments.length === 3) {
                    return _super.prototype.read.call(this, buffer, index, count);
                }
                return this._document.read();
            };
            return TextDocumentReader;
        })(Text.TextReader);
        Text.TextDocumentReader = TextDocumentReader;
    })(Text = Razor.Text || (Razor.Text = {}));
})(Razor || (Razor = {}));
//# sourceMappingURL=razor.js.map