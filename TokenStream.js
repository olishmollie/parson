const InputStream = require('./InputStream.js');

module.exports = function TokenStream(input) {
  let current = null;
  let istream = InputStream(input);

  return { next, peek, eof, croak };

  function NumberToken(value) {
    return { type: 'number', value: parseInt(value) };
  }

  function StringToken(value) {
    return { type: 'string', value: value }
  }

  function BracketToken(value) {
    switch(value) {
      case '[':
	return { type: 'lbracket', value };
      case ']':
	return { type: 'rbracket', value };
    }
  }

  function BraceToken(value) {
    switch(value) {
      case '{':
	return { type: 'lbrace', value };
      case '}':
	return { type: 'rbrace', value };
    }
  }

  function eofToken() {
    return { type: 'eof' };
  }

  function readNumber() {
    let value = "";
    while (isNumber(istream.peek())) {
      value += istream.next();
    }
    return NumberToken(value);
  }

  function readNext(inStr=false) {
    if (!inStr) skipWhitespace();
    let c = istream.peek();
    if (isQuote(c))
      return { type: 'quotationMark', value: istream.next() };
    if (inStr)
      return { type: 'ident', value: istream.next() };
    if (eof())
      return eofToken();
    if (isNumber(c))
      return readNumber();
    if (isBrace(c))
      return BraceToken(istream.next());
    if (isBracket(c))
      return BracketToken(istream.next());
    if (isComma(c))
      return { type: 'comma', value: istream.next() };
    if (isColon(c))
      return { type: 'colon', value: istream.next() };
    if (isIdent(c))
      return { type: 'ident', value: istream.next() };
    croak("Cannot parse '" + c + "'");
  }

  function skipWhitespace() {
    let str = "";
    while(isWhitespace(istream.peek())) {
      str += istream.next();
    }
  }

  function isWhitespace(c) {
    return /\s/.test(c);
  }

  function isQuote(c) {
    return /\"/.test(c);
  }

  function isBracket(c) {
    return /[\[\]]/.test(c);
  }

  function isBrace(c) {
    return /[\{\}]/.test(c);
  }

  function isComma(c) {
    return /\,/.test(c);
  }

  function isColon(c) {
    return /\:/.test(c);
  }

  function isIdent(c) {
    return /[\W\w\s]/.test(c);
  }

  function isParen(c) {
    return /[\(\)]/.test(c);
  }

  function isNumber(c) {
    return /\d/.test(c);
  }

  function next(inStr=false) {
    let tmp = current || readNext(inStr);
    current = readNext(inStr);
    return tmp || readNext(inStr);
  }

  function peek(inStr=false) {
    return current || (current = readNext(inStr));
  }

  function eof() {
    return istream.eof();
  }

  function croak(msg) {
    throw istream.croak(msg);
  }
}
