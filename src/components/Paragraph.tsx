import { GameState } from "../utils/types";

const Paragraph: React.FC<{
  gameState: GameState;
  userInputs: string[];
  currentWordIndex: number;
  wordList: string[];
}> = (props) => {
  return (
    <div className="relative flex mt-10 mb-16 justify-center p-2">
      <p
        className={`flex flex-wrap justify-between h-64 w-[800px] text-xl border p-2
          ${props.gameState === "created" ? "blur-sm" : ""}`}
      >
        {props.wordList.map((word, wordIdx) => {
          let className = "";
          let wordState = "";

          if (wordIdx === props.currentWordIndex) {
            if (props.userInputs[wordIdx].length > word.length)
              wordState = "bg-red-300 text-white";
          }
          return (
            <span key={wordIdx} className={`${wordState} mr-1`}>
              {/* Split the word into characters and compare with user input */}
              {word.split("").map((character, charIdx) => {
                if (wordIdx === props.currentWordIndex) {
                  className = " bg-shadowColor";
                }
                if (
                  wordIdx < props.currentWordIndex &&
                  props.userInputs[wordIdx][charIdx] !== character
                ) {
                  className = "text-red-500";
                }
                if (props.userInputs[wordIdx].length <= word.length) {
                  if (props.userInputs[wordIdx][charIdx] !== undefined) {
                    className =
                      character === props.userInputs[wordIdx][charIdx]
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
      {props.gameState === "created" && (
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
