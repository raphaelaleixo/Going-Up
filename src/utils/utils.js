export const getRandom = (arr, n) => {
  const result = new Array(n);
  let len = arr.length;
  const taken = new Array(len);

  if (n > len)
    throw new RangeError("getRandom: more elements taken than available");
  while (n--) {
    var x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
};

export const rollDice = (sides, isRange, results) => {
  const value = Math.floor(Math.random() * sides) + 1;
  if (!isRange) {
    return results
      .filter(result => result.value === value || result.else)
      .map(result => result.face)[0];
  }
};

export const arraysEqual = (_arr1, _arr2) => {
  if (
    !Array.isArray(_arr1) ||
    !Array.isArray(_arr2) ||
    _arr1.length !== _arr2.length
  )
    return false;
  var arr1 = _arr1.concat().sort();
  var arr2 = _arr2.concat().sort();
  for (var i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
};

let i = 0;
export let cards = [];
while (i < 76) {
  if (i < 18) {
    cards.push("yellow");
  } else if (i < 36) {
    cards.push("green");
  } else if (i < 54) {
    cards.push("red");
  } else if (i < 72) {
    cards.push("purple");
  } else {
    cards.push("wild");
  }
  i++;
}
