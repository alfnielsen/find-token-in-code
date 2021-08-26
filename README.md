# find-token-in-code
find a token in a code. 

(including exclude of string, comment template etc) based on find-macthing-bracket npm package

And works for simple structure recognition in both JS Ts and Cs


```ts
    const code = `
    // test
    const foo = "test";
    let test1 = 42
    let test = true
    `;
    const position = matchToken(code, 'test');
    // position = 64 (the 'test' in 'let test = true')
    const reg_position = matchToken(code, /test\d*/);
    // reg_position = 45 (the 'test' in 'let test1 = 42')

```


complex example:



```ts
    const code = "var foo = `some ${test()}`; function test(){return 0}"
    const position = matchToken(code, 'test');
    // position = 37 (the 'test' in `some ${test()}` is in escapeJsTemaple and are not allowed by default)
    // default allowed parens are  [undefined,brackets.curly]

    const position = matchToken(code, 'test',[undefined,brackets.curly,brackets.escapeJsTemaple]);
    // position = 18 (the 'test' in `some ${test()}`;)

```


Allowed parent (Matching bracket):
| name | start | end | node |
|:-----|:-----:|:---:|:-----|
| undefeined         |     |     | This is global scope |
| lineComment        | //  |  \n | |
| multilineComment   | /*  |  */ | |
| multilineComment   | /*  |  */ | |
| angle              | <   |  >  | |
| peparentheses      | (   |  )  | |
| square             | [   |  ]  | |
| curly              | {   |  }  | |
| double             | "   |  "  | |
| single             | '   |  '  | |
| jsTemplate         |  \` |  \` | |
| cSharpTemplate     | $"  |  "  | |
| escapeJsTemaple    | ${  |  }  | only in jsTemplate |
| inCSharpTemaple    | {   |  }  | only in cSharpTemplate |



### For more complex code:

For more complex thing, take a look at something like: (Js only!)

https://www.npmjs.com/package/estree-walker

