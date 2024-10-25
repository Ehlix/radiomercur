import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

// en, ru
const wordRegex = /Unknown word\s+\(([\p{L}-]+)\)/gu;
const words = new Set();

rl.on('line', (line) => {
  let match;
  while ((match = wordRegex.exec(line)) !== null) {
    words.add(match[1]);
  }
});

rl.on('close', () => {
  console.log('\x1b[31m', '\nFix this words or add in cspell.json/words (words full path use - pnpm cspell:check):\n');  //red
  console.log(JSON.stringify(Array.from(words), null, 2));
});
