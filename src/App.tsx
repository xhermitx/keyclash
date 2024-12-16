import { useEffect, useState } from "react";
import "./App.css";
import { FunctionKeys, GameState, PARA_URL } from "./utils/utils";
import Paragraph from "./components/Paragraph";
import StartButton from "./components/StartButton";
import axios from "axios";

export default function App() {
  const [wordList, setWordList] = useState([""]);
  const [isLoading, setIsLoading] = useState(true);

  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [userInputs, setUserInputs] = useState([""]);
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
    const fetchData = async () => {
      try {
        const res = await axios.get(PARA_URL);
        setWordList(res.data);
        setUserInputs(Array(res.data.length).fill(""));
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setWordList("Error Generating Paragraph: Reload".split(" "));
      }
    };
    fetchData();
  }, []);

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
        wordList={wordList}
      />
      {gameState === "init" && <StartButton setGameState={setGameState} />}
    </div>
  );
}
