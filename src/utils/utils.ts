import { Results } from "./types";

export const PARA_URL = "https://random-word-api.herokuapp.com/word?number=50";

export const FunctionKeys = [
  "Shift",
  "Control",
  "Alt",
  "CapsLock",
  "Enter",
  "Escape",
];

export function GetResults(
  correctWordCount: number,
  timeElapsed: number,
  totalWordCount: number
): Results {
  return {
    wpm: (correctWordCount / timeElapsed) * 60,
    accuracy: (correctWordCount / totalWordCount) * 100,
  };
}
