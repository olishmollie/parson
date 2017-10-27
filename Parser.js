const TokenStream = require('./TokenStream.js');

module.exports = function Parser(input) {

  let ts = TokenStream(input);

  return { eval };

  function eval() {
    let next = ts.peek();
    try {
      switch (next.type) {
	case 'op':
	  return evalOp();
	case 'number':
	  return ts.next().value;
	default:
	  ts.croak("Unexpected char " + next.value);
      }
    } catch (err) {
      return err;
    }
  }

  function evalOp() {
    let op = ts.next();
    switch (op.value) {
      case '+':
	return eval() + eval();
      case '-':
	return eval() - eval();
      case '*':
	return eval() * eval();
      case '/':
	return eval() / eval();
    }
  }

}
