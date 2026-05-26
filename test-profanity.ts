import { containsProfanity } from './lib/security';

const testCases = [
  { text: "Protocole Nexus", expected: false },
  { text: "merde", expected: true },
  { text: "un nom avec merde dedans", expected: true },
  { text: "connard", expected: true },
  { text: "CONSULTANT", expected: false }, // "con" is in "consultant"
  { text: "SQUAD-FUCK", expected: true },
  { text: "squad-fuck-alpha", expected: true },
  { text: "pure-nature", expected: false },
  { text: "Bite", expected: true },
  { text: "Bitume", expected: false },
];

let failed = 0;

testCases.forEach(({ text, expected }) => {
  const result = containsProfanity(text);
  if (result !== expected) {
    console.error(`FAIL: "${text}" | Expected: ${expected} | Got: ${result}`);
    failed++;
  } else {
    console.log(`PASS: "${text}" | Result: ${result}`);
  }
});

if (failed > 0) {
  console.log(`\nTests failed: ${failed}`);
  process.exit(1);
} else {
  console.log("\nAll security tests passed!");
}
