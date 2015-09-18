/// <reference path="Symbols/JavaScriptKeyword.ts" />

namespace Razor.Tokenizer
{
  import JavaScriptKeyword = Razor.Tokenizer.Symbols.JavaScriptKeyword;
  
  var keywords = {
    "await": JavaScriptKeyword.Await,
    "break": JavaScriptKeyword.Break,
    "case": JavaScriptKeyword.Case,
    "class": JavaScriptKeyword.Class,
    "catch": JavaScriptKeyword.Catch,
    "const": JavaScriptKeyword.Const,
    "continue": JavaScriptKeyword.Continue,
    "debugger": JavaScriptKeyword.Debugger,
    "default": JavaScriptKeyword.Default,
    "delete": JavaScriptKeyword.Delete,
    "do": JavaScriptKeyword.Do,
    "else": JavaScriptKeyword.Else,
    "enum": JavaScriptKeyword.Enum,
    "export": JavaScriptKeyword.Export,
    "extends": JavaScriptKeyword.Extends,
    "false": JavaScriptKeyword.False,
    "finally": JavaScriptKeyword.Finally,
    "for": JavaScriptKeyword.For,
    "function": JavaScriptKeyword.Function,
    "if": JavaScriptKeyword.If,
    "implements": JavaScriptKeyword.Implements,
    "import": JavaScriptKeyword.Import,
    "in": JavaScriptKeyword.In,
    "interface": JavaScriptKeyword.Interface,
    "instanceof": JavaScriptKeyword.Instanceof,
    "let": JavaScriptKeyword.Let,
    "new": JavaScriptKeyword.New,
    "null": JavaScriptKeyword.Null,
    "package": JavaScriptKeyword.Package,
    "private": JavaScriptKeyword.Private,
    "protected": JavaScriptKeyword.Protected,
    "public": JavaScriptKeyword.Public,
    "return": JavaScriptKeyword.Return,
    "static": JavaScriptKeyword.Static,
    "super": JavaScriptKeyword.Super,
    "switch": JavaScriptKeyword.Switch,
    "this": JavaScriptKeyword.This,
    "throw": JavaScriptKeyword.Throw,
    "true": JavaScriptKeyword.True,
    "try": JavaScriptKeyword.Try,
    "typeof": JavaScriptKeyword.Typeof,
    "var": JavaScriptKeyword.Var,
    "void": JavaScriptKeyword.Void,
    "while": JavaScriptKeyword.While,
    "yield": JavaScriptKeyword.Yield
  };
  
  /**
   * Matches text symbols against known JavaScript keywords.
   * @class
   */
  export class JavaScriptKeywordDetector
  {    
    /**
     * Gets the symbol keyword for the given identifier
     * @function
     * @static
     * @param {string} id - The identifier
     * @returns {JavaScriptKeyword}
     */
    public static symbolTypeForIdentifier(id: string): JavaScriptKeyword
    {
      var keyword = keywords[id];
      if (typeof keyword === "undefined")
      {
        keyword = null;
      }
      return keyword;
    }
  }
}