; Later patterns win over earlier ones.

(identifier) @variable

; `PascalCase` names are types, `CAPITALS` are constants.
((identifier) @type
  (#match? @type "^[A-Z][A-Za-z0-9]*$"))

((identifier) @constant
  (#match? @constant "^[A-Z][A-Z0-9_]+$"))

((identifier) @type.builtin
  (#any-of? @type.builtin
    "i8" "i16" "i32" "i64" "i128" "u8" "u16" "u32" "u64" "u128" "size" "f32" "f64"
    "bool" "char" "str" "ptr" "array" "vector" "dict" "set" "heap" "shared" "simd"
    "thread" "sender" "receiver" "atomic" "mutex" "scope" "Optional"))

(field name: (identifier) @property)

(call function: (identifier) @function)
(method_call name: (identifier) @function.method)

; Conversions and constructors: `i64(x)`, `Point(1, 2)`.
(call function: (identifier) @type
  (#match? @type "^[A-Z][A-Za-z0-9]*$"))

(call function: (identifier) @type.builtin
  (#any-of? @type.builtin
    "i8" "i16" "i32" "i64" "i128" "u8" "u16" "u32" "u64" "u128" "size" "f32" "f64"
    "bool" "char" "str" "vector" "dict" "set" "shared" "atomic" "mutex"))

(call function: (identifier) @function.builtin
  (#any-of? @function.builtin
    "print" "len" "range" "allocate" "deallocate" "spawn" "channel" "panic" "min" "max" "sum" "item"
    "size_of" "align_of"))

(function_definition keyword: _ @keyword name: (identifier) @function.definition)
(type_definition keyword: _ @keyword name: (identifier) @type)

(decorator "@" @attribute name: (identifier) @attribute)

(keyword) @keyword
(parallel) @keyword
(select) @keyword

(self) @variable.special
(boolean) @boolean
(none) @constant.builtin

(integer) @number
(float) @number

(string) @string
(char) @string
(format_string) @string
(escape) @string.escape
(interpolation "{" @punctuation.special "}" @punctuation.special)
(interpolation) @embedded

(comment) @comment

(operator) @operator

["(" ")" "[" "]" "{" "}"] @punctuation.bracket
["," ":" "." "..."] @punctuation.delimiter
