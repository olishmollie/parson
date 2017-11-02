const readline = require('readline');

const Parser = require('./Parser.js');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
  prompt: ">> "
});

rl.prompt();

rl.on('line', (line) => {
  let i = Parser(line);
  console.log(i.array());
  rl.prompt();
});
