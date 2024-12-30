import { createContext, ReactNode, useEffect, useRef, useState } from "react";
import {
  colorCodes,
  GameContextType,
  GameStatus,
  Player,
  Results,
  ServerMessage,
} from "../utils/types";
import { FunctionKeys, GetResults, SERVER_URL } from "../utils/utils";

export const GameContext = createContext<GameContextType | undefined>(
  undefined
);

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const playerName = useRef("");
  const [wordList, setWordList] = useState<string[]>([]);
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [userInputs, setUserInputs] = useState<string[]>([]);
  const [correctWordCount, setCorrecWordCount] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [results, setResults] = useState<Results>({ wpm: 0, accuracy: 0 });

  const [gameId, setGameId] = useState("");
  const [para, setPara] = useState("");
  const [players, setPlayers] = useState<Record<string, Player>>({});
  const [playerColor, setPlayerColor] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [gameState, setGameState] = useState<GameStatus>("created");
  const [winner, setWinner] = useState<string>("");
  const [socket, setSocket] = useState<WebSocket>();

  const handleGameEnd = (currentWord: string) => {
    const correctCount =
      correctWordCount +
      (userInputs[wordIndex]?.trim() === currentWord ? 2 : 1);
    setResults(GetResults(correctCount, timeElapsed, wordList.length));
    setGameState("player_done");
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

        const positionUpdate: Player = {
          name: playerName.current,
          position: wordIndex,
        };
        socket?.send(JSON.stringify(positionUpdate));

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

  useEffect(() => {
    const url = SERVER_URL + gameId;
    const socketInst = new WebSocket(url);
    setSocket(socketInst);

    socketInst.onopen = () => {
      console.log("Connection established");
    };

    socketInst.onmessage = (event) => {
      try {
        console.log("message: ", event.data);
        const message: ServerMessage = JSON.parse(event.data);

        switch (message.type) {
          case "Position":
            if (gameState === "created") {
              if (playerName.current === "") {
                playerName.current = message.payload.name;
                console.log("Player Name set: ", playerName.current);
              } else if (message.payload.name !== playerName.current) {
                setPlayers((prev) => {
                  const newPlayer: Player = {
                    name: message.payload.name,
                    position: message.payload.position,
                  };
                  return {
                    ...prev,
                    [newPlayer.name]: newPlayer, // Use the name as the key
                  };
                });
                setPlayerColor((prev) => ({
                  ...prev,
                  [message.payload.name]:
                    prev[message.payload.name] ??
                    colorCodes[Object.values(prev).length],
                }));
              }
            }
            break;

          case "Status":
            // Set the wordList initially
            if (para === "") {
              const newPara = message.payload.paragraph;
              setPara(newPara);
              setWordList(newPara.split(" "));
              setUserInputs(Array(newPara.split(" ").length).fill(""));
              setIsLoading(false);
            }

            // Game has ended and we have a winner
            if (winner === "" && message.payload.status === "finished") {
              setWinner(message.payload.winner);
            }

            //Update the game state
            message.payload.status && setGameState(message.payload.status);
        }
      } catch (err) {
        console.log(err);
      }
    };

    socketInst.onerror = (error: Event) => {
      console.log(error);
    };

    return () => {
      socketInst.close();
    };
  }, [gameId]);

  return (
    <GameContext.Provider
      value={{
        playerColor,
        playerName,
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
        handleGameEnd,
        setWordList,
        handleKeyDown,
        setIsLoading,
        setWinner,
        setPlayers,
        setPara,
        setSocket,
        setPlayerColor,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
