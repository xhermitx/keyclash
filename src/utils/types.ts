import React from "react";

export type GameStatus = "created" | "in_progress" | "player_done" | "finished";
export const colorCodes = [
  "bg-blue-400",
  "bg-amber-400",
  "bg-orange-400",
  "bg-teal-400",
];

export interface Results {
  wpm: number;
  accuracy: number;
}

export interface Player {
  name: string;
  position: number;
}

export interface GameContextType {
  wordList: string[];
  wordIndex: number;
  charIndex: number;
  userInputs: string[];
  gameId: string;
  correctWordCount: number;
  results: Results;
  para: string;
  players: Record<string, Player>;
  playerColor: Record<string, string>;
  isLoading: boolean;
  gameState: GameStatus;
  winner: string;
  socket: WebSocket | undefined;
  timeElapsed: number;

  playerName: React.RefObject<string>;
  setPlayerColor: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  setWordList: React.Dispatch<React.SetStateAction<string[]>>;
  setWordIndex: React.Dispatch<React.SetStateAction<number>>;
  setCharIndex: React.Dispatch<React.SetStateAction<number>>;
  setUserInputs: React.Dispatch<React.SetStateAction<string[]>>;
  setGameId: React.Dispatch<React.SetStateAction<string>>;
  setPara: React.Dispatch<React.SetStateAction<string>>;
  setPlayers: React.Dispatch<React.SetStateAction<Record<string, Player>>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setGameState: React.Dispatch<React.SetStateAction<GameStatus>>;
  setResults: React.Dispatch<React.SetStateAction<Results>>;
  setWinner: React.Dispatch<React.SetStateAction<string>>;
  setCorrecWordCount: React.Dispatch<React.SetStateAction<number>>;
  setSocket: React.Dispatch<React.SetStateAction<WebSocket | undefined>>;
  handleKeyDown: (event: KeyboardEvent) => void;
  handleGameEnd: (currentWord: string) => void;
}

export interface GameUpdate {
  status: GameStatus;
  paragraph: string;
  winner: string;
}

export type ServerMessage =
  | { type: "Position"; payload: Player }
  | { type: "Status"; payload: GameUpdate };
