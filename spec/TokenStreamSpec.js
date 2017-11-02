const TokenStream = require('../TokenStream.js');

describe("TokenStream", () => {
  let ts;

  it("returns a token of type 'number'", () => {
    ts = TokenStream("3");
    expect(ts.next()).toEqual({ type: 'number', value: 3 });
  })

  it("returns a token of type 'quotationMark'", () => {
    ts = TokenStream("\"Hello Parser!\" 32");
    expect(ts.next()).toEqual({ type: 'quotationMark', value: '"' });
  })

  it("returns a token of type 'ident'", () => {
    ts = TokenStream("\"Hello Parser!\"");
    expect(ts.next()).toEqual({ type: 'quotationMark', value: '"' });
    expect(ts.next()).toEqual({ type: 'ident', value: 'H' });
  })

  it("returns a token of type 'bracket'", () => {
    ts = TokenStream("[]");
    expect(ts.next()).toEqual({ type: 'lbracket', value: '[' });
    expect(ts.next()).toEqual({ type: 'rbracket', value: ']' });
  })

  it("returns a token of type 'comma'", () => {
    ts = TokenStream(",");
    expect(ts.next()).toEqual({ type: 'comma', value: ',' });
  })

  it("returns a token of type 'brace'", () => {
    ts = TokenStream("{}");
    expect(ts.next()).toEqual({ type: 'lbrace', value: '{' });
    expect(ts.next()).toEqual({ type: 'rbrace', value: '}' });
  })

})
