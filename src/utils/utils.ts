import { Results } from "./types";

export const SERVER_URL = "ws://localhost:8080/game/ws/";

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
