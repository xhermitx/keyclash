import React from "react";

export type GameState = "created" | "in_progress" | "finished";
export type PlayerState = "idol" | "typing" | "finished";

export interface Results {
  wpm: number;
  accuracy: number;
}

export interface PlayerContextType {
  name: string;
  wordList: string[];
  wordIndex: number;
  charIndex: number;
  userInputs: string[];
  correctWordCount: number;
  gameState: GameState;
  timeElapsed: number;
  results: Results;

  setName: React.Dispatch<React.SetStateAction<string>>;
  setWordList: React.Dispatch<React.SetStateAction<string[]>>;
  setWordIndex: React.Dispatch<React.SetStateAction<number>>;
  setCharIndex: React.Dispatch<React.SetStateAction<number>>;
  setUserInputs: React.Dispatch<React.SetStateAction<string[]>>;
  setCorrecWordCount: React.Dispatch<React.SetStateAction<number>>;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  setResults: React.Dispatch<React.SetStateAction<Results>>;
  handleKeyDown: (event: KeyboardEvent) => void;
  handleGameEnd: (currentWord: string) => void;
}

export interface Player {
  name: string;
  position: number;
}

export interface GameContextType {
  name: string;
  wordList: string[];
  wordIndex: number;
  charIndex: number;
  userInputs: string[];
  gameId: string;
  correctWordCount: number;
  results: Results;
  para: string;
  players: Player[];
  isLoading: boolean;
  gameState: GameState;
  winner: string;
  socket: WebSocket | undefined;
  timeElapsed: number;

  setName: React.Dispatch<React.SetStateAction<string>>;
  setWordList: React.Dispatch<React.SetStateAction<string[]>>;
  setWordIndex: React.Dispatch<React.SetStateAction<number>>;
  setCharIndex: React.Dispatch<React.SetStateAction<number>>;
  setUserInputs: React.Dispatch<React.SetStateAction<string[]>>;
  setGameId: React.Dispatch<React.SetStateAction<string>>;
  setPara: React.Dispatch<React.SetStateAction<string>>;
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  setResults: React.Dispatch<React.SetStateAction<Results>>;
  setWinner: React.Dispatch<React.SetStateAction<string>>;
  setCorrecWordCount: React.Dispatch<React.SetStateAction<number>>;
  setSocket: React.Dispatch<React.SetStateAction<WebSocket | undefined>>;
  handleKeyDown: (event: KeyboardEvent) => void;
  handleGameEnd: (currentWord: string) => void;
}

export interface GameUpdate {
  status: GameState;
  paragraph: string;
  winner: string;
}

export interface PositionUpdate {
  Name: string;
  Position: number;
}

export type ServerMessage =
  | { type: "Position"; payload: PositionUpdate }
  | { type: "Status"; payload: GameUpdate };
