import katex from 'katex';

function tryParse(str) {
  try {
    return katex.renderToString(str, {throwOnError: false});
  } catch (e) {
    return e.toString();
  }
}

console.log("TEST 1:", tryParse("h(x) = x\\sqrt{2 - x^2}"));
console.log("TEST 2:", tryParse(String.raw`h(x) = x\sqrt{2 - x^2}`));
console.log("TEST 3:", tryParse("h(x) = x\\\\sqrt{2 - x^2}"));
console.log("TEST 4:", tryParse("h'(x) = \\frac{2(1-x^2)}{\\sqrt{2-x^2}}"));
console.log("TEST 5:", tryParse(String.raw`h'(x) = \frac{2(1-x^2)}{\sqrt{2-x^2}}`));
