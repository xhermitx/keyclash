import { createContext, ReactNode, useEffect, useState } from "react";
import { GameContextType, GameState, Player, Results } from "../utils/types";
import { FunctionKeys, GetResults } from "../utils/utils";

export const GameContext = createContext<GameContextType | undefined>(
  undefined
);

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [name, setName] = useState<string>("");
  const [wordList, setWordList] = useState<string[]>([]);
  const [wordIndex, setWordIndex] = useState<number>(0);
  const [charIndex, setCharIndex] = useState<number>(0);
  const [userInputs, setUserInputs] = useState<string[]>(
    Array(wordList.length).fill("")
  );
  const [correctWordCount, setCorrecWordCount] = useState<number>(0);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [results, setResults] = useState<Results>({ wpm: 0, accuracy: 0 });

  const [gameId, setGameId] = useState<string>("");
  const [para, setPara] = useState<string>(
    "What even is Life? Isn't it just a tiny phenomena in this massive universe. If that were true(which I certainly believe it is), can't everything we think of or do be predicted? Think about it. If there was a certain computer which enough storage to have all the information of existence and could compute everything, won't it be able to predict everything that is about to happend from this point on?"
  );
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [gameState, setGameState] = useState<GameState>("created");
  const [winner, setWinner] = useState<string>("");
  const [socket, setSocket] = useState<WebSocket>();

  // useEffect(() => {
  //   if (gameId.length > 0) {
  //     const url = SERVER_URL + gameId;
  //     setSocket(new WebSocket(url));
  //   }
  // }, [gameId]);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  const handleGameEnd = (currentWord: string) => {
    const correctCount =
      correctWordCount +
      1 +
      (userInputs[wordIndex]?.trim() === currentWord ? 1 : 0);
    setResults(GetResults(correctCount, timeElapsed, wordList.length));
    setGameState("finished");
  };

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

  useEffect(() => {
    if (gameState !== "in_progress") {
      return;
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [charIndex, gameState]);

  // useEffect(() => {
  //   socket?.addEventListener("open", () => {
  //     console.log("Connection established");
  //   });

  //   socket?.addEventListener("message", (event) => {
  //     try {
  //       console.log("message: ", event.data);
  //       const message = JSON.parse(event.data);

  //       switch (message.type) {
  //         case "PositionBroadcast":
  //           if (players.length < 4) {
  //             // A New player is added to the game
  //             setPlayers((prev) => {
  //               const player: Player = {
  //                 name: message.name,
  //                 position: message.position,
  //               };
  //               const newPlayer = { ...prev, player };
  //               return newPlayer;
  //             });
  //           } else {
  //             // Update the positions
  //             setPlayers((prev) =>
  //               prev.map((player) =>
  //                 player.name === message.name
  //                   ? { ...player, position: message.position }
  //                   : player
  //               )
  //             );
  //           }
  //           break;

  //         case "StatusBroadcast":
  //           // Set the wordList initially
  //           if (para === "") {
  //             setIsLoading(false);
  //             setPara(message.payload.paragraph);
  //           }

  //           // Game has ended and we have a winner
  //           if (winner && message.payload.status === "finished") {
  //             setWinner(message.payload.winner);
  //           }

  //           //Update the game state
  //           message.payload.state && setGameState(message.payload.state);
  //       }
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   });
  // }, [socket]);

  return (
    <GameContext.Provider
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
        gameId,
        para,
        players,
        isLoading,
        winner,
        socket,

        setGameId,
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
        setIsLoading,
        setWinner,
        setPlayers,
        setPara,
        setSocket,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
