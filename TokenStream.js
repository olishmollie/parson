const InputStream = require('./InputStream.js');

module.exports = function TokenStream(input) {
  let current = null;
  let istream = InputStream(input);

  return { next, peek, eof, croak };

  function NumberToken(value) {
    return { type: 'number', value: parseInt(value) };
  }

  function OpToken(value) {
    return { type: 'op', value };
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

  function readNext() {
    skipWhitespace();
    let c = istream.peek();
    if (eof())
      return eofToken();
    if (isNumber(c))
      return readNumber();
    if (isOp(c))
      return OpToken(istream.next());
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

  function isIdent(c) {
    return /\w/.test(c);
  }

  function isNumber(c) {
    return /\d/.test(c);
  }

  function isOp(c) {
    return /[+\-*\/=]/.test(c);
  }

  function next() {
    let tmp = current;
    current = null;
    return tmp || readNext();
  }

  function peek() {
    return current || (current = readNext());
  }

  function eof() {
    return istream.eof();
  }

  function croak(msg) {
    throw istream.croak(msg);
  }
}
