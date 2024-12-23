export type GameState = "created" | "in_progress" | "finished";

export interface Results {
  wpm: number;
  accuracy: number;
}

export interface GameContextType {
  wordList: string[];
  isLoading: boolean;
  wordIndex: number;
  charIndex: number;
  userInputs: string[];
  correctWordCount: number;
  gameState: GameState;
  timeElapsed: number;
  results: Results;
  setWordIndex: React.Dispatch<React.SetStateAction<number>>;
  setCharIndex: React.Dispatch<React.SetStateAction<number>>;
  setUserInputs: React.Dispatch<React.SetStateAction<string[]>>;
  setCorrecWordCount: React.Dispatch<React.SetStateAction<number>>;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  setResults: React.Dispatch<React.SetStateAction<Results>>;
  handleGameEnd: (currentWord: string) => void;
}
