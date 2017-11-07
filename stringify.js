module.exports = stringify;

function stringify(obj) {
  switch(typeof(obj)) {
    case 'boolean':
    case 'number':
      return obj.toString();
    case 'string':
      return '"' + obj + '"';
    default:
      if (obj === null) {
	return "null";
      } else if (obj.length) {
	return arrayStr(obj);
      } else {
	return objStr(obj);
      }
  }
}

function arrayStr(obj) {
  let result = "[";
  for (let i = 0, len = obj.length; i < len; i++) {
    result += stringify(obj[i]);
    result += (i != len - 1) ? "," : "";
  }
  result += "]";
  return result;
}

function objStr(obj) {
  let result = "{";
  let keys = Object.keys(obj);
  for (let i = 0, len = keys.length; i < len; i++) {
    result += '"' + keys[i] + '":' + stringify(obj[keys[i]]);
    result += (i != len - 1) ? "," : "";
  }
  result += "}";
  return result;
}

