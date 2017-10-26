const TokenStream = require('../TokenStream.js');

describe("TokenStream", () => {
  let tstream;
  let numToken = {type: 'number', value: 34};
  let opToken = {type: 'op', value: '+'};

  describe("peek()", () => {
    tstream = TokenStream("34 + 34");

    it("returns {type: 'number', value: 34}", () => {
      expect(tstream.peek()).toEqual(numToken);
    })

    it("does not advance stream", () => {
      expect(tstream.peek()).toEqual(tstream.peek());
    })
  })

  describe("next()", () => {
    let tstream = TokenStream("34      +     34");

    it("ignores whitespace", () => {
      expect(tstream.next()).toEqual(numToken);
    })

    it("should advance stream", () => {
      expect(tstream.next()).toEqual(opToken);
      expect(tstream.next()).toEqual(numToken);
      expect(tstream.next()).toBe(null);
    })

    it("should throw error on invalid operation", () => {
      let tstream = TokenStream("34 ++ 34");
      expect(tstream.next()).toEqual(numToken);
      expect(() => tstream.next()).toThrowError("Unknown operation '++' near (1:5)");
    })
  })
})
