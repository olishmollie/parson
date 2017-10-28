const TokenStream = require('./TokenStream.js');

module.exports = function Interpreter(input) {

  let ts = TokenStream(input);

  return { expr };

  function expect(type) {
    let tk = ts.peek();
    if (tk.type === type)
      return ts.next();
    else
      ts.croak("Expected " + type + ", got " + tk.type);
  }

  function factor() {
    let result;
    if (currtok().type === 'LParen') {
      expect('LParen');
      result = expr();
      expect('RParen');
    } else {
      result = expect('number').value;
    }
    return result;
  }

  function term() {
    let result = factor();
    while (currtok().type === 'mul' || currtok().type === 'div') {
      if (currtok().type === 'mul')
	result = calc(expect('mul'), result, factor());
      else if (currtok().type === 'div')
	result = calc(expect('div'), result, factor());
    }
    return result;
  }

  function expr() {
    try {
      let result = term();
      while (currtok().type === 'plus' || currtok().type === 'minus') {
	if (currtok().type === 'plus')
	  result = calc(expect('plus'), result, term());
	else if (currtok().type === 'minus')
	  result = calc(expect('minus'), result, term());
      }
      return result;
    } catch (err) {
      return err;
    }
  }

  function currtok() {
    return ts.peek();
  }

  function calc(op, a, b) {
    switch (op.type) {
      case 'plus': return a + b;
      case 'minus': return a - b;
      case 'mul': return a * b;
      case 'div':
	if (b != 0)
	  return a / b;
	ts.croak("Division by zero");
    }
  }

  function eof() {
    return ts.peek().type === 'eof';
  }

}
