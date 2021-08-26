var assert = require("assert");
var {default:matchToken, brackets} = require("../index.js");

describe("matchToken", function () {
  it("should find correct token (ignore comment and strings)", function () {
    const code = `
    // test
    const foo = "test";
    let test1 = 42
    let test = true
    `;
    const position = matchToken(code, 'test');
    assert.equal(64, position);
  });

  it("should find correct token with regexp", function () {
    const code = `
    // test
    const foo = "test";
    let test_foo = 42
    let test = true
    `;
    const position = matchToken(code, /test[^\b]/);
    assert.equal(45, position);
  });

  it("should find correct token intemplate string", function () {
    const code = "var foo = `some ${test()}`; function test(){return 0}"
    const position = matchToken(code, 'test',[undefined,brackets.curly,brackets.escapeJsTemaple]);
    assert.equal(18, position);
  });
  it("should only allow curly when not defined otherwise", function () {
    const code = "var foo = `some ${test()}`; function test(){return 0}"
    const position = matchToken(code, 'test');
    assert.equal(37, position);
  });

});
