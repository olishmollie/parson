const fs = require('fs');
let Parson = { parse, stringify };
module.exports = Parson;

function stringify(obj) {
  if (typeof(obj) === 'string') {
    return '"' + obj + '"';
  } else if (typeof(obj) === 'number') {
    return obj.toString();
  } else {
    if (obj.length) {
      return arrayStr(obj);
    }
    return objStr(obj);
  }
}

function arrayStr(obj) {
  let result = "[";
  for (let i = 0, len = obj.length; i < len; i++) {
    result += stringify(obj[i]);
    result += (i != len - 1) ? "," : "";
  }
  result += "]";
  return result;
}

function objStr(obj) {
  let result = "{";
  let keys = Object.keys(obj);
  for (let i = 0, len = keys.length; i < len; i++) {
    result += '"' + keys[i] + '":' + stringify(obj[keys[i]]);
    result += (i != len - 1) ? "," : "";
  }
  result += "}";
  return result;
}

function parse(input) {
  let p = Parser(input);
  return p.parse();

  function Parser(input) {
    let pos = 0;
    let len = input.length
    return {parse};

    function currChar() {
      if (pos < len)
	return input[pos];
    }

    function advance() {
      if (pos < len)
	return input[pos++];
    }

    function expect(type) {
      if (currType() === type) {
	advance();
      } else {
	barf(type);
      }
    }

    function barf(type) {
      throw "Unexpected " + currChar() + " of type " + currType()
	+ " at " + pos + ", expected " + type;
    }

    function skipSpaces() {
      while (/\s/.test(currChar()))
	advance();
    }

    function currType(inStr=false) {
      if (inStr)  {
	if (currChar() != '"')
	  return 'letter';
      }
      skipSpaces();
      return charType(currChar(), inStr);
    }

    function parse(input) {
      if (currType() === 'lbrace')
	return object();
      if (currType() === 'lbracket')
	return array();
      barf('object or array');
    }

    function object() {
      expect('lbrace');
      let result = {};
      let key = string();
      expect('colon');
      result[key] = value();
      while (currType() === 'comma') {
	expect('comma');
	key = string();
	expect('colon');
	result[key] = value();
      }
      expect('rbrace');
      return result;
    }

    function array() {
      expect('lbracket');
      let result = [];
      result.push(value());
      while (currType() === 'comma') {
	expect('comma');
	result.push(value());
      }
      expect('rbracket');
      return result;
    }

    function value() {
      if (currType() === 'quote')
	return string();
      if (currType() === 'digit')
	return number();
      if (currType() === 'lbracket')
	return array();
      if (currType() === 'lbrace')
	return object();
      barf('object, array, number, or string');
    }

    function readEscapeChar() {
      const escapeChars = {
	'\\': '\\',
	'"': '"',
	'/': '/',
	'b': '\b',
	'f': '\f',
	'n': '\n',
	't': '\t'
      };
      expect('escape');
      if (escapeChars[currChar()]) {
	return escapeChars[currChar()];
      } else {
	barf('escape');
      }
    }

    function string() {
      expect('quote');
      let str = "";
      while (currType(true) === 'letter') {
	let c = currChar();
	if (isBackslash(c)) {
	  str += readEscapeChar();
	} else {
	  str += currChar();
	}
	advance();
      }
      expect('quote');
      return str;
    }

    function number() {
      let val = 0;
      let digitStr = "";
      while (currType() === 'digit') {
	digitStr += currChar();
	advance();
      }
      return parseInt(digitStr);
    }

    function charType(c) {
      if (isBrace(c))
	return braceType(c);
      if (isBracket(c))
	return bracketType(c);
      if (isQuote(c))
	return 'quote';
      if (isDigit(c))
	return 'digit';
      if (isColon(c))
	return 'colon';
      if (isComma(c))
	return 'comma';
      if (isBackslash(c))
	return 'escape';
      if (isLetter(c))
	return 'letter';
    }

    function braceType(c) {
      switch(c) {
	case '{': return 'lbrace';
	case '}': return 'rbrace';
      }
    }

    function bracketType(c) {
      switch(c) {
	case '[': return 'lbracket';
	case ']': return 'rbracket';
      }
    }

    function isBracket(c) {
      return /[\[\]]/.test(c);
    }

    function isBrace(c) {
      return /[\{\}]/.test(c);
    }

    function isColon(c) {
      return /\:/.test(c);
    }

    function isComma(c) {
      return /\,/.test(c);
    }

    function isQuote(c) {
      return /\"/.test(c);
    }

    function isBackslash(c) {
      return /\\/.test(c);
    }

    function isLetter(c) {
      return /[\w\d\W\s]/.test(c);
    }

    function isDigit(c) {
      return /[0-9]/.test(c);
    }

    function isSpace(c) {
      return /\s/.test(c);
    }
  }
}

let testJson = fs.readFileSync('spec/support/simple.json', {encoding: 'utf8'});
let obj = Parson.parse(testJson);
let obj2 = JSON.parse(testJson);
console.log(obj);
console.log(obj2);

