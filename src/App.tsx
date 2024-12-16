import { useEffect, useState } from "react";
import "./App.css";
import { FunctionKeys, GameState, wordList } from "./utils/utils";
import Paragraph from "./components/Paragraph";
import StartButton from "./components/StartButton";

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
    if (FunctionKeys.includes(event.key)) {
      event.preventDefault;
      return; // Ignore modifier keys
    }

    const currentWord = wordList[wordIndex];

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
      <h1 className="text-5xl uppercase">KEY-CLASH!</h1>
      <div
        className={`text-2xl mt-10 rounded w-56 m-auto h-10 border-2
            ${
              userInputs[wordIndex] === wordList[wordIndex]
                ? "text-green-500"
                : userInputs[wordIndex].length >= wordList[wordIndex].length
                ? "text-red-500"
                : ""
            }`}
      >
        {userInputs[wordIndex] || (wordIndex === 0 && "Typed Word Here")}
      </div>
      <Paragraph
        gameState={gameState}
        userInputs={userInputs}
        currentWordIndex={wordIndex}
      />
      {gameState === "init" && <StartButton setGameState={setGameState} />}
    </div>
  );
}
