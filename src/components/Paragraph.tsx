import { useContext } from "react";
import { GameContext } from "../store/GameStore";

const Paragraph: React.FC = () => {
  const gameContext = useContext(GameContext);

  if (!gameContext) {
    throw new Error("YourComponent must be used within a GameProvider");
  }

  const { players, playerColor, gameState, userInputs, wordIndex, wordList } =
    gameContext;

  return (
    <div className="relative flex mt-10 mb-16 justify-center p-2">
      <p
        className={`flex flex-wrap justify-between h-64 w-[800px] text-xl border p-2
          ${gameState === "created" ? "blur-sm" : ""}`}
      >
        {wordList.map((word, wordIdx) => {
          let className = "";
          let wordState = "";

          Object.values(players).length > 0 &&
            Object.values(players).forEach((player) => {
              if (player.position === wordIdx) {
                wordState = `${playerColor[player.name]} text-white`;
              }
            });

          if (wordIdx === wordIndex) {
            if (userInputs[wordIdx].length > word.length)
              wordState = "bg-red-300 text-white";
          }

          return (
            <span key={wordIdx} className={`${wordState} mr-1`}>
              {/* Split the word into characters and compare with user input */}
              {word.split("").map((character, charIdx) => {
                if (wordIdx === wordIndex) {
                  className = " bg-shadowColor";
                }
                if (
                  wordIdx < wordIndex &&
                  userInputs[wordIdx][charIdx] !== character
                ) {
                  className = "text-red-500";
                }
                if (userInputs[wordIdx].length <= word.length) {
                  if (userInputs[wordIdx][charIdx] !== undefined) {
                    className =
                      character === userInputs[wordIdx][charIdx]
                        ? "text-green-500" // Signifies correct char
                        : "text-red-500"; // Signifies wrogn char
                  }
                } else {
                  className = "text-red-500";
                }
                return (
                  <span className={className} key={`${wordIdx} - ${charIdx}`}>
                    {character}
                  </span>
                );
              })}
            </span>
          );
        })}
      </p>
      {gameState === "created" && (
        <div
          className={`flex rounded-2xl absolute top-0 h-72 w-[820px] text-3xl justify-center
         bg-shadowColor bg-opacity-80`}
        >
          <h1 className="my-auto">Click the button to Start!</h1>
        </div>
      )}
    </div>
  );
};

export default Paragraph;
