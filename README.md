# Hesychia for Zed

Colors `.hsy` files in [Zed](https://zed.dev), in the manner of Python: keywords, types, functions, strings and what f-strings hold, numbers, comments. It also matches brackets, indents after a line ending with `:`, and lists functions and types in the outline.

There is no language server yet: Zed colors with the Tree-sitter grammar in `tree-sitter-hesychia`.

## Install

Clone this repository, then in Zed run `zed: install dev extension` and choose its folder.

## The grammar

`tree-sitter-hesychia` is made for editors, not for the compiler: it reads a file as words, strings and brackets, without blocks, so that a program being typed is colored however incomplete.

After a change to `grammar.js`:

```sh
cd tree-sitter-hesychia && tree-sitter generate
git commit -am "..." && git push
```

then set `rev` in `extension.toml` to that commit, and commit again: Zed builds the grammar from the commit named there.
