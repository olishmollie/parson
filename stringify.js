module.exports = function stringify(obj) {
  if (typeof(obj) === 'string') {
    return '"' + obj + '"';
  } else if (typeof(obj) === 'number') {
    return obj.toString();
  } else {
    if (obj.length) {
      return arrayStr(obj);
    }
    return objStr(obj);
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

