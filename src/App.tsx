import { useEffect, useState } from "react";
import "./App.css";
import { GameState, wordList } from "./utils/utils";
import Paragraph from "./components/Paragraph";

export default function App() {
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [userInputs, setUserInputs] = useState(Array(wordList.length).fill(""));
  const [correctWordCount, setCorrecWordCount] = useState(0);
  const [gameState, setGameState] = useState<GameState>("init");

  const handleGameEnd = (currentWord: string) => {
    alert(
      `Game Over! Correct Word Count: ${
        correctWordCount +
        1 +
        (userInputs[wordIndex]?.trim() === currentWord ? 1 : 0)
      } out of ${wordList.length}`
    );
    setGameState("end");
    return;
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (
      event.key === "Shift" ||
      event.key === "Control" ||
      event.key === "Alt"
    ) {
      event.preventDefault;
      return; // Ignore modifier keys
    }

    const currentWord = wordList[wordIndex];

    switch (event.key) {
      case "Backspace":
        // Remove the last character
        setUserInputs((prev) => {
          const newInputs = [...prev];
          newInputs[wordIndex] = newInputs[wordIndex].slice(0, -1);
          return newInputs;
        });
        setCharIndex((prev) => Math.max(prev - 1, 0));
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
        if (charIndex < currentWord.length) {
          setUserInputs((inputs) => {
            const newInputs = [...inputs];
            newInputs[wordIndex] += event.key;
            return newInputs;
          });
          setCharIndex((prev) => prev + 1);
        }
        // Check if it's the last word
        if (
          wordIndex === wordList.length - 1 &&
          charIndex === currentWord.length - 1 &&
          userInputs[wordIndex] + event.key === currentWord // check if the last typed char is correct
        ) {
          handleGameEnd(currentWord);
          setCorrecWordCount((prev) => {
            return prev + 1;
          });
        }
        break;
    }
  };

  useEffect(() => {
    if (gameState !== "inProgress") {
      console.log(gameState);
      return;
    }
    window.addEventListener("keydown", handleKeyDown, false);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [wordIndex, charIndex, userInputs, correctWordCount, gameState]);

  return (
    <div className="text-textColor">
      <h1 className="text-3xl uppercase">Typing Game</h1>
      <Paragraph
        gameState={gameState}
        userInputs={userInputs}
        currentWordIndex={wordIndex}
      />
      <button
        onClick={() => {
          setGameState("inProgress");
        }}
        disabled={gameState === "inProgress"}
        className="bg-itemColor p-2 mt-10 rounded shadow-lg shadow-shadowColor
      active:bg-transparent outline-none transition ease-in duration-500"
      >
        Start Game!
      </button>
    </div>
  );
}
