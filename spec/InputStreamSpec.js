const InputStream = require('../inputStream');

describe("InputStream", () => {
  let testInput = "Hello World!";
  let istream;

  beforeEach(() => istream = InputStream(testInput))

  describe("peek()", () => {
    it("returns next character in stream", () => {
      expect(istream.peek()).toEqual('H');
    })
  })

  describe ("eof", () => {
    it ("returns true if at end of stream", () => {
      for (let i = 0; i < testInput.length; i++) {
	expect(istream.eof()).toBe(false);
	istream.next();
      }
      expect(istream.eof()).toBe(true);
    })
  })

  describe("croak()", () => {
    it("throws an error", () => {
      expect(() => istream.croak("Err")).toThrowError("Err (1:0)");
    })

    it("specifies correct line and column", () => {
      istream.next();
      expect(() => istream.croak("Err")).toThrowError("Err (1:1)");
    })
  })

  describe("next()", () => {
    it("returns next character of stream", () => {
      expect(istream.next()).toEqual('H');
    })

    it("removes returned character from stream", () => {
      istream.next();
      expect(istream.peek()).toEqual('e');
    })
  })
})
