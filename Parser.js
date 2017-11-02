const TokenStream = require('./TokenStream.js');

module.exports = function Parser(input) {

  let ts = TokenStream(input);

  return { object, string, value, array };

  function expect(type) {
    if (currtok().type === type) {
      return ts.next();
    }
    else {
      throw "Parser error: unexpected " +
	currtok().type + ", expected " + type;
    }
  }

  function string() {
    expect('quotationMark');
    str = "";
    while (currtok(false).type === 'ident') {
      str += ts.next(false).value;
    }
    expect('quotationMark');
    return str;
  }

  function value() {
    curr = currtok();
    if (curr.type === 'number') {
      num = expect('number');
      return num.value;
    } else if (curr.type === 'quotationMark') {
      return string();
    }
  }

  function object() {
    result = {};
    expect('lbrace');
    key = string();
    expect('colon');
    result[key] = value();
    while (currtok().type === 'comma') {
      expect('comma');
      key = string();
      expect('colon');
      result[key] = value();
    }
    return result;
  }

  function array() {
    result = [];
    expect('lbracket');
    result.push(value());
    while (currtok().type === 'comma') {
      expect('comma');
      result.push(value());
    }
    return result;
  }

  function currtok(skipSpaces=true) {
    return ts.peek(skipSpaces);
  }

  function eof() {
    return ts.peek().type === 'eof';
  }

}

// let p = Parser("[\"Hello World!\", 32]");
// p.array();
