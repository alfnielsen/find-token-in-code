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

### For more complex code:

For more complex thing, take a look at something like: (Js only!)

https://www.npmjs.com/package/estree-walker

