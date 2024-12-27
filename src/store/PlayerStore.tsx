// GameContext.tsx

import React, { createContext, useState, useEffect, ReactNode } from "react";
import { FunctionKeys, GetResults } from "../utils/utils";
import { PlayerContextType, GameState, Results, Player } from "../utils/types";

export const PlayerContext = createContext<PlayerContextType | undefined>(
  undefined
);

interface PlayerProviderProps {
  children: ReactNode;
}

export const PlayerProvider: React.FC<PlayerProviderProps> = ({ children }) => {
  const [wordList, setWordList] = useState<string[]>([]);
  const [name, setName] = useState<string>("");
  const [wordIndex, setWordIndex] = useState<number>(0);
  const [charIndex, setCharIndex] = useState<number>(0);
  const [userInputs, setUserInputs] = useState<string[]>([]);
  const [correctWordCount, setCorrecWordCount] = useState<number>(0);
  const [gameState, setGameState] = useState<GameState>("created");
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [results, setResults] = useState<Results>({ wpm: 0, accuracy: 0 });

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (gameState === "in_progress") {
      timer = setInterval(() => {
        setTimeElapsed((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [gameState]);

  const handleKeyDown = (event: KeyboardEvent) => {
    // Handle key down logic
    if (FunctionKeys.includes(event.key)) {
      event.preventDefault;
      return; // Ignore modifier keys
    }
    const currentWord = wordList[wordIndex] || "";
    switch (event.key) {
      case "Backspace":
        setUserInputs((prev) => {
          const newInputs = [...prev];
          newInputs[wordIndex] = newInputs[wordIndex].slice(0, -1); // Remove the last character
          return newInputs;
        });
        setCharIndex((prev) => Math.max(prev - 1, 0)); // Incase the index goes negative
        break;

      case " ":
        if (wordIndex === wordList.length - 1) {
          handleGameEnd(currentWord);
        }

        if (userInputs[wordIndex]?.trim() === currentWord) {
          setCorrecWordCount((prev) => prev + 1);
        }
        //Jump to next word
        setWordIndex((prev) => prev + 1);
        setCharIndex(0);
        break;

      default:
        setUserInputs((inputs) => {
          const newInputs = [...inputs];
          newInputs[wordIndex] += event.key;
          return newInputs;
        });
        setCharIndex((prev) => prev + 1);
        // Check if it's the last word
        if (
          wordIndex === wordList.length - 1 &&
          charIndex === currentWord.length - 1 &&
          userInputs[wordIndex] + event.key === currentWord // check if the last typed char is correct
        ) {
          handleGameEnd(currentWord);
          setCorrecWordCount((prev) => prev + 1);
        }
        break;
    }
  };

  useEffect(() => {
    if (gameState !== "in_progress") {
      return;
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [charIndex, gameState]);

  const handleGameEnd = (currentWord: string) => {
    const correctCount =
      correctWordCount +
      1 +
      (userInputs[wordIndex]?.trim() === currentWord ? 1 : 0);
    setResults(GetResults(correctCount, timeElapsed, wordList.length));
    setGameState("finished");
  };

  return (
    <PlayerContext.Provider
      value={{
        name,
        wordList,
        wordIndex,
        charIndex,
        userInputs,
        correctWordCount,
        gameState,
        timeElapsed,
        results,

        setWordIndex,
        setCharIndex,
        setUserInputs,
        setCorrecWordCount,
        setGameState,
        setResults,
        setName,
        handleGameEnd,
        setWordList,
        handleKeyDown,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};
