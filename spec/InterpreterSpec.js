const Interpreter = require('../Interpreter.js');

describe("Interpreter", () => {

  describe("expressions", () => {

    it("supports binary addition", () => {
      let interpreter = Interpreter("10 + 4");
      expect(interpreter.eval()).toEqual(14);
    })

    it("supports binary subtraction", () => {
      let interpreter = Interpreter("10 - 4");
      expect(interpreter.eval()).toEqual(6);
    })

    it("supports multiple arithmetic operands", () => {
      let interpreter = Interpreter("10 + 4 - 30 + 2");
      expect(interpreter.eval()).toEqual(-14);
    })

    it("supports binary multiplication", () => {
      let interpreter = Interpreter("10 * 4");
      expect(interpreter.eval()).toEqual(40);
    })

    it("supports binary multiplication", () => {
      let interpreter = Interpreter("10 / 4");
      expect(interpreter.eval()).toEqual(1);
    })
  })
})
