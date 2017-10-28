const TokenStream = require('./TokenStream.js');

module.exports = function Interpreter(input) {

  let ts = TokenStream(input);

  return { eval };

  function eval() {
    try {
      let a = expect('number');
      let op = expect('op');
      let b = expect('number');
      return calc(op, a, b);
    } catch (err) {
      return err;
    }
  }

  function expect(type) {
    let tk = ts.peek();
    if (tk.type === type)
      return ts.next();
    else
      ts.croak("Expected " + type + ", got " + tk.type);
  }

  function calc(op, a, b) {
    switch (op.value) {
      case '+': return a.value + b.value;
      case '-': return a.value - b.value;
      case '*': return a.value * b.value;
      case '/':
	if (b.value != 0)
	  return a.value / b.value;
	ts.croak("Division by zero");
    }
  }

}
