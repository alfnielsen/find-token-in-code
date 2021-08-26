var assert = require("assert");
var matchToken = require("../index.js").default;

describe("matchToken", function () {
  it("should find correct token (ignore comment and strings)", function () {
    const code = `
    // test
    const foo = "test";
    let test1 = 42
    let test = true
    `;
    const endPosition = matchToken(code, 'test');
    assert.equal(64, endPosition);
  });

  it("should find correct token with regexp", function () {
    const code = `
    // test
    const foo = "test";
    let test_foo = 42
    let test = true
    `;
    const endPosition = matchToken(code, /test[^\b]/);
    assert.equal(45, endPosition);
  });
});
