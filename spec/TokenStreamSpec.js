const TokenStream = require('../TokenStream.js');

describe("TokenStream", () => {
  let ts;

  describe("identifiers", () => {

    it("returns a token of type 'ident'", () => {
      ts = TokenStream("hello");
      expect(ts.next()).toEqual({ type: 'ident', value: 'hello' });
    })

    it("cannot begin with a number", () => {
      ts = TokenStream("3hello");
      expect(ts.next).toThrowError("Unexpected char near (1:1)");
    })
  })
})
