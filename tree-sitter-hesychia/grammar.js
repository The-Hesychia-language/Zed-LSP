// A grammar for editors, not for the compiler: it reads a file as a run of words, strings,
// brackets and a few shapes around them (`fn name`, `name(...)`, `.name`), without blocks or
// indentation. It colors a program being typed, however incomplete, and never rejects one.

const KEYWORDS = [
  'managed', 'manual', 'fn', 'method', 'struct', 'enum', 'trait', 'type', 'extern', 'priv',
  'const', 'mut', 'owned', 'if', 'elif', 'else', 'while', 'for', 'in', 'break', 'continue',
  'return', 'match', 'case', 'pass', 'with', 'as', 'raise', 'raises', 'try', 'except', 'check',
  'lambda', 'and', 'or', 'not', 'is', 'import', 'from', 'comptime', 'asm', 'extend',
];

const OPERATORS = [
  '+', '-', '*', '/', '//', '%', '**', '==', '!=', '<', '<=', '>', '>=', '&', '|', '^', '~',
  '<<', '>>', '=', '+=', '-=', '*=', '/=', '//=', '%=', '**=', '&=', '|=', '^=', '<<=', '>>=',
  '->',
];

module.exports = grammar({
  name: 'hesychia',

  word: $ => $.identifier,

  extras: _ => [/\s/],

  rules: {
    source_file: $ => repeat($._item),

    _item: $ => choice(
      $.comment,
      $.function_definition,
      $.type_definition,
      $.decorator,
      $.call,
      $.method_call,
      $.field,
      $.parallel,
      $.select,
      $.keyword,
      $.self,
      $.boolean,
      $.none,
      $.identifier,
      $.float,
      $.integer,
      $.string,
      $.raw_string,
      $.format_string,
      $.char,
      $.operator,
      $.parenthesized,
      $.bracketed,
      $.braced,
      ':', ',', '.', '...',
    ),

    // Not among the extras, so that a `#` inside an f-string stays text.
    comment: _ => token(seq('#', /.*/)),

    // `fn name` and `method name`.
    function_definition: $ => prec(1, seq(
      field('keyword', choice('fn', 'method')),
      field('name', $.identifier),
    )),

    // `struct Name`, `enum Name`, `trait Name`.
    type_definition: $ => prec(1, seq(
      field('keyword', choice('struct', 'enum', 'trait')),
      field('name', $.identifier),
    )),

    // `@symbol`, `@packed`, `@align`.
    decorator: $ => seq('@', field('name', $.identifier)),

    call: $ => prec(1, seq(field('function', $.identifier), field('arguments', $.parenthesized))),

    method_call: $ => prec(2, seq('.', field('name', $.identifier), field('arguments', $.parenthesized))),

    field: $ => prec(1, seq('.', field('name', $.identifier))),

    // `parallel` and `select` are names elsewhere.
    parallel: _ => token(prec(1, /parallel[ \t]+for/)),
    select: _ => token(prec(1, /select[ \t]*:/)),

    keyword: _ => choice(...KEYWORDS),

    self: _ => 'self',
    boolean: _ => choice('True', 'False'),
    none: _ => 'None',

    identifier: _ => /[A-Za-z_][A-Za-z0-9_]*/,

    integer: _ => token(choice(
      /0[xX][0-9a-fA-F_]+/,
      /0[bB][01_]+/,
      /0[oO][0-7_]+/,
      /[0-9][0-9_]*/,
    )),

    float: _ => token(choice(
      /[0-9][0-9_]*\.[0-9][0-9_]*([eE][+-]?[0-9]+)?/,
      /[0-9][0-9_]*[eE][+-]?[0-9]+/,
    )),

    string: _ => token(choice(
      /"""([^"]|"[^"]|""[^"])*"""/,
      seq('"', repeat(choice(/[^"\\\n]/, /\\./)), '"'),
    )),

    // `r"\d+"`: backslashes are text; `\"` does not end it.
    raw_string: _ => token(seq('r"', repeat(choice(/[^"\\\n]/, /\\[^\n]/)), '"')),

    char: _ => token(seq("'", choice(/[^'\\\n]/, /\\./, /\\u\{[0-9a-fA-F]+\}/), "'")),

    // `f"total: {n + 1}"`; `{{` and `}}` are braces.
    format_string: $ => seq(
      'f"',
      repeat(choice($.string_content, $.escape, $.interpolation)),
      token.immediate('"'),
    ),

    string_content: _ => token.immediate(prec(1, /[^"\\{}\n]+/)),

    escape: _ => token.immediate(choice(/\\./, '{{', '}}')),

    interpolation: $ => seq(token.immediate('{'), repeat($._item), '}'),

    operator: _ => choice(...OPERATORS),

    parenthesized: $ => seq('(', repeat($._item), ')'),
    bracketed: $ => seq('[', repeat($._item), ']'),
    braced: $ => seq('{', repeat($._item), '}'),
  },
});
