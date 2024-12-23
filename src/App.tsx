import { useContext } from "react";
import "./App.css";
import Paragraph from "./components/Paragraph";
import StartButton from "./components/StartButton";
import ResultsChart from "./components/Results";
import { GameContext } from "./store/GameStore";

export default function App() {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error("YourComponent must be used within a GameProvider");
  }

  const {
    wordList,
    isLoading,
    gameState,
    userInputs,
    wordIndex,
    setGameState,
    results,
  } = context;

  if (isLoading) {
    return (
      <div className="rounded-md m-auto mt-48 h-12 w-12 border-4 border-t-4 border-itemColor animate-spin"></div>
    );
  }

  if (gameState === "finished") {
    return <ResultsChart results={results} />;
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
      {gameState === "created" && <StartButton setGameState={setGameState} />}
    </div>
  );
}
