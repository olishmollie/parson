const Parser = require('../Parser.js');

describe("Parser", () => {

  describe("value()", () => {
    let p = Parser("\"Hello World!\" 32");

    it("can return a string", () => {
      expect(p.value()).toEqual("Hello World!");
    })

    it("can return a number", () => {
      expect(p.value()).toEqual(32);
    })
  })

  describe("array()", () => {
    let p = Parser("[\"Hello World!\", 32]");

    it("returns an array of values", () => {
      expect(p.array()).toEqual(['Hello World!', 32]);
    })
  })

})
