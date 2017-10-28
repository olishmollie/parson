const TokenStream = require('../TokenStream.js');

describe("TokenStream", () => {
  let ts;

  describe("numbers", () => {

    it("returns a token of type 'number'", () => {
      ts = TokenStream("3");
      expect(ts.next()).toEqual({ type: 'number', value: 3 });
    })

  })
})
