import { useContext, useEffect } from "react";
// import { PlayerContext } from "../store/PlayerStore";
import Paragraph from "../components/Paragraph";
import StartButton from "../components/StartButton";
import ResultsChart from "../components/Results";
import { useParams } from "react-router-dom";
import { GameContext } from "../store/GameStore";
import { Player } from "../utils/types";

function GamePage() {
  const { roomId } = useParams();

  // const playerContext = useContext(PlayerContext);
  const gameContext = useContext(GameContext);

  if (!gameContext) {
    throw new Error("YourComponent must be used within a GameProvider");
  }

  const {
    para,
    isLoading,
    socket,
    name,
    gameState,
    wordList,
    userInputs,
    wordIndex,
    results,
    charIndex,
    setGameId,
    setUserInputs,
    setWordList,
    setGameState,
  } = gameContext;

  // const {
  //   name,
  //   gameState,
  //   wordList,
  //   userInputs,
  //   wordIndex,
  //   results,
  //   charIndex,
  //   setUserInputs,
  //   setWordList,
  //   setGameState,
  //   handleKeyDown,
  //   setName,
  // } = playerContext;

  useEffect(() => {
    setGameId(roomId ?? "");
  }, []);

  useEffect(() => {
    if (para.length > 0) {
      const temp = para.split(" ");
      setWordList(temp);
      setUserInputs(Array(temp.length).fill(""));
    }
  }, [para]);

  useEffect(() => {
    setGameState(gameState);
  }, [gameState]);

  useEffect(() => {
    const message: Player = {
      name: name,
      position: charIndex,
    };
    // Update the player position over Socket Server
    socket?.send(JSON.stringify(message));
  });

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
      <h2>Room ID: {roomId}</h2>
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

export default GamePage;
