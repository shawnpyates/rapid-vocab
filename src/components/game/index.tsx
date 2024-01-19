import React from "react";
import { nanoid } from "nanoid";
import { useEffect, useMemo, useState } from "react";

import type { Pair } from "@prisma/client"

const getRandomPairs = (arr: Pair[]) => {
  const remainingPairs = [...arr];
  const currentPairs = Array.from({
    length: remainingPairs.length < 5 ? remainingPairs.length : 5
  }).map(() => {
    const selectedIndex = Math.floor(Math.random() * remainingPairs.length);
    const selectedPair = remainingPairs[selectedIndex];
    remainingPairs.splice(selectedIndex, 1);
    return selectedPair
  });
  console.log("cc: ", currentPairs);
  return [currentPairs, remainingPairs];
};

const shuffle = (list: string[]) => {
  const cloned = [...list];
  for (let i = cloned.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cloned[i], cloned[j]] = [cloned[j], cloned[i]];
  }
  return cloned;
};


const GameBoard = ({ pairs }: { pairs: Pair[] }) => {
  const [currentPairSet, setCurrentPairSet] = useState<{
    id: string;
    pairs: Pair[];
  }>();
  const [remainingPairs, setRemainingPairs] = useState<Pair[]>(pairs);
  const [correctGuesses, setCorrectGuesses] = useState<Pair[]>();
  const [currentLeft, setCurrentLeft] = useState<string | null>();
  const [currentWrongGuess, setCurrentWrongGuess] = useState<{
    left: string;
    right: string;
  } | null>();

  useEffect(() => {
    console.log("cg len: ", correctGuesses?.length);
    console.log("ccs len: ", currentPairSet?.pairs.length);
    if (
      !currentPairSet ||
      correctGuesses?.length === currentPairSet.pairs.length
    ) {
      console.log("rc: ", remainingPairs);
      const [current, remaining] = getRandomPairs(remainingPairs);
      setCurrentPairSet({ id: nanoid(), pairs: current });
      setCorrectGuesses([]);
      setRemainingPairs(remaining);
    }
  }, [currentPairSet, correctGuesses, remainingPairs]);

  const shuffledLeft = useMemo(
    () =>
      currentPairSet?.pairs &&
      shuffle(currentPairSet.pairs.map((pair) => pair.englishTerm)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentPairSet?.id]
  );

  const shuffledRight = useMemo(
    () =>
      currentPairSet?.pairs &&
      shuffle(currentPairSet.pairs.map((pair) => pair.l2Term)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentPairSet?.id]
  );

  console.log("cwg: ", currentWrongGuess);

  return (
    <div className="h-full w-full flex justify-center">
      <div className="border h-[500px] w-[1000px] flex justify-around">
        <div className="h-full w-60 border flex flex-col justify-around">
          {shuffledLeft &&
            shuffledLeft.map((item) => (
              <div
                key={item}
                className={`w-full h-20 border flex justify-center items-center cursor-pointer ${
                  item === currentLeft ? "bg-yellow-500" : ""
                } ${
                  correctGuesses?.some((guess) => guess.englishTerm === item)
                    ? "bg-green-500"
                    : ""
                } ${currentWrongGuess?.left === item ? "bg-red-500" : ""}`}
                onClick={() => {
                  setCurrentLeft(item);
                }}
              >
                {item}
              </div>
            ))}
        </div>
        <div className="h-full w-60 border flex flex-col justify-around">
          {shuffledRight &&
            shuffledRight.map((item) => (
              <div
                key={item}
                className={`w-full h-20 border flex justify-center items-center ${
                  correctGuesses?.some((guess) => guess.l2Term === item)
                    ? "bg-green-500"
                    : ""
                } ${currentWrongGuess?.right === item ? "bg-red-500" : ""} ${
                  currentLeft ? "cursor-pointer" : "cursor-not-allowed"
                }`}
                onClick={() => {
                  if (!currentLeft) return;
                  const currentLeftPair = currentPairSet?.pairs.find(
                    (pair) => pair.englishTerm === currentLeft
                  );
                  if (currentLeftPair?.l2Term === item) {
                    setCorrectGuesses((prev: Pair[] = []) => [
                      ...prev,
                      currentLeftPair
                    ]);
                  } else {
                    setCurrentWrongGuess({
                      left: currentLeft ?? "",
                      right: item
                    });
                    setCurrentLeft(null);
                    setTimeout(() => {
                      setCurrentWrongGuess(null);
                    }, 1000);
                  }
                }}
              >
                {item}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default GameBoard
