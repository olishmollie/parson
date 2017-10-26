module.exports = function TokenStream(istream) {
  let current = null;

  return {
    next: next,
    peek: peek,
    eof: eof,
    croak: croak
  }

  function readNext() {
    readWhile(isWhitespace);
    if (istream.eof()) return null;
    if (isDigit(istream.peek()))
      return readDigit();
    if (isOp(istream.peek()))
      return readOp();
    istream.croak("Parsing error");
  }

  function readDigit() {
    let dstr = istream.next();
    while (isDigit(istream.peek()))
      dstr += istream.next();
    return { type: 'number', value: parseFloat(dstr) };
  }

  function readOp() {
    return { type: 'op', value: istream.next() };
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
    return /[\+\-\*\/]/.test(c);
  }

  function next() {
    return current = readNext();
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