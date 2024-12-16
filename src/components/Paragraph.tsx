import { GameState, wordList } from "../utils/utils";

const Paragraph: React.FC<{
  gameState: GameState;
  userInputs: string[];
  currentWordIndex: number;
}> = (props) => {
  return (
    <div className="relative flex mt-32 mb-20 justify-center p-2">
      <p
        className={`flex flex-wrap justify-between h-56 w-[500px] text-2xl
          ${props.gameState === "init" ? "blur-sm" : ""}`}
      >
        {wordList.map((word, wordIdx) => (
          <span key={wordIdx} className="mr-1">
            {/* Split the word into characters and compare with user input */}
            {word.split("").map((character, charIdx) => {
              let className = "";

              if (wordIdx === props.currentWordIndex) {
                className = " bg-shadowColor";
              }
              if (
                wordIdx < props.currentWordIndex &&
                props.userInputs[wordIdx][charIdx] !== character
              ) {
                className = "text-red-500";
              }
              if (props.userInputs[wordIdx][charIdx] !== undefined) {
                className =
                  character === props.userInputs[wordIdx][charIdx]
                    ? "text-green-500" // Signifies correct char
                    : "text-red-500"; // Signifies wrogn char
              }
              return (
                <span className={className} key={`${wordIdx} - ${charIdx}`}>
                  {character}
                </span>
              );
            })}
          </span>
        ))}
      </p>
      {props.gameState === "init" ? (
        <div
          className={`flex rounded-2xl absolute top-0 h-72 w-[510px] text-3xl justify-center
         bg-shadowColor bg-opacity-80`}
        >
          <h1 className="my-auto">Click the button to Start!</h1>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Paragraph;
