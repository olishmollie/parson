const InputStream = require('./InputStream.js');

module.exports = function TokenStream(input) {
  let current = null;
  let istream = InputStream(input);

  return { next, peek, eof, croak };

  function readNext() {
    readWhile(isWhitespace);
    let c = istream.peek();
    if (istream.eof()) return null;
    if (isDigit(c))
      return readDigit();
    if (isOp(c))
      return { type: 'op', value: istream.next() };
    croak("Cannot parse '" + c + "'");
  }

  function readDigit() {
    let dstr = istream.next();
    while (isDigit(istream.peek()))
      dstr += istream.next();
    return { type: 'number', value: parseFloat(dstr) };
  }

  function readWhile(predicate) {
    while (!istream.eof() && predicate(istream.peek()))
      istream.next();
  }

  function isWhitespace(c) {
    return /\s/.test(c);
  }

  function isDigit(c) {
    return /\d/.test(c);
  }

  function isOp(c) {
    return /^\+$|^\-$|^\*$|^\/$/.test(c);
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
