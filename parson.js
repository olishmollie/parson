const fs = require('fs');

function Parser(input) {
  let pos = 0;
  let len = input.length;

  return {parse};

  function currChar() {
    if (pos < len)
      return input[pos];
  }

  function advance() {
    if (pos < len)
      return input[pos++];
  }


  // object: '{' pair (, pair)* '}'
  // pair: string ':' value
  // array: '[' value (, value)* ']'
  // value: string | number | object | array
  // string: '"' letter* '"'
  // letter: \w | \d | \W | \s
  // number: digit*
  // digit: 0-9

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

  function parse() {
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

  function string() {
    expect('quote');
    let str = "";
    while (currType(true) === 'letter') {
      str += currChar();
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

// let p = Parser("91");
// console.log(p.value());
// p = Parser("\"Hello World!\"");
// console.log(p.value());
// let p = Parser("{ \"foo\": \"bar\", \"one, hundred\": 100 }")
// console.log(p.object());
// p = Parser("[1, 2, 3, 4, \"foo\", 15]");
// console.log(p.array());
let testJson = fs.readFileSync('spec/support/simple.json', {encoding: 'utf8'});
let p = Parser(testJson)
let obj = p.parse();
console.log(obj.four);
