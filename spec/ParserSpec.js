const fs = require('fs');

const Parser = require('../Parser.js');

describe("Parser", () => {

  describe("string()", () => {
    let p = Parser("\"Hello World!\"");

    it("returns a string", () => {
      expect(p.string()).toEqual("Hello World!");
    })
  })

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

  describe("object()", () => {
    let p = Parser("{ \"key\": \"value\", \"ten\": 10 }")

    it("returns a key value pair", () => {
      expect(p.object()).toEqual({ key: "value", ten: 10 });
    })
  })

  describe("parse()", () => {
    let json = fs.readFileSync('spec/support/test.json', {encoding: 'utf8'});
    console.log(json);
    let p =  Parser(json)
    let obj = {
      one: 1,
      two: 2,
      three: 3,
      four: {
	five: 5,
	six: 6,
	seven: [
	  7, 8, 9
	]
      }
    }

    it("parses test json", () => {
      expect(p.parse()).toEqual(obj);
    })
  })

})
