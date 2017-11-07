const parse = require('../parse.js');

describe("parse()", () => {
  let json;

  describe("objects", () => {

    it ("correctly parses simple objects", () => {
      json = "{\"key\":\"value\",\"foo\":\"bar\"}";
      expect(parse(json)).toEqual({ key: "value", foo: "bar" });
    })

    it ("ignores whitepsace in simple objects", () => {
      json = "    {    \"key\"   :    \"value\"  , \"foo\":   \"bar\"      }";
      expect(parse(json)).toEqual({ key: "value", foo: "bar" });
    })
  })

  describe("arrays", () => {

    it ("correctly parses simple arrays", () => {
      json = "[\"one\",2,3,\"four\"]";
      expect(parse(json)).toEqual(["one", 2, 3, "four"]);
    })

    it ("ignores whitespace in simple arrays", () => {
      json = "[    \"one\"    , 2,3     ,     \"four\"        ]";
      expect(parse(json)).toEqual(["one", 2, 3, "four"]);
    })
  })

  describe("strings", () => {

    it ("correctly parses simple strings", () => {
      json = "[ \"string\" ]";
      expect(parse(json)).toEqual([ "string" ]);
    })

    it ("correctly parses strings with spaces", () => {
      json = "[ \"this string has spaces\" ]";
      expect(parse(json)).toEqual([ "this string has spaces" ]);
    })

    it ("correctly parses strings with numbers, commas and colons", () => {
      json = "[ \"this string has numbers: 10 5879.5104 -23, commas, and colons::\" ]";
      expect(parse(json)).toEqual([ "this string has numbers: 10 5879.5104 -23, commas, and colons::" ]);
    })

    it ("correctly parses a string with escape characters", () => {
      json = '[ \"this is\\ta \\"string\\" with\\fescape characters\" ]'
      expect(parse(json)).toEqual([ "this is\ta \"string\" with\fescape characters" ]);
    })
  })

  describe("numbers", () => {

    it ("correctly parses simple integers", () => {
      json = "{ \"one\": 1, \"two\": 2, \"three\": 3 }";
      expect(parse(json)).toEqual({ one: 1, two: 2, three: 3 });
    })

    it ("correctly parses multi-digit integers", () => {
      json = "[ 1400, 59874, 12, 3 ]";
      expect(parse(json)).toEqual([ 1400, 59874, 12, 3 ]);
    })

    it ("correctly parses negative integers", () => {
      json = "{ \"negative one\": -1 }";
      expect(parse(json)).toEqual({ "negative one": -1 });
    })

    it ("correctly parses numbers with decimal precision", () => {
      json = "[ 1.234, 5.67890, -0.2 ]";
      expect(parse(json)).toEqual([ 1.234, 5.6789, -0.2 ]);
    })

    it ("correctly parses a number with mantissa", () => {
      json = "[ 1e-4, 0e4, 4.43E-3, -0.299e3 ]";
      expect(parse(json)).toEqual([ 0.0001, 0, .00443, -299 ]);
    })
  })

  describe("special values", () => {

    it ("correctly parses boolean values", () => {
      json = "{ \"true\": true, \"false\": false }";
      expect(parse(json)).toEqual({ "true": true, "false": false });
    })

    it ("correctly parses 'null'", () => {
      json = "[ null, \"null\", null ]";
      expect(parse(json)).toEqual([ null, "null", null ]);
    })
  })

  describe("objects and arrays", () => {

    it ("correctly parses nested arrays", () => {
      json = "[ [ 1, 2 ], 3, { \"four\": [ 5, 6, 7 ] } ]";
      expect(parse(json)).toEqual([ [ 1, 2 ], 3, { four: [ 5, 6, 7 ] } ]);
    })

    it ("correctly parses nested objects", () => {
      json = "{ \"obj\": { \"foo\": \"bar\", \"array\": [ 1, 2, [ 3, 4 ] ] } }"
      expect(parse(json)).toEqual({ obj: { foo: 'bar', array: [ 1, 2, [ 3, 4 ] ] } });
    })
  })

  describe("multi-line json", () => {
    const fs = require('fs');

    it ("correctly parses multi-line json", () => {
      json = fs.readFileSync('spec/support/simple.json', {encoding: 'utf8'});
      expect(parse(json)).toEqual(JSON.parse(json));
    })
  })

  describe("errors", () => {

    it ("throws an error for a simple incorrect object", () => {
      json = "{ foo: \"bar\" }";
      expect(() => parse(json)).toThrow("Unexpected 'f' at line 1, col 2");
    })

    it ("throws an error for a simple incorrect array", () => {
      json = "[ 1, 2, 3 4 ]";
      expect(() => parse(json)).toThrow("Unexpected '4' at line 1, col 10");
    })

    it ("throws an error for a simple incorrect string", () => {
      json = "[ \"an unclosed string literal ]";
      expect(() => parse(json)).toThrow("Unexpected 'eof' at line 1, col 31");
    })

    it ("throws an error for an incorrect number", () => {
      json = "[ -002 ]";
      expect(() => parse(json)).toThrow("Unexpected '0' at line 1, col 4");
    })

    it ("throws an error for an incorrect decimal", () => {
      json = "[ .2 ]";
      expect(() => parse(json)).toThrow("Unexpected '.' at line 1, col 2");
      json = "[ 1.2.3 ]";
      expect(() => parse(json)).toThrow("Unexpected '.' at line 1, col 5");
    })

    it ("throws an error for unexpected tokens", () => {
      json = "{ \"foo\",: \"bar\" }";
      expect(() => parse(json)).toThrow("Unexpected ',' at line 1, col 7");
    })
  })
})

