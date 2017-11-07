const stringify = require('../stringify.js');

describe("stringify()", () => {
  let obj;

  describe("objects", () => {

    it ("correctly stringifies a simple object", () => {
      obj = { key: 'value', foo: 'bar' };
      expect(stringify(obj)).toEqual("{\"key\":\"value\",\"foo\":\"bar\"}");
    })

    it ("ignores whitespace in simple objects", () => {
      obj = {     key:  'value'   , foo:               'bar'};
      expect(stringify(obj)).toEqual("{\"key\":\"value\",\"foo\":\"bar\"}");
    })
  })

  describe("arrays", () => {

    it ("correctly stringifies simple arrays", () => {
      obj = [ "one", 2, 3, "four" ];
      expect(stringify(obj)).toEqual("[\"one\",2,3,\"four\"]");
    })

    it ("ignores whitespace in simple arrays", () => {
      obj = [           "one"   ,2    ,    3 , "four"     ];
      expect(stringify(obj)).toEqual("[\"one\",2,3,\"four\"]");
    })
  })

  describe("strings", () => {

    it ("correctly stringifies simple strings", () => {
      obj = [ "string" ];
      expect(stringify(obj)).toEqual("[\"string\"]");
    })

    it ("correctly stringifies strings with spaces", () => {
      obj = [ "this string has spaces" ];
      expect(stringify(obj)).toEqual("[\"this string has spaces\"]");
    })

    it ("correctly stringifies strings with numbers, commas, and colons", () => {
      obj = [ "this string has numbers: 10 5879 23, commas, and colons::" ];
      expect(stringify(obj)).toEqual("[\"this string has numbers: 10 5879 23, commas, and colons::\"]");
    })

    it ("correctly stringifies a string with escape characters", () => {
      obj = [ "this is\ta \"string\" with\fescape characters" ];
      expect(stringify(obj)).toEqual("[\"this is\ta \"string\" with\fescape characters\"]");
    })
  })

  describe("numbers", () => {

    it ("correctly stringifies simple integers", () => {
      obj = { one: 1, two: 2, three: 3 };
      expect(stringify(obj)).toEqual("{\"one\":1,\"two\":2,\"three\":3}")
    })

    it ("correctly stringifies multi-digit integers", () => {
      obj = [ 1400, 59874, 12, 003 ];
      expect(stringify(obj)).toEqual("[1400,59874,12,3]");
    })
  })

  describe("special values", () => {

    it ("correctly stringifies boolean values", () => {
      obj = { "true": true, "false": false };
      expect(stringify(obj)).toEqual("{\"true\":true,\"false\":false}");
    })

    it ("correctly stringifies 'null'", () => {
      obj = [ null, "null", null ];
      expect(stringify(obj)).toEqual("[null,\"null\",null]");
    })
  })

  describe("objects and arrays", () => {

    it ("correctly parses nested arrays", () => {
      obj = [ [ 1, 2 ], 3, { four: [ 5, 6, 7 ] } ];
      expect(stringify(obj)).toEqual("[[1,2],3,{\"four\":[5,6,7]}]");
    })

    it ("correctly parses nested objects", () => {
      obj = { obj: { foo: 'bar', array: [ 1, 2, [ 3, 4 ] ] } };
      expect(stringify(obj)).toEqual("{\"obj\":{\"foo\":\"bar\",\"array\":[1,2,[3,4]]}}");
    })
  })

  describe("multi-line objects", () => {

    it ("correctly stringifies multi-line objects", () => {
      obj = require('./support/simple.js');
      expect(stringify(obj)).toEqual('{"foo":"bar","baz":"bang","boom":[1,2,3,true,null,false],"nested":{"level":{"one":{"two":{"three":"three"}}}},"bang":"bang"}');
    })
  })
})
