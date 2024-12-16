import React from "react";
import { GameState } from "../utils/utils";

const StartButton: React.FC<{
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}> = (props) => {
  return (
    <div
      onClick={() => {
        props.setGameState("inProgress");
      }}
      className="text-lg p-2 mt-20 group relative w-max m-auto hover:cursor-pointer"
    >
      <span className="px-1 relative z-10 group-hover:text-white">
        Start Game
      </span>
      <span className="absolute rounded left-0 bottom-0 w-full h-0.5 transition-all bg-itemColor z-0 group-hover:h-full"></span>
    </div>
  );
};

export default StartButton;
