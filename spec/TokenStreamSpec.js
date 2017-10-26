const InputStream = require('../InputStream.js');
const TokenStream = require('../TokenStream.js');

describe("TokenStream", () => {
  let istream, tstream;

  beforeEach(() => {
    istream = InputStream("34 + 34");
    tstream = TokenStream(istream);
  })

  describe("peek()", () => {
    it("returns {type: 'number', value: 34}", () => {
      expect(tstream.peek()).toEqual({type: 'number', value: 34});
    })

    it("does not advance stream", () => {
      expect(tstream.peek()).toEqual(tstream.peek());
    })
  })

  describe("next()", () => {
    let numToken = {type: 'number', value: 34};
    let opToken = {type: 'op', value: '+'};

    it("returns {type: 'number', value: 34}", () => {
      expect(tstream.next()).toEqual(numToken);
    })

    it ("should advance stream", () => {
      expect(tstream.next()).toEqual(numToken);
      expect(tstream.next()).toEqual(opToken);
      expect(tstream.next()).toEqual(numToken);
      expect(tstream.next()).toBe(null);
    })
  })

})
