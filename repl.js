const readline = require('readline');

const Interpreter = require('./Interpreter.js');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
  prompt: ">> "
});

rl.prompt();

rl.on('line', (line) => {
  let i = Interpreter(line);
  console.log(i.expr());
  rl.prompt();
});
