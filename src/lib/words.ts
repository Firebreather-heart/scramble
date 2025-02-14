export const wordList = [
  { word: "typescript", hint: "A typed superset of JavaScript" },
  { word: "programming", hint: "Writing code to create software" },
  { word: "interface", hint: "A contract defining object structure" },
  { word: "developer", hint: "Someone who creates software" },
  { word: "component", hint: "A reusable piece of UI" },
] as const;

export function scrambleWord(word: string): string {
  const array = word.split('');
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  const scrambled = array.join('');
  return scrambled === word ? scrambleWord(word) : scrambled;
}
