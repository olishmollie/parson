let len, pos, line, col, input;

module.exports = function parse(json) {
  input = json;
  len = json.length;
  pos = 0, line = 1, col = 0;

  skipSpaces();
  if (currType() === 'lbrace')
    return object();
  else if (currType() === 'lbracket')
    return array();
  else
    barf('object or array');
}

function object() {
  expect('lbrace');
  let result = {};
  let key = string();
  expect('colon');
  result[key] = value();
  while (currType() === 'comma') {
    expect('comma');
    key = string();
    expect('colon');
    result[key] = value();
  }
  expect('rbrace');
  return result;
}

function array() {
  expect('lbracket');
  let result = [];
  result.push(value());
  while (currType() === 'comma') {
    expect('comma');
    result.push(value());
  }
  expect('rbracket');
  return result;
}

function value() {
  skipSpaces();
  let result;
  let c = currChar();
  if (maybeTrue(c))
    result = readTrue();
  else if (maybeFalse(c))
    result = readFalse();
  else if (maybeNull(c))
    result = readNull();
  else if (currType() === 'quote')
    result = string();
  else if (currType() === 'digit')
    result = number();
  else if (currType() === 'lbracket')
    result = array();
  else if (currType() === 'lbrace')
    result = object();
  else
    barf('value');
  skipSpaces();
  return result;
}

function string() {
  expect('quote');
  let str = "";
  while (currType(true) === 'letter') {
    let c = currChar() || barf('quote');
    if (isBackslash(c)) {
      str += readEscapeChar();
    } else {
      str += currChar();
    }
    advance();
  }
  expect('quote');
  return str;
}

function number() {
  let val = 0;
  let digitStr = "";
  while (currType() === 'digit') {
    digitStr += currChar();
    advance();
  }
  return parseInt(digitStr);
}

function readFalse() {
  let goal = "false";
  let i = 0;
  while (i < 5) {
    if (currChar() != goal[i])
      barf(goal[i]);
    i++; advance();
  }
  return false;
}

function readTrue() {
  let goal = "true";
  let i = 0;
  while (i < 4) {
    if (currChar() != goal[i])
      barf(goal[i]);
    i++; advance();
  }
  return true;
}

function readNull() {
  let goal = "null";
  let i = 0;
  while (i < 4) {
    if (currChar() != goal[i])
      barf(goal[i]);
    i++; advance();
  }
  return null;
}

function readEscapeChar() {
  const escapeChars = {
    '\\': '\\',
    '"': '"',
    '/': '/',
    'b': '\b',
    'f': '\f',
    'n': '\n',
    't': '\t'
  };
  expect('escape');
  if (escapeChars[currChar()]) {
    return escapeChars[currChar()];
  } else {
    barf('escape');
  }
}

function currChar() {
  if (pos < len)
    return input[pos];
}

function advance() {
  if (pos < len) {
    if (currChar() == '\n') {
      line++; col = 0;
    }
    col++;
    return input[pos++];
  }
}

function expect(type) {
  skipSpaces();
  if (currType() === type) {
    advance();
  } else {
    barf(type);
  }
}

function barf(type) {
  let c = currChar() || 'eof';
  throw "Unexpected '" + c + "' at line " + line + ", col " + col;
}

function skipSpaces() {
  while (/\s/.test(currChar()))
    advance();
}

function currType(inStr=false) {
  if (inStr)  {
    if (currChar() != '"')
      return 'letter';
  }
  return charType(currChar());
}

function charType(c) {
  if (isBrace(c))
    return braceType(c);
  if (isBracket(c))
    return bracketType(c);
  if (isQuote(c))
    return 'quote';
  if (isDigit(c))
    return 'digit';
  if (isColon(c))
    return 'colon';
  if (isComma(c))
    return 'comma';
  if (isBackslash(c))
    return 'escape';
  if (isLetter(c))
    return 'letter';
  if (c === undefined)
    return 'eof';
}

function braceType(c) {
  switch(c) {
    case '{': return 'lbrace';
    case '}': return 'rbrace';
  }
}

function bracketType(c) {
  switch(c) {
    case '[': return 'lbracket';
    case ']': return 'rbracket';
  }
}

function isBracket(c) {
  return /[\[\]]/.test(c);
}

function isBrace(c) {
  return /[\{\}]/.test(c);
}

function isColon(c) {
  return /\:/.test(c);
}

function isComma(c) {
  return /\,/.test(c);
}

function isQuote(c) {
  return /\"/.test(c);
}

function maybeTrue(c) {
  return /t/.test(c);
}

function maybeFalse(c) {
  return /f/.test(c);
}

function maybeNull(c) {
  return /n/.test(c);
}

function isBackslash(c) {
  return /\\/.test(c);
}

function isLetter(c) {
  return /[\w\d\W\s]/.test(c);
}

function isDigit(c) {
  return /[0-9]/.test(c);
}

function isSpace(c) {
  return /\s/.test(c);
}
