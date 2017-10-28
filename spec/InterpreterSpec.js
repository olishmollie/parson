const Interpreter = require('../Interpreter.js');

describe("Interpreter", () => {

  describe("expressions", () => {

    it("supports binary addition", () => {
      let interpreter = Interpreter("10 + 4");
      expect(interpreter.expr()).toEqual(14);
    })

    it("supports binary subtraction", () => {
      let interpreter = Interpreter("10 - 4");
      expect(interpreter.expr()).toEqual(6);
    })

    it("supports binary multiplication", () => {
      let interpreter = Interpreter("10 * 4");
      expect(interpreter.expr()).toEqual(40);
    })

    it("supports binary multiplication", () => {
      let interpreter = Interpreter("10 / 4");
      expect(interpreter.expr()).toEqual(2.5);
    })

    it("supports operator precedence", () => {
      let interpreter = Interpreter("10 + 2 * 4");
      expect(interpreter.expr()).toEqual(18);
    })
  })
})
