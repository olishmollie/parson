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
    let simpleJson = fs.readFileSync('spec/support/simple.json', {encoding: 'utf8'});
    let middleJson = fs.readFileSync('spec/support/middle.json', {encoding: 'utf8'});
    let simpleObj = JSON.parse(simpleJson);
    let complexObj = JSON.parse(middleJson);

    it("parses simple JSON", () => {
      let p = Parser(simpleJson);
      let res = p.parse();
      expect(res).toEqual(simpleObj);
    })

    it("parses more complex JSON", () => {
      let p = Parser(middleJson);
      let res = p.parse();
      expect(res).toEqual(complexObj);
    })
  })
})
