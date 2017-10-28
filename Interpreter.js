const TokenStream = require('./TokenStream.js');

module.exports = function Interpreter(input) {

  let ts = TokenStream(input);

  return { eval };

  function expect(type) {
    let tk = ts.peek();
    if (tk.type === type)
      return ts.next();
    else
      ts.croak("Expected " + type + ", got " + tk.type);
  }

  function term() {
    return expect('number').value;
  }

  function eval() {
    try {
      let result = term();
      while (currtok().value === '+' || currtok().value === '-') {
	let op = expect('op');
	let operand = term();
	result = calc(op, result, operand);
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
    switch (op.value) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/':
	if (b != 0)
	  return a / b;
	ts.croak("Division by zero");
    }
  }

  function eof() {
    return ts.peek().type === 'eof';
  }

}
