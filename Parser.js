const TokenStream = require('./TokenStream.js');

module.exports = function Parser(input) {

  let ts = TokenStream(input);

  return { parse, object, string, value, array };

  function expect(type) {
    let currtype = currtok().type;
    if (currtype === type) {
      return ts.next();
    }
    else {
      ts.croak("Unexpected '" + currtype + "', expected '" + type);
    }
  }

  function parse() {
    let currtype = currtok().type;
    if (currtype === 'lbracket') {
      return array();
    } else if (currtype === 'lbrace') {
      return object();
    }
    ts.croak("Unexpected " + currtype);
  }

  function string() {
    expect('quotationMark');
    let str = "";
    while (currtok(false).type === 'ident') {
      str += ts.next(false).value;
    }
    expect('quotationMark');
    return str;
  }

  function value() {
    let curr = currtok();
    if (curr.type === 'number') {
      let num = expect('number');
      return num.value;
    } else if (curr.type === 'quotationMark') {
      return string();
    } else if (curr.type === 'lbrace') {
      return object();
    } else if (curr.type === 'lbracket') {
      return array();
    } else {
      ts.croak("Parser error");
    }
  }

  function object() {
    let result = {};
    expect('lbrace');
    let key = string();
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
    let result = [];
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

